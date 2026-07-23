import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-slate-950"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative h-16 w-16"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-primary dark:border-slate-800 dark:border-t-primary"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-slate-500 dark:text-slate-400"
          >
            Loading...
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
