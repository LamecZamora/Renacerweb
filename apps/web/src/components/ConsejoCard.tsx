import { useState } from 'react';
import { Card } from './ui';

/** Tarjeta de consejo de estudio (rotativo). */
export default function ConsejoCard({ tips, title = 'Consejo del mentor' }: { tips: string[]; title?: string }) {
  const [i, setI] = useState(() => Math.floor(Math.random() * tips.length));
  const otro = () => setI((p) => (p + 1 + Math.floor(Math.random() * (tips.length - 1))) % tips.length);

  return (
    <Card className="mb-6 border-l-4 border-brand-500/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="text-xl shrink-0">💡</span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400">{title}</p>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-0.5">{tips[i]}</p>
          </div>
        </div>
        <button onClick={otro} className="shrink-0 rounded-lg bg-brand-500/15 text-brand-700 dark:text-brand-400 px-2.5 py-1 text-xs font-semibold hover:bg-brand-500/25">Otro</button>
      </div>
    </Card>
  );
}
