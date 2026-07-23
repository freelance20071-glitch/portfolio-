import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/admin/AdminUI';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/lib/types';

const EMPTY = { icon: 'Sparkles', title: '', description: '', display_order: 0 };

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('display_order');
    setServices((data as Service[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setError(null); setShowForm(true); };
  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ icon: s.icon ?? 'Sparkles', title: s.title, description: s.description, display_order: s.display_order });
    setError(null);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    if (editing) {
      const { error } = await supabase.from('services').update(form).eq('id', editing.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('services').insert(form);
      if (error) setError(error.message);
    }
    setSaving(false);
    if (!error) { setShowForm(false); load(); }
  };

  const handleDelete = async (s: Service) => {
    if (!confirm(`Delete "${s.title}"?`)) return;
    await supabase.from('services').delete().eq('id', s.id);
    load();
  };

  const sorted = [...services].sort((a, b) => a.display_order - b.display_order);

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle={`${services.length} services`}
        action={
          <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
            <Plus size={18} /> Add Service
          </button>
        }
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Loading...</div>
      ) : sorted.length === 0 ? (
        <EmptyState message="No services yet. Add your first service!" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((s) => (
            <motion.div key={s.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                  {s.icon?.slice(0, 2) ?? '✦'}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-900/30 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-white">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{s.description}</p>
              <p className="mt-2 text-xs text-slate-600">Order: {s.display_order}</p>
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
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit Service' : 'Add Service'}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={22} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="title">Title</label>
                    <input id="title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label" htmlFor="icon">Icon (Lucide name)</label>
                    <input id="icon" className="input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Layout, AppWindow..." />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="desc">Description</label>
                  <textarea id="desc" rows={3} className="input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div>
                  <label className="label" htmlFor="order">Display Order</label>
                  <input id="order" type="number" className="input" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                </div>
                {error && <div className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400">{error}</div>}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60">
                    {saving ? 'Saving...' : editing ? 'Update Service' : 'Add Service'}
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
