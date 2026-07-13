import { useEffect, useMemo, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Card } from './ui';
import { deriveCharacterStats, detectLevelUps, type LevelUp } from '../lib/characterStats';

export default function CharacterStats() {
  const { stats, overall } = useMemo(() => deriveCharacterStats(), []);
  const [ups, setUps] = useState<LevelUp[]>([]);

  useEffect(() => {
    const found = detectLevelUps(stats);
    if (found.length) {
      setUps(found);
      const t = setTimeout(() => setUps([]), 5200);
      return () => clearTimeout(t);
    }
  }, [stats]);

  return (
    <Card className="mb-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚔️</span>
          <h3 className="font-display font-extrabold tracking-tight">Estadísticas de personaje</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">Nivel general</span>
          <span className="grid h-9 min-w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 px-2 font-display text-lg font-extrabold text-ink-950 shadow-glow">{overall}</span>
        </div>
      </div>

      <div className="space-y-3">
        {stats.map((st, i) => (
          <div key={st.key} className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg ring-1"
              style={{ background: `${st.color}1f`, boxShadow: `inset 0 0 0 1px ${st.color}45` }}>{st.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-sm font-semibold truncate">{st.label}</span>
                <span className="shrink-0 text-xs font-bold tabular-nums" style={{ color: st.color }}>
                  Nv {st.level}
                  <span className="ml-1.5 font-medium text-stone-400">{st.intoLevel}/{st.intoLevel + st.toNext} XP</span>
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-stone-200/70 dark:bg-white/[0.08] overflow-hidden">
                <m.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${st.color}, ${st.color}bb)`, boxShadow: `0 0 12px -2px ${st.color}` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(3, st.pct)}%` }}
                  transition={{ duration: 0.9, delay: 0.05 * i, ease: [0.2, 0.7, 0.3, 1] }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Animación de subida de nivel (específica de la stat que subió) */}
      <AnimatePresence>
        {ups.length > 0 && (
          <m.div
            className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-[2px]" />
            <div className="relative space-y-2">
              {ups.map((u, i) => (
                <m.div key={u.key}
                  initial={{ scale: 0.6, opacity: 0, y: 12 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ delay: i * 0.18, type: 'spring', stiffness: 320, damping: 18 }}
                  className="flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl"
                  style={{ borderColor: `${u.color}66`, background: `linear-gradient(135deg, ${u.color}26, rgba(0,0,0,0.5))` }}>
                  <m.span className="text-3xl"
                    animate={{ rotate: [0, -12, 12, 0], scale: [1, 1.25, 1] }}
                    transition={{ duration: 0.7, delay: i * 0.18 + 0.1 }}>{u.icon}</m.span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: u.color }}>¡Subió de nivel!</p>
                    <p className="font-display text-lg font-extrabold text-white">{u.label} → Nivel {u.level}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
