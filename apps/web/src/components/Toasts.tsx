import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import type { ToastTone } from '../lib/toast';

type T = { id: string; message: string; tone: ToastTone };

const TONE: Record<ToastTone, string> = {
  success: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  info: 'border-brand-500/40 bg-brand-500/15 text-brand-700 dark:text-brand-300',
  achievement: 'border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300',
};

export default function Toasts() {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const t = (e as CustomEvent).detail as T;
      setItems((prev) => [...prev, t].slice(-4));
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 3400);
    };
    window.addEventListener('toast', onToast);
    return () => window.removeEventListener('toast', onToast);
  }, []);

  return (
    <div className="no-print fixed bottom-4 right-4 safe-bottom z-[70] flex flex-col gap-2 w-[min(92vw,22rem)]">
      <AnimatePresence>
        {items.map((t) => (
          <m.div key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
            className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur ${TONE[t.tone]}`}>
            {t.message}
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
