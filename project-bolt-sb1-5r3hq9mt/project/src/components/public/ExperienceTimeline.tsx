import { motion } from 'framer-motion';
import { Briefcase, MapPin } from 'lucide-react';
import type { Experience } from '@/lib/types';
import { useInView } from '@/hooks/useInView';

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const sorted = [...experiences].sort((a, b) => b.display_order - a.display_order);

  return (
    <section id="experience" className="py-24">
      <div ref={ref} className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Experience</p>
          <h2 className="section-title">My career journey</h2>
        </motion.div>

        <div className="relative mx-auto max-w-3xl">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200 dark:bg-slate-800 sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-12">
            {sorted.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex items-center gap-6 sm:gap-0 ${
                    isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 z-10 -translate-x-1/2 sm:left-1/2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-white dark:ring-slate-950" />
                  </div>

                  {/* Spacer for desktop */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Card */}
                  <div className={`ml-12 flex-1 sm:ml-0 sm:w-1/2 ${isLeft ? 'sm:pr-12' : 'sm:pl-12'}`}>
                    <div className="card p-5">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
                        <Briefcase size={14} />
                        {exp.start_date} — {exp.current ? 'Present' : exp.end_date}
                      </div>
                      <h3 className="text-lg font-semibold">{exp.role}</h3>
                      <p className="mb-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin size={13} /> {exp.company}
                      </p>
                      {exp.description && (
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{exp.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
