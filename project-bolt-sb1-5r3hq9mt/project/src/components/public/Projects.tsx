import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Star, Calendar } from 'lucide-react';
import type { Project } from '@/lib/types';
import { useInView } from '@/hooks/useInView';

export default function Projects({ projects }: { projects: Project[] }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="projects" className="py-24">
      <div ref={ref} className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Projects</p>
          <h2 className="section-title">Featured work</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
            A selection of projects I've designed and built. Click any card to see the full case study.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to={`/projects/${p.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {p.cover_image_url ? (
                    <img
                      src={p.cover_image_url}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <Star size={32} className="text-slate-400" />
                    </div>
                  )}
                  {p.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      Featured
                    </span>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {p.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
                    <ArrowUpRight size={18} className="shrink-0 text-slate-400 transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{p.short_description}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {t}
                      </span>
                    ))}
                    {p.technologies.length > 3 && (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        +{p.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {p.completion_date && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar size={13} />
                      {new Date(p.completion_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
