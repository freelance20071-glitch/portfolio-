import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/lib/types';
import { useInView } from '@/hooks/useInView';
import ServiceContactModal from './ServiceContactModal';

export default function Services({ services }: { services: Service[] }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const sorted = [...services].sort((a, b) => a.display_order - b.display_order);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleCardClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setModalOpen(true);
  };

  return (
    <section id="services" className="py-24">
      <div ref={ref} className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Services</p>
          <h2 className="section-title">What I can do for you</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
            Click any service below to start a conversation about your project.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((s, i) => {
            const Icon = s.icon ? (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icon] ?? Icons.Sparkles : Icons.Sparkles;
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => handleCardClick(s.title)}
                className="group card relative cursor-pointer p-6 text-left"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Get started <ArrowRight size={15} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <ServiceContactModal
        open={modalOpen}
        serviceName={selectedService}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
