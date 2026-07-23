import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, GripVertical } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/admin/AdminUI';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/lib/types';

const CATEGORIES = ['Frontend', 'Backend', 'UI/UX', 'Databases', 'AI Tools', 'Deployment'];

const EMPTY = { name: '', icon: 'Star', percentage: 80, category: 'Frontend', display_order: 0 };

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('skills').select('*').order('display_order');
    setSkills((data as Skill[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setError(null); setShowForm(true); };
  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, icon: s.icon ?? 'Star', percentage: s.percentage, category: s.category, display_order: s.display_order });
    setError(null);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    if (editing) {
      const { error } = await supabase.from('skills').update(form).eq('id', editing.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('skills').insert(form);
      if (error) setError(error.message);
    }
    setSaving(false);
    if (!error) { setShowForm(false); load(); }
  };

  const handleDelete = async (s: Skill) => {
    if (!confirm(`Delete "${s.name}"?`)) return;
    await supabase.from('skills').delete().eq('id', s.id);
    load();
  };

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: skills.filter((s) => s.category === cat).sort((a, b) => a.display_order - b.display_order),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <PageHeader
        title="Skills"
        subtitle={`${skills.length} skills`}
        action={
          <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
            <Plus size={18} /> Add Skill
          </button>
        }
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Loading...</div>
      ) : skills.length === 0 ? (
        <EmptyState message="No skills yet. Add your first skill!" />
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.category}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">{group.category}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((s) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-slate-600" />
                        <span className="font-medium text-white">{s.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-900/30 hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${s.percentage}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">{s.percentage}% • Order: {s.display_order}</p>
                  </motion.div>
                ))}
              </div>
            </div>
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
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={22} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="label" htmlFor="name">Name</label>
                  <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="icon">Icon (Lucide name)</label>
                    <input id="icon" className="input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Code, Server, Database..." />
                  </div>
                  <div>
                    <label className="label" htmlFor="category">Category</label>
                    <select id="category" className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="percentage">Percentage: {form.percentage}%</label>
                    <input id="percentage" type="range" min={0} max={100} value={form.percentage} onChange={(e) => setForm({ ...form, percentage: parseInt(e.target.value) })} className="w-full accent-primary" />
                  </div>
                  <div>
                    <label className="label" htmlFor="order">Display Order</label>
                    <input id="order" type="number" className="input" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                {error && <div className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400">{error}</div>}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60">
                    {saving ? 'Saving...' : editing ? 'Update Skill' : 'Add Skill'}
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
