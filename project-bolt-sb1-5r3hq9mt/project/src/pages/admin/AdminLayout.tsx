import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Code2, Briefcase, Wrench,
  Mail, User, Settings, LogOut, Menu, X, ExternalLink, Star,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Skills', to: '/admin/skills', icon: Code2 },
  { label: 'Experience', to: '/admin/experience', icon: Briefcase },
  { label: 'Services', to: '/admin/services', icon: Wrench },
  { label: 'Testimonials', to: '/admin/testimonials', icon: Star },
  { label: 'Messages', to: '/admin/messages', icon: Mail },
  { label: 'Profile', to: '/admin/profile', icon: User },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const activeItem = navItems.find((item) => location.pathname === item.to || (item.to !== '/admin/dashboard' && location.pathname.startsWith(item.to)));

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">A</div>
          <span className="font-semibold text-white">Admin Panel</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const active = location.pathname === item.to || (item.to !== '/admin/dashboard' && location.pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-800 p-4">
        <Link
          to="/"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
        >
          <ExternalLink size={18} /> View Website
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-900/20"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-800 bg-slate-900 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-300" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span className="font-semibold text-white">{activeItem?.label ?? 'Admin'}</span>
          <div className="w-10" />
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
