import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '@/lib/types';
import { useInView } from '@/hooks/useInView';

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const sorted = [...testimonials].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="testimonials" className="py-24">
      <div ref={ref} className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</p>
          <h2 className="section-title">What clients say</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
            Trusted by founders, product managers, and design teams to deliver exceptional results.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="card relative p-6"
            >
              <Quote size={32} className="absolute right-5 top-5 text-primary/10" />

              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className={idx < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}
                  />
                ))}
              </div>

              <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                "{t.review_text}"
              </p>

              <div className="flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.client_name}
                    loading="lazy"
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {t.client_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.client_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.client_role}{t.client_company ? ` at ${t.client_company}` : ''}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
