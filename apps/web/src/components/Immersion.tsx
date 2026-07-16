import { useState } from 'react';
import { Card, Badge } from './ui';
import { IMMERSION, IM_KINDS, IMMERSION_STRATEGY, type ImKind } from '../data/immersion';

export default function Immersion() {
  const [kind, setKind] = useState<ImKind | 'Todos'>('Todos');
  const list = kind === 'Todos' ? IMMERSION : IMMERSION.filter((i) => i.kind === kind);
  const filters: (ImKind | 'Todos')[] = ['Todos', ...IM_KINDS];

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-2 mb-1"><span>🌎</span><h3 className="font-bold">Inmersión · aprende viendo, jugando y escuchando</h3></div>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Lo que de verdad hace fluido tu oído. Elige según tu nivel y ¡a consumir en inglés!</p>

      {/* Estrategia */}
      <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-3 mb-4">
        <p className="text-xs font-bold text-brand-700 dark:text-brand-400 mb-1.5">🎯 Cómo hacerlo bien</p>
        <ul className="space-y-1">
          {IMMERSION_STRATEGY.map((t, i) => <li key={i} className="text-xs text-stone-600 dark:text-stone-300">{t}</li>)}
        </ul>
      </div>

      {/* Filtro por tipo */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {filters.map((f) => (
          <button key={f} onClick={() => setKind(f)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${kind === f ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
            {f}{f !== 'Todos' ? 's' : ''}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {list.map((it) => (
          <div key={it.title} className="flex gap-3 rounded-xl border border-stone-200/70 dark:border-white/10 p-3">
            <span className="text-2xl shrink-0">{it.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold leading-tight">{it.title}</p>
                <Badge tone="slate">{it.level}</Badge>
              </div>
              <p className="text-[11px] uppercase tracking-wide text-brand-600 dark:text-brand-400 font-semibold mt-0.5">{it.kind}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{it.why}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
