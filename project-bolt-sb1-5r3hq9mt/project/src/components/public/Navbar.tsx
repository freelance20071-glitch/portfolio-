import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Home', to: '/#home' },
  { label: 'About', to: '/#about' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Services', to: '/#services' },
  { label: 'Reviews', to: '/#testimonials' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Contact', to: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    setOpen(false);
    const id = to.split('#')[1];
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/60 bg-white/80 py-3 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80'
          : 'py-5'
      }`}
    >
      <nav className="container-px flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight"
          onClick={(e) => handleClick(e, '/#home')}
        >
          <span className="text-primary">Alex</span> Morgan
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.to}
              onClick={(e) => handleClick(e, l.to)}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="rounded-lg p-2.5 text-slate-700 dark:text-slate-200 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/95 lg:hidden"
          >
            <div className="container-px flex flex-col gap-1 py-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.to}
                  onClick={(e) => handleClick(e, l.to)}
                  className="rounded-lg px-4 py-3.5 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
