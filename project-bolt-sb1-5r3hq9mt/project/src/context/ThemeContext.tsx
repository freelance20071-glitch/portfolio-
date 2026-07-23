import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Settings } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface ThemeContextValue {
  settings: Settings | null;
  loading: boolean;
  refresh: () => Promise<void>;
  applyColors: (primary: string, accent: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const FONT_STACKS: Record<string, string> = {
  Inter: "'Inter', system-ui, sans-serif",
  Poppins: "'Poppins', system-ui, sans-serif",
  'Space Grotesk': "'Space Grotesk', system-ui, sans-serif",
  'JetBrains Mono': "'JetBrains Mono', monospace",
  'Playfair Display': "'Playfair Display', serif",
};

function hexToRgb(hex: string): string {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m || m.length < 3) return '37 99 235';
  return `${parseInt(m[0], 16)} ${parseInt(m[1], 16)} ${parseInt(m[2], 16)}`;
}

function applyColorVars(primary: string, accent: string) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', primary);
  root.style.setProperty('--color-primary-rgb', hexToRgb(primary));
  root.style.setProperty('--color-accent', accent);
  root.style.setProperty('--color-accent-rgb', hexToRgb(accent));
}

function applySettings(s: Settings) {
  const root = document.documentElement;
  if (s.theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  applyColorVars(s.primary_color, s.accent_color);
  const font = FONT_STACKS[s.font] ?? FONT_STACKS['Inter'];
  root.style.setProperty('--font-sans', font);
  document.body.style.fontFamily = font;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('settings').select('*').limit(1).maybeSingle();
    setSettings(data as Settings | null);
    if (data) applySettings(data as Settings);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const applyColors = (primary: string, accent: string) => {
    applyColorVars(primary, accent);
  };

  return (
    <ThemeContext.Provider value={{ settings, loading, refresh: load, applyColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
