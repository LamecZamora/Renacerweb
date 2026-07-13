import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Card } from './ui';
import { EXERCISES, EXERCISE_GROUPS, exImg, exMedia, type Exercise, type ExGroup } from '../data/exercises';

export default function ExerciseLibrary() {
  const [group, setGroup] = useState<ExGroup | 'Todos'>('Todos');
  const [open, setOpen] = useState<Exercise | null>(null);
  const list = group === 'Todos' ? EXERCISES : EXERCISES.filter((e) => e.group === group);
  const filters: (ExGroup | 'Todos')[] = ['Todos', ...EXERCISE_GROUPS];

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-2 mb-1"><span>🎬</span><h3 className="font-bold">Guía visual de ejercicios</h3></div>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Toca un ejercicio para ver la técnica en video. Filtra por grupo muscular.</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {filters.map((g) => (
          <button key={g} onClick={() => setGroup(g)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${group === g ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
            {g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {list.map((ex) => (
          <button key={ex.slug} onClick={() => setOpen(ex)}
            className="group glass-card lift text-left rounded-xl border border-stone-200/70 dark:border-white/10 overflow-hidden">
            <div className="relative aspect-square bg-stone-100 dark:bg-white/5 overflow-hidden">
              <img src={exImg(ex.slug)} alt={ex.name} loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute inset-0 grid place-items-center bg-ink-950/0 group-hover:bg-ink-950/30 transition">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-950 opacity-0 group-hover:opacity-100 transition scale-90 group-hover:scale-100">▶</span>
              </span>
            </div>
            <div className="p-2">
              <p className="text-xs font-semibold leading-tight truncate">{ex.name}</p>
              <p className="text-[10px] text-stone-400">{ex.group}</p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <m.div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}>
            <m.div className="w-full max-w-lg rounded-2xl border border-white/10 bg-ink-950/90 p-4 shadow-2xl"
              initial={{ scale: 0.92, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-display font-extrabold text-white">{open.name}</h4>
                  <p className="text-xs text-stone-400">{open.group}</p>
                </div>
                <button onClick={() => setOpen(null)} className="rounded-lg px-2 py-1 text-sm text-stone-400 hover:text-white hover:bg-white/10">✕</button>
              </div>
              <div className="rounded-xl overflow-hidden bg-black">
                {open.anim ? (
                  <img src={exMedia(open)} alt={open.name} className="w-full" />
                ) : (
                  <video src={exMedia(open)} poster={exImg(open.slug)} controls autoPlay loop muted playsInline className="w-full" />
                )}
              </div>
              <p className="mt-3 text-xs text-stone-400">💡 Calienta antes, cuida la técnica y sube el peso poco a poco (sobrecarga progresiva).</p>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
