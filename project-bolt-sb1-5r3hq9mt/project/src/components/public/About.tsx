import { motion } from 'framer-motion';
import { Download, CheckCircle2 } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

export default function About({ profile }: { profile: Profile | null }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const years = useCountUp(profile?.years_experience ?? 7, 1500, inView);
  const projects = useCountUp(120, 1500, inView);
  const clients = useCountUp(45, 1500, inView);

  const highlights = [
    'Full-stack web development',
    'Design system architecture',
    'Performance optimization',
    'API & database design',
  ];

  return (
    <section id="about" className="py-24">
      <div ref={ref} className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">About Me</p>
            <h2 className="section-title mb-6">Crafting digital experiences that matter</h2>
            <p className="mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {profile?.bio ?? 'I craft modern, performant web applications and design systems.'}
            </p>
            <p className="mb-6 text-base leading-relaxed text-slate-500 dark:text-slate-400">
              With a strong foundation in both engineering and design, I bridge the gap between
              robust backends and beautiful frontends. My focus is on shipping products that are
              fast, accessible, and a joy to use.
            </p>

            <ul className="mb-8 grid grid-cols-2 gap-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 size={18} className="text-primary" /> {h}
                </li>
              ))}
            </ul>

            {profile?.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noreferrer noopener" className="btn-primary">
                <Download size={18} /> Download CV
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Years Experience', value: years, suffix: '+' },
              { label: 'Projects Completed', value: projects, suffix: '+' },
              { label: 'Happy Clients', value: clients, suffix: '+' },
              { label: 'Cups of Coffee', value: 9999, suffix: '' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="card p-6 text-center"
              >
                <p className="text-4xl font-bold text-primary">
                  {stat.label === 'Cups of Coffee' ? '∞' : `${stat.value}${stat.suffix}`}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
