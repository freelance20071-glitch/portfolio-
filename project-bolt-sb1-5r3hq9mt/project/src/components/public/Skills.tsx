import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { Skill } from '@/lib/types';
import { useInView } from '@/hooks/useInView';

const CATEGORIES = ['Frontend', 'Backend', 'UI/UX', 'Databases', 'AI Tools', 'Deployment'];

export default function Skills({ skills }: { skills: Skill[] }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const byCategory = CATEGORIES.map((cat) => ({
    category: cat,
    items: skills.filter((s) => s.category === cat).sort((a, b) => a.display_order - b.display_order),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="skills" className="py-24">
      <div ref={ref} className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Skills</p>
          <h2 className="section-title">Technologies I work with</h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {byCategory.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="card p-6"
            >
              <h3 className="mb-5 text-lg font-semibold">{group.category}</h3>
              <div className="space-y-4">
                {group.items.map((skill, si) => {
                  const Icon = skill.icon ? (Icons as unknown as Record<string, Icons.LucideIcon>)[skill.icon] ?? Icons.Star : Icons.Star;
                  return (
                    <div key={skill.id}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <Icon size={16} className="text-primary" /> {skill.name}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{skill.percentage}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.percentage}%` } : {}}
                          transition={{ duration: 1, delay: 0.3 + gi * 0.1 + si * 0.05, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
