import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex-shrink-0">{action}</div>
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
}

export function StatCard({ label, value, icon, color = 'bg-primary' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </motion.div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-16 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

export function ConfirmButton({
  onConfirm,
  children,
  className = '',
}: {
  onConfirm: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button onClick={onConfirm} className={className}>
      {children}
    </button>
  );
}
