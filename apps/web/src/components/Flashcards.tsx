import { useMemo, useState } from 'react';
import { Card, Badge } from './ui';
import { markActive } from '../lib/storage';
import { FLASHCARDS } from '../data/flashcards';

// Repaso espaciado Leitner: caja 1..5; intervalo en días por caja.
const KEY = 'renacer_flashcards';
const INTERVAL_DAYS = [0, 1, 2, 4, 7, 15];
type CardState = { box: number; due: number };
type Store = Record<string, CardState>;

function load(): Store {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}'); } catch { return {}; }
}
function save(s: Store) { localStorage.setItem(KEY, JSON.stringify(s)); }

const now = () => Date.now();
const dayMs = 86_400_000;

export default function Flashcards() {
  const [store, setStore] = useState<Store>(() => load());
  const [flipped, setFlipped] = useState(false);

  // Cola: tarjetas vencidas (due <= ahora) o nuevas, ordenadas por vencimiento.
  const queue = useMemo(() => {
    return FLASHCARDS
      .map((fc) => ({ fc, st: store[fc.id] }))
      .filter(({ st }) => !st || st.due <= now())
      .sort((a, b) => (a.st?.due ?? 0) - (b.st?.due ?? 0));
  }, [store]);

  const known = FLASHCARDS.filter((fc) => (store[fc.id]?.box ?? 0) >= 5).length;
  const studied = Object.keys(store).length;
  const current = queue[0]?.fc;

  const grade = (ok: boolean) => {
    if (!current) return;
    markActive();
    const prev = store[current.id]?.box ?? 0;
    const box = ok ? Math.min(5, prev + 1) : 1;
    const next: Store = { ...store, [current.id]: { box, due: now() + INTERVAL_DAYS[box] * dayMs } };
    setStore(next); save(next); setFlipped(false);
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2"><span>🃏</span><h3 className="font-bold">Flashcards · Vocabulario tech</h3></div>
        <div className="flex gap-2">
          <Badge tone="brand">Por repasar: {queue.length}</Badge>
          <Badge tone="green">Dominadas: {known}/{FLASHCARDS.length}</Badge>
        </div>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Repaso espaciado: las que fallas vuelven pronto; las que sabes, más tarde. Vocabulario clave de entrevistas en inglés.</p>

      {!current ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
          <p className="font-bold text-emerald-600 dark:text-emerald-400">🎉 ¡Repaso al día!</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">No tienes tarjetas pendientes ahora. Vuelve más tarde para reforzar. Estudiadas: {studied}/{FLASHCARDS.length}.</p>
        </div>
      ) : (
        <>
          <button onClick={() => setFlipped((f) => !f)}
            className="w-full text-left rounded-2xl border-2 border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-transparent p-6 min-h-[140px] transition hover:border-brand-500/50">
            {!flipped ? (
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-wide text-stone-400 mb-2">Inglés · toca para ver el significado</p>
                <p className="font-display text-3xl font-extrabold">{current.term}</p>
              </div>
            ) : (
              <div>
                <p className="text-[11px] uppercase tracking-wide text-stone-400 mb-1">Significado</p>
                <p className="font-bold text-lg mb-2">{current.es}</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 italic">“{current.example}”</p>
              </div>
            )}
          </button>

          {flipped ? (
            <div className="mt-3 flex gap-2">
              <button onClick={() => grade(false)} className="flex-1 rounded-xl bg-red-500/15 text-red-500 py-2.5 text-sm font-bold hover:bg-red-500/25">↻ Repasar pronto</button>
              <button onClick={() => grade(true)} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:opacity-95">✓ La sé</button>
            </div>
          ) : (
            <button onClick={() => setFlipped(true)} className="mt-3 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-bold text-ink-950 hover:opacity-95">Ver significado</button>
          )}
        </>
      )}
    </Card>
  );
}
