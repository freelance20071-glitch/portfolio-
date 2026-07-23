import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminUI';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/storage';
import { sanitizeUrl } from '@/lib/sanitize';
import type { Profile } from '@/lib/types';

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('profile').select('*').limit(1).maybeSingle();
      setProfile(data as Profile | null);
      setForm(data ?? {});
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    if (profile) {
      const sanitized = {
        ...form,
        resume_url: sanitizeUrl(form.resume_url) || null,
        linkedin_url: sanitizeUrl(form.linkedin_url) || null,
        github_url: sanitizeUrl(form.github_url) || null,
        fiverr_url: sanitizeUrl(form.fiverr_url) || null,
        contra_url: sanitizeUrl(form.contra_url) || null,
        profile_image_url: sanitizeUrl(form.profile_image_url) || null,
      };
      await supabase.from('profile').update(sanitized).eq('id', profile.id);
    } else {
      await supabase.from('profile').insert(form);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImageUpload = async (file: File) => {
    const url = await uploadFile(file, 'profile');
    if (url) setForm({ ...form, profile_image_url: url });
  };

  if (loading) return <div className="py-16 text-center text-sm text-slate-500">Loading...</div>;

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your public profile information" />

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-3">
        {/* Profile image */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Profile Image</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-slate-700">
                {form.profile_image_url ? (
                  <img src={form.profile_image_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-800 text-4xl font-bold text-slate-600">
                    {(form.name ?? 'A').charAt(0)}
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} className="text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white" />
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">Name</label>
                <input id="name" className="input" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label" htmlFor="title">Professional Title</label>
                <input id="title" className="input" value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="bio">Bio</label>
              <textarea id="bio" rows={4} className="input resize-none" value={form.bio ?? ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>

            <div>
              <label className="label" htmlFor="years">Years of Experience</label>
              <input id="years" type="number" className="input" value={form.years_experience ?? 0} onChange={(e) => setForm({ ...form, years_experience: parseInt(e.target.value) || 0 })} />
            </div>

            <div>
              <label className="label" htmlFor="resume">Resume URL</label>
              <input id="resume" className="input" value={form.resume_url ?? ''} onChange={(e) => setForm({ ...form, resume_url: e.target.value })} placeholder="https://..." />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Contact & Social</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" className="input" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone</label>
                <input id="phone" className="input" value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="linkedin">LinkedIn URL</label>
                <input id="linkedin" className="input" value={form.linkedin_url ?? ''} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="github">GitHub URL</label>
                <input id="github" className="input" value={form.github_url ?? ''} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="fiverr">Fiverr URL</label>
                <input id="fiverr" className="input" value={form.fiverr_url ?? ''} onChange={(e) => setForm({ ...form, fiverr_url: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="contra">Contra URL</label>
                <input id="contra" className="input" value={form.contra_url ?? ''} onChange={(e) => setForm({ ...form, contra_url: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60">
              <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
            {saved && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-sm text-green-400">
                <CheckCircle2 size={16} /> Saved successfully
              </motion.span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
