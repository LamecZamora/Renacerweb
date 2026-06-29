import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Quote } from '../data/quotes';

// Banner motivacional breve (centrado arriba) cuando el usuario falla o se estresa.
export default function Motivation() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onMotivate = (e: Event) => {
      setQuote((e as CustomEvent).detail as Quote);
      clearTimeout(timer);
      timer = setTimeout(() => setQuote(null), 5200);
    };
    window.addEventListener('motivate', onMotivate);
    return () => { window.removeEventListener('motivate', onMotivate); clearTimeout(timer); };
  }, []);

  return (
    <div className="no-print fixed inset-x-0 top-4 z-[75] flex justify-center px-4 pointer-events-none">
      <AnimatePresence>
        {quote && (
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={() => setQuote(null)}
            className="pointer-events-auto cursor-pointer w-[min(92vw,30rem)] rounded-2xl border border-brand-500/40 bg-gradient-to-br from-brand-500/95 to-brand-600/95 text-ink-950 shadow-glow p-5 text-center backdrop-blur"
          >
            <p className="text-2xl mb-1">💪</p>
            <p className="font-display text-base sm:text-lg font-extrabold leading-snug">“{quote.text}”</p>
            <p className="mt-2 text-xs font-semibold opacity-80">— {quote.source}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
