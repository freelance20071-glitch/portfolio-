import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/admin/AdminUI';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/storage';
import { sanitizeUrl } from '@/lib/sanitize';
import type { Testimonial } from '@/lib/types';

const EMPTY = {
  client_name: '',
  client_role: '',
  client_company: '',
  avatar_url: '',
  rating: 5,
  review_text: '',
  display_order: 0,
};

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('display_order');
    setItems((data as Testimonial[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setError(null); setShowForm(true); };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      client_name: t.client_name,
      client_role: t.client_role ?? '',
      client_company: t.client_company ?? '',
      avatar_url: t.avatar_url ?? '',
      rating: t.rating,
      review_text: t.review_text,
      display_order: t.display_order,
    });
    setError(null);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, avatar_url: sanitizeUrl(form.avatar_url) || null };
    if (editing) {
      const { error } = await supabase.from('testimonials').update(payload).eq('id', editing.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('testimonials').insert(payload);
      if (error) setError(error.message);
    }
    setSaving(false);
    if (!error) { setShowForm(false); load(); }
  };

  const handleDelete = async (t: Testimonial) => {
    if (!confirm(`Delete review from "${t.client_name}"?`)) return;
    await supabase.from('testimonials').delete().eq('id', t.id);
    load();
  };

  const handleAvatarUpload = async (file: File) => {
    const url = await uploadFile(file, 'testimonials');
    if (url) setForm({ ...form, avatar_url: url });
  };

  const sorted = [...items].sort((a, b) => a.display_order - b.display_order);

  return (
    <div>
      <PageHeader
        title="Testimonials"
        subtitle={`${items.length} client reviews`}
        action={
          <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
            <Plus size={18} /> Add Review
          </button>
        }
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Loading...</div>
      ) : sorted.length === 0 ? (
        <EmptyState message="No reviews yet. Add your first client testimonial!" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.client_name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{t.client_name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{t.client_name}</p>
                    <p className="text-xs text-slate-400">{t.client_role}{t.client_company ? ` at ${t.client_company}` : ''}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(t)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-900/30 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={14} className={idx < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'} />
                ))}
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-slate-400">"{t.review_text}"</p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 z-50 bg-black/70" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-0 bottom-0 top-20 z-50 overflow-y-auto rounded-t-2xl border border-slate-800 bg-slate-900 p-5 pb-[env(safe-area-inset-bottom)] sm:inset-x-auto sm:left-1/2 sm:top-10 sm:max-w-lg sm:-translate-x-1/2 sm:rounded-2xl sm:pb-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit Review' : 'Add Review'}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={22} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="t-name">Client Name</label>
                    <input id="t-name" className="input" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label" htmlFor="t-role">Role</label>
                    <input id="t-role" className="input" value={form.client_role} onChange={(e) => setForm({ ...form, client_role: e.target.value })} placeholder="Product Manager" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="t-company">Company</label>
                    <input id="t-company" className="input" value={form.client_company} onChange={(e) => setForm({ ...form, client_company: e.target.value })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="t-order">Display Order</label>
                    <input id="t-order" type="number" className="input" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <div>
                  <label className="label">Rating: {form.rating} stars</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })}>
                        <Star size={24} className={r <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Client Avatar</label>
                  <div className="flex items-center gap-3">
                    {form.avatar_url && <img src={form.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" />}
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} className="text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white" />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="t-review">Review Text</label>
                  <textarea id="t-review" rows={4} className="input resize-none" value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })} required />
                </div>
                {error && <div className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400">{error}</div>}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60">
                    {saving ? 'Saving...' : editing ? 'Update Review' : 'Add Review'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800">Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
