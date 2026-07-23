import { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, Send, Briefcase, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { validateContactForm, sanitizeUrl } from '@/lib/sanitize';
import { useInView } from '@/hooks/useInView';

const SUBMIT_COOLDOWN_MS = 30000;

export default function Contact({ profile }: { profile: Profile | null }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'cooldown'>('idle');

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
    });
    if (error) {
      setStatus('error');
      return;
    }
    setStatus('sent');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 4000);
  };

  const socials = [
    { label: 'Email', value: profile?.email, href: profile?.email ? `mailto:${profile.email}` : null, icon: Mail },
    { label: 'LinkedIn', value: profile?.linkedin_url, href: sanitizeUrl(profile?.linkedin_url), icon: Linkedin },
    { label: 'GitHub', value: profile?.github_url, href: sanitizeUrl(profile?.github_url), icon: Github },
    { label: 'Fiverr', value: profile?.fiverr_url, href: sanitizeUrl(profile?.fiverr_url), icon: Briefcase },
    { label: 'Contra', value: profile?.contra_url, href: sanitizeUrl(profile?.contra_url), icon: ExternalLink },
  ].filter((s) => s.href);

  return (
    <section id="contact" className="py-24">
      <div ref={ref} className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Contact</p>
          <h2 className="section-title">Let's work together</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
            Have a project in mind? Send me a message and I'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card h-full p-6">
              <h3 className="mb-4 text-lg font-semibold">Get in touch</h3>
              <div className="space-y-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href!}
                      target={s.label !== 'Email' ? '_blank' : undefined}
                      rel="noreferrer noopener"
                      className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-all hover:border-primary hover:bg-primary/5 dark:border-slate-800"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{s.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Connect</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="card space-y-4 p-6 lg:col-span-3"
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">Name</label>
                <input
                  id="name"
                  className="input"
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((p) => ({ ...p, name: '' })); }}
                  required
                />
                {errors.name && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {errors.name}</p>}
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
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
              <label className="label" htmlFor="subject">Subject</label>
              <input
                id="subject"
                className="input"
                maxLength={200}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div>
              <label className="label" htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                maxLength={5000}
                className="input resize-none"
                value={form.message}
                onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors((p) => ({ ...p, message: '' })); }}
                required
              />
              {errors.message && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {errors.message}</p>}
            </div>

            {status === 'sent' && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 size={18} /> Message sent successfully! I'll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle size={18} /> Something went wrong. Please try again.
              </div>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
              <Send size={18} /> {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
