import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Trash2, Reply, Tag, ArrowLeft } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/admin/AdminUI';
import { supabase } from '@/lib/supabase';
import type { Message } from '@/lib/types';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (m: Message) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', m.id);
    setMessages((prev) => prev.map((p) => p.id === m.id ? { ...p, is_read: true } : p));
    setSelected((prev) => prev?.id === m.id ? { ...prev, is_read: true } : prev);
  };

  const handleDelete = async (m: Message) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('messages').delete().eq('id', m.id);
    setSelected(null);
    load();
  };

  const openMessage = (m: Message) => {
    setSelected(m);
    if (!m.is_read) markRead(m);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${messages.length} total • ${unreadCount} unread`} />

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Loading...</div>
      ) : messages.length === 0 ? (
        <EmptyState message="No messages yet. Contact form submissions will appear here." />
      ) : (
        <>
          {/* Desktop: side-by-side list + detail */}
          <div className="hidden gap-4 lg:grid lg:grid-cols-3">
            {/* List */}
            <div className="space-y-2 lg:col-span-1">
              {messages.map((m) => (
                <button
                  key={m.id}
                  onClick={() => openMessage(m)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selected?.id === m.id
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {!m.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    <span className={`min-w-0 flex-1 truncate text-sm font-medium ${m.is_read ? 'text-slate-400' : 'text-white'}`}>{m.name}</span>
                    <span className="shrink-0 text-xs text-slate-500">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{m.subject || m.message}</p>
                  {m.source_service && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      <Tag size={10} /> {m.source_service}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="lg:col-span-2">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-white">{selected.subject || '(No subject)'}</h2>
                      <p className="mt-1 text-sm text-slate-400">From <span className="font-medium text-slate-300">{selected.name}</span> &lt;{selected.email}&gt;</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(selected.created_at).toLocaleString()}</p>
                      {selected.source_service && (
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                          <Tag size={14} /> Interested in: {selected.source_service}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 rounded-xl bg-slate-800/50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{selected.message}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                      className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                    >
                      <Reply size={16} /> Reply
                    </a>
                    {!selected.is_read && (
                      <button onClick={() => markRead(selected)} className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800">
                        <MailOpen size={16} /> Mark as read
                      </button>
                    )}
                    <button onClick={() => handleDelete(selected)} className="flex items-center gap-2 rounded-xl border border-red-800 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/20">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-800 py-20">
                  <div className="text-center">
                    <Mail size={32} className="mx-auto text-slate-600" />
                    <p className="mt-3 text-sm text-slate-500">Select a message to read</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: list, then full-screen detail overlay */}
          <div className="space-y-2 lg:hidden">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  'border-slate-800 bg-slate-900 active:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  {!m.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <span className={`min-w-0 flex-1 truncate text-sm font-medium ${m.is_read ? 'text-slate-400' : 'text-white'}`}>{m.name}</span>
                  <span className="shrink-0 text-xs text-slate-500">{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">{m.subject || m.message}</p>
                {m.source_service && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <Tag size={10} /> {m.source_service}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile detail overlay */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 p-4 pb-[env(safe-area-inset-bottom)] lg:hidden"
              >
                <div className="mb-4 flex items-center gap-3">
                  <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                    <ArrowLeft size={18} /> Back
                  </button>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="text-lg font-bold text-white">{selected.subject || '(No subject)'}</h2>
                  <p className="mt-1 text-sm text-slate-400">From <span className="font-medium text-slate-300">{selected.name}</span></p>
                  <p className="text-xs text-slate-500">{selected.email}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(selected.created_at).toLocaleString()}</p>
                  {selected.source_service && (
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                      <Tag size={14} /> Interested in: {selected.source_service}
                    </span>
                  )}
                  <div className="mt-5 rounded-xl bg-slate-800/50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{selected.message}</p>
                  </div>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white"
                    >
                      <Reply size={16} /> Reply via Email
                    </a>
                    <div className="flex gap-2.5">
                      {!selected.is_read && (
                        <button onClick={() => markRead(selected)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300">
                          <MailOpen size={16} /> Mark read
                        </button>
                      )}
                      <button onClick={() => handleDelete(selected)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-800 px-4 py-3 text-sm font-medium text-red-400">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
