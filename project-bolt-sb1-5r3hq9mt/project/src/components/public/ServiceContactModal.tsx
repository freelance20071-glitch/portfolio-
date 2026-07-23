import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { validateContactForm } from '@/lib/sanitize';

interface ServiceContactModalProps {
  open: boolean;
  serviceName: string | null;
  onClose: () => void;
}

export default function ServiceContactModal({ open, serviceName, onClose }: ServiceContactModalProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    if (open && serviceName) {
      setForm({ name: '', email: '', subject: `Inquiry about: ${serviceName}`, message: '' });
      setErrors({});
      setStatus('idle');
    }
  }, [open, serviceName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateContactForm(form);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setStatus('sending');
    const { error } = await supabase.from('messages').insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message,
      source_service: serviceName,
    });
    if (error) {
      setStatus('error');
      return;
    }
    setStatus('sent');
    setTimeout(() => {
      onClose();
      setStatus('idle');
    }, 2500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-x-0 bottom-0 top-10 z-[61] overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 pb-[env(safe-area-inset-bottom)] shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:pb-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Let's talk</h2>
                {serviceName && (
                  <p className="mt-1 text-sm text-primary">
                    Regarding: <span className="font-semibold">{serviceName}</span>
                  </p>
                )}
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white">
                <X size={22} />
              </button>
            </div>

            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 size={28} className="text-green-600 dark:text-green-400" />
                </div>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Message sent!</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <p className="rounded-lg bg-primary/5 p-3 text-sm text-slate-600 dark:text-slate-300">
                  Interested in <span className="font-semibold text-primary">{serviceName}</span>? Fill out the form below and I'll reach out to discuss your project.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="scm-name">Name</label>
                    <input
                      id="scm-name"
                      className="input"
                      maxLength={100}
                      value={form.name}
                      onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((p) => ({ ...p, name: '' })); }}
                      required
                    />
                    {errors.name && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {errors.name}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="scm-email">Email</label>
                    <input
                      id="scm-email"
                      type="email"
                      className="input"
                      maxLength={254}
                      value={form.email}
                      onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors((p) => ({ ...p, email: '' })); }}
                      required
                    />
                    {errors.email && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="scm-subject">Subject</label>
                  <input
                    id="scm-subject"
                    className="input"
                    maxLength={200}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label" htmlFor="scm-message">Tell me about your project</label>
                  <textarea
                    id="scm-message"
                    rows={4}
                    maxLength={5000}
                    className="input resize-none"
                    placeholder="What are you looking for? Timeline, budget, goals..."
                    value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors((p) => ({ ...p, message: '' })); }}
                    required
                  />
                  {errors.message && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {errors.message}</p>}
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    <AlertCircle size={18} /> Something went wrong. Please try again.
                  </div>
                )}

                <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
                  <Send size={18} /> {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
