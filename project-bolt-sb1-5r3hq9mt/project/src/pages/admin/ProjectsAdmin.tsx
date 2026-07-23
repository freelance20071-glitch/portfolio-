import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Pencil, Trash2, Copy, X, Star, Eye, EyeOff,
} from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/admin/AdminUI';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/storage';
import { sanitizeUrl } from '@/lib/sanitize';
import type { Project } from '@/lib/types';

const EMPTY_PROJECT = {
  title: '',
  slug: '',
  short_description: '',
  long_description: '',
  technologies: [] as string[],
  features: [] as string[],
  challenges_solved: '',
  category: '',
  status: 'completed',
  cover_image_url: '',
  gallery_urls: [] as string[],
  video_url: '',
  live_demo_url: '',
  github_url: '',
  completion_date: '',
  featured: false,
  published: false,
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof EMPTY_PROJECT>(EMPTY_PROJECT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects((data as Project[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(set)] as string[];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.short_description.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === 'all' || p.category === filterCategory;
      const matchStatus = filterStatus === 'all' || (filterStatus === 'published' ? p.published : !p.published);
      return matchSearch && matchCat && matchStatus;
    });
  }, [projects, search, filterCategory, filterStatus]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_PROJECT);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      short_description: p.short_description,
      long_description: p.long_description,
      technologies: p.technologies,
      features: p.features,
      challenges_solved: p.challenges_solved ?? '',
      category: p.category ?? '',
      status: p.status,
      cover_image_url: p.cover_image_url ?? '',
      gallery_urls: p.gallery_urls,
      video_url: p.video_url ?? '',
      live_demo_url: p.live_demo_url ?? '',
      github_url: p.github_url ?? '',
      completion_date: p.completion_date ?? '',
      featured: p.featured,
      published: p.published,
    });
    setError(null);
    setShowForm(true);
  };

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const slug = form.slug || slugify(form.title);
    const payload = {
      ...form,
      slug,
      completion_date: form.completion_date || null,
      cover_image_url: sanitizeUrl(form.cover_image_url) || null,
      gallery_urls: form.gallery_urls.map((u) => sanitizeUrl(u)).filter(Boolean) as string[],
      video_url: sanitizeUrl(form.video_url) || null,
      live_demo_url: sanitizeUrl(form.live_demo_url) || null,
      github_url: sanitizeUrl(form.github_url) || null,
      challenges_solved: form.challenges_solved || null,
      category: form.category || null,
    };

    if (editing) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editing.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('projects').insert(payload);
      if (error) setError(error.message);
    }

    setSaving(false);
    if (!error) {
      setShowForm(false);
      load();
    }
  };

  const handleDelete = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    await supabase.from('projects').delete().eq('id', p.id);
    load();
  };

  const handleDuplicate = async (p: Project) => {
    const { id, created_at, updated_at, views, ...rest } = p;
    void id; void created_at; void updated_at; void views;
    await supabase.from('projects').insert({
      ...rest,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy`,
      published: false,
      featured: false,
    });
    load();
  };

  const togglePublished = async (p: Project) => {
    await supabase.from('projects').update({ published: !p.published }).eq('id', p.id);
    load();
  };

  const toggleFeatured = async (p: Project) => {
    await supabase.from('projects').update({ featured: !p.featured }).eq('id', p.id);
    load();
  };

  const handleCoverUpload = async (file: File) => {
    const url = await uploadFile(file, 'projects');
    if (url) setForm((f) => ({ ...f, cover_image_url: url }));
  };

  const handleGalleryUpload = async (files: FileList) => {
    const urls = await Promise.all(Array.from(files).map((f) => uploadFile(f, 'projects')));
    setForm((f) => ({ ...f, gallery_urls: [...f.gallery_urls, ...urls.filter(Boolean) as string[]] }));
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} total projects`}
        action={
          <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
            <Plus size={18} /> New Project
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-primary"
          />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-primary">
          {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-primary">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <EmptyState message="No projects found. Create your first project!" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-800">
                    <Star size={28} className="text-slate-600" />
                  </div>
                )}
                <div className="absolute right-2 top-2 flex gap-1.5">
                  {p.featured && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">Featured</span>}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.published ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-400">{p.short_description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.technologies.slice(0, 3).map((t) => (
                    <span key={t} className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{t}</span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1 border-t border-slate-800 pt-3">
                  <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white" title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDuplicate(p)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white" title="Duplicate">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => togglePublished(p)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white" title={p.published ? 'Unpublish' : 'Publish'}>
                    {p.published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => toggleFeatured(p)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-primary" title="Toggle featured">
                    <Star size={16} className={p.featured ? 'fill-primary text-primary' : ''} />
                  </button>
                  <div className="ml-auto">
                    <button onClick={() => handleDelete(p)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-900/30 hover:text-red-400" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 z-50 bg-black/70"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto rounded-t-2xl border border-slate-800 bg-slate-900 p-5 pb-[env(safe-area-inset-bottom)] sm:inset-x-auto sm:left-1/2 sm:top-10 sm:max-w-2xl sm:-translate-x-1/2 sm:rounded-2xl sm:pb-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="title">Title</label>
                    <input id="title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} required />
                  </div>
                  <div>
                    <label className="label" htmlFor="slug">Slug</label>
                    <input id="slug" className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} required />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="short">Short Description</label>
                  <input id="short" className="input" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} required />
                </div>

                <div>
                  <label className="label" htmlFor="long">Long Description</label>
                  <textarea id="long" rows={4} className="input resize-none" value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} required />
                </div>

                <div>
                  <label className="label">Technologies (comma separated)</label>
                  <input className="input" value={form.technologies.join(', ')} onChange={(e) => setForm({ ...form, technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} placeholder="React, TypeScript, Node.js" />
                </div>

                <div>
                  <label className="label">Features (comma separated)</label>
                  <input className="input" value={form.features.join(', ')} onChange={(e) => setForm({ ...form, features: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} placeholder="Feature 1, Feature 2" />
                </div>

                <div>
                  <label className="label" htmlFor="challenges">Challenges Solved</label>
                  <textarea id="challenges" rows={2} className="input resize-none" value={form.challenges_solved} onChange={(e) => setForm({ ...form, challenges_solved: e.target.value })} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="category">Category</label>
                    <input id="category" className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Web Applications" />
                  </div>
                  <div>
                    <label className="label" htmlFor="status">Status</label>
                    <select id="status" className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>
                </div>

                {/* Cover image */}
                <div>
                  <label className="label">Cover Image</label>
                  <div className="flex items-center gap-3">
                    {form.cover_image_url && <img src={form.cover_image_url} alt="Cover" className="h-16 w-24 rounded-lg object-cover" />}
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} className="text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white" />
                  </div>
                  <input className="input mt-2" placeholder="or paste image URL" value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
                </div>

                {/* Gallery */}
                <div>
                  <label className="label">Gallery Images</label>
                  <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)} className="text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white" />
                  {form.gallery_urls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.gallery_urls.map((url, i) => (
                        <div key={i} className="relative">
                          <img src={url} alt="" className="h-16 w-24 rounded-lg object-cover" />
                          <button type="button" onClick={() => setForm({ ...form, gallery_urls: form.gallery_urls.filter((_, idx) => idx !== i) })} className="absolute -right-1 -top-1 rounded-full bg-red-600 p-0.5 text-white">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="video">Video URL (YouTube)</label>
                    <input id="video" className="input" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
                  </div>
                  <div>
                    <label className="label" htmlFor="date">Completion Date</label>
                    <input id="date" type="date" className="input" value={form.completion_date} onChange={(e) => setForm({ ...form, completion_date: e.target.value })} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="demo">Live Demo URL</label>
                    <input id="demo" className="input" value={form.live_demo_url} onChange={(e) => setForm({ ...form, live_demo_url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="label" htmlFor="gh">GitHub URL</label>
                    <input id="gh" className="input" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded border-slate-600" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 rounded border-slate-600" />
                    Published
                  </label>
                </div>

                {error && <div className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400">{error}</div>}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60">
                    {saving ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
