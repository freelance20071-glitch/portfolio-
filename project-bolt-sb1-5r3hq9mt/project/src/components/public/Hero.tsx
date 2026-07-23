import { motion } from 'framer-motion';
import { ArrowRight, FolderOpen, Mail } from 'lucide-react';
import type { Profile } from '@/lib/types';

export default function Hero({ profile }: { profile: Profile | null }) {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const name = profile?.name ?? 'Alex Morgan';
  const title = profile?.title ?? 'Senior Full-Stack Engineer & UI Designer';
  const bio = profile?.bio ?? 'I craft modern, performant web applications and design systems.';
  const image = profile?.profile_image_url ?? 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-12 sm:pt-24">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl dark:bg-primary/30" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl dark:bg-accent/30" />
      </div>

      <div className="container-px grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-1.5 text-xs font-medium text-slate-600 backdrop-blur dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Available for new projects
          </motion.span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Hi, I'm <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{name}</span>
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-600 dark:text-slate-300">{title}</p>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500 dark:text-slate-400">
            {bio}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => scrollTo('projects')} className="btn-primary">
              <FolderOpen size={18} /> View Projects
            </button>
            <button onClick={() => scrollTo('contact')} className="btn-outline">
              <Mail size={18} /> Contact Me
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto"
        >
          <div className="relative h-56 w-56 xs:h-64 xs:w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent opacity-20 blur-2xl" />
            <div className="absolute inset-0 overflow-hidden rounded-full border-4 border-white shadow-2xl dark:border-slate-800">
              <img
                src={image}
                alt={name}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-2 -right-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:rounded-2xl sm:px-4 sm:py-3"
            >
              <p className="text-xl font-bold text-primary sm:text-2xl">{profile?.years_experience ?? 7}+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Years Exp.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => scrollTo('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 transition-colors hover:text-primary"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight size={20} className="rotate-90" />
        </motion.div>
      </motion.button>
    </section>
  );
}
