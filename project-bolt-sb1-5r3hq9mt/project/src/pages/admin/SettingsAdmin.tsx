import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle2, Moon, Sun } from 'lucide-react';
import { PageHeader } from '@/components/admin/AdminUI';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import type { Settings } from '@/lib/types';

const FONTS = ['Inter', 'Poppins', 'Space Grotesk', 'JetBrains Mono', 'Playfair Display'];
const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#0ea5e9'];

export default function SettingsAdmin() {
  const { settings, refresh, applyColors } = useTheme();
  const [form, setForm] = useState<Partial<Settings>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    if (settings) {
      await supabase.from('settings').update(form).eq('id', settings.id);
    } else {
      await supabase.from('settings').insert(form);
    }
    await refresh();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const previewColor = (key: 'primary_color' | 'accent_color', color: string) => {
    if (key === 'primary_color') applyColors(color, form.accent_color ?? '#06b6d4');
    else applyColors(form.primary_color ?? '#2563eb', color);
    setForm({ ...form, [key]: color });
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Customize the appearance of your portfolio" />

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {/* Theme */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Theme Mode</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, theme: 'light' })}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                form.theme === 'light' ? 'border-primary bg-primary/5' : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <Sun size={20} className="text-amber-400" />
              <span className="text-sm font-medium text-white">Light Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, theme: 'dark' })}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                form.theme === 'dark' ? 'border-primary bg-primary/5' : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <Moon size={20} className="text-indigo-400" />
              <span className="text-sm font-medium text-white">Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Colors */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Colors</h3>
          <div className="space-y-5">
            <div>
              <label className="label">Primary Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => previewColor('primary_color', c)}
                    className={`h-10 w-10 rounded-full transition-all hover:scale-110 ${form.primary_color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={form.primary_color ?? '#2563eb'}
                  onChange={(e) => previewColor('primary_color', e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-full border-0 bg-transparent"
                />
              </div>
            </div>
            <div>
              <label className="label">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => previewColor('accent_color', c)}
                    className={`h-10 w-10 rounded-full transition-all hover:scale-110 ${form.accent_color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={form.accent_color ?? '#06b6d4'}
                  onChange={(e) => previewColor('accent_color', e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-full border-0 bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Font */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Font Family</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {FONTS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setForm({ ...form, font: f })}
                className={`rounded-xl border px-4 py-3 text-left transition-all ${
                  form.font === f ? 'border-primary bg-primary/5' : 'border-slate-700 hover:border-slate-600'
                }`}
                style={{ fontFamily: `'${f}', sans-serif` }}
              >
                <span className="text-sm font-medium text-white">{f}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-sm text-green-400">
              <CheckCircle2 size={16} /> Settings saved
            </motion.span>
          )}
        </div>
      </form>
    </div>
  );
}
