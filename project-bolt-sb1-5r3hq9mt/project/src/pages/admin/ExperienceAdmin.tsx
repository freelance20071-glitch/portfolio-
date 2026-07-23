import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Briefcase } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/admin/AdminUI';
import { supabase } from '@/lib/supabase';
import type { Experience } from '@/lib/types';

const EMPTY = { role: '', company: '', description: '', start_date: '', end_date: '', current: false, display_order: 0 };

export default function ExperienceAdmin() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('experiences').select('*').order('display_order', { ascending: false });
    setItems((data as Experience[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setError(null); setShowForm(true); };
  const openEdit = (e: Experience) => {
    setEditing(e);
    setForm({ role: e.role, company: e.company, description: e.description ?? '', start_date: e.start_date, end_date: e.end_date ?? '', current: e.current, display_order: e.display_order });
    setError(null);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, end_date: form.current ? null : (form.end_date || null) };
    if (editing) {
      const { error } = await supabase.from('experiences').update(payload).eq('id', editing.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('experiences').insert(payload);
      if (error) setError(error.message);
    }
    setSaving(false);
    if (!error) { setShowForm(false); load(); }
  };

  const handleDelete = async (e: Experience) => {
    if (!confirm(`Delete "${e.role}"?`)) return;
    await supabase.from('experiences').delete().eq('id', e.id);
    load();
  };

  return (
    <div>
      <PageHeader
        title="Experience"
        subtitle={`${items.length} entries`}
        action={
          <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
            <Plus size={18} /> Add Experience
          </button>
        }
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Loading...</div>
      ) : items.length === 0 ? (
        <EmptyState message="No experience entries yet." />
      ) : (
        <div className="space-y-3">
          {items.map((e) => (
            <motion.div key={e.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Briefcase size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white">{e.role}</h3>
                  <span className="text-slate-500">•</span>
                  <span className="text-sm text-slate-400">{e.company}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{e.start_date} — {e.current ? 'Present' : e.end_date}</p>
                {e.description && <p className="mt-2 text-sm text-slate-400">{e.description}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(e)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(e)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-900/30 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
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
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={22} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="role">Role</label>
                    <input id="role" className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label" htmlFor="company">Company</label>
                    <input id="company" className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="desc">Description</label>
                  <textarea id="desc" rows={3} className="input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="start">Start Date</label>
                    <input id="start" className="input" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} placeholder="2021" required />
                  </div>
                  <div>
                    <label className="label" htmlFor="end">End Date</label>
                    <input id="end" className="input" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} placeholder="2023 or Present" disabled={form.current} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} className="h-4 w-4 rounded border-slate-600" />
                    Currently working here
                  </label>
                  <div>
                    <label className="label" htmlFor="order">Display Order</label>
                    <input id="order" type="number" className="input" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                {error && <div className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400">{error}</div>}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60">
                    {saving ? 'Saving...' : editing ? 'Update' : 'Add Experience'}
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

