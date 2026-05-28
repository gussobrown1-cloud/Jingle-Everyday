import { useStore } from '../store/useStore';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Notifications() {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="fixed bottom-4 right-4 z-[60] space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm ${
              t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              t.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-brand-50 border-brand-200 text-brand-800'
            }`}
          >
            {t.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : t.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <Info className="w-4 h-4 shrink-0" />}
            <p className="flex-1 font-medium">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} className="p-0.5 hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
