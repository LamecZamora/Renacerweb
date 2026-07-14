import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Card, Badge } from './ui';
import { useProgress } from '../lib/storage';
import { computeStats } from '../lib/stats';
import { phaseForBMI } from '../data/fitnessPlan';
import { MUSCLES, musclesForDay, type MuscleId } from '../data/muscles';

type State = 'idle' | 'today' | 'done';
const COLORS: Record<State, string> = { idle: '#78716c', today: '#f59e0b', done: '#22c55e' };
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function MuscleAvatar() {
  const { isDone } = useProgress('fitness');
  const stats = computeStats();
  const phase = phaseForBMI(stats.imc);
  const todayKey = new Date().getDay();
  const [view, setView] = useState<'front' | 'back'>('front');
  const [open, setOpen] = useState<MuscleId | null>(null);

  const todayPlan = phase.days.find((d) => d.key === todayKey);
  const todayMuscles = todayPlan ? musclesForDay(todayPlan) : [];
  const todaySet = new Set(todayMuscles);
  const dayComplete = (planKey: number) => {
    const d = phase.days.find((p) => p.key === planKey);
    return !!d && d.exercises.length > 0 && d.exercises.every((e) => isDone(e.id));
  };
  const todayComplete = dayComplete(todayKey);

  const stateOf = (id: MuscleId): State => (todaySet.has(id) ? (todayComplete ? 'done' : 'today') : 'idle');

  const Muscle = ({ id, children }: { id: MuscleId; children: React.ReactNode }) => {
    const st = stateOf(id);
    return (
      <g className={`muscle-clickable ${st === 'today' ? 'muscle-today' : ''}`} fill={COLORS[st]}
        onClick={() => setOpen(id)} role="button" aria-label={MUSCLES[id].label}>
        <title>{MUSCLES[id].label}</title>
        {children}
      </g>
    );
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2"><span>🧍</span><h3 className="font-display font-extrabold tracking-tight">Tu cuerpo hoy</h3></div>
        <Badge tone={todayComplete ? 'green' : todayMuscles.length ? 'amber' : 'slate'}>
          {todayMuscles.length === 0 ? 'Descanso' : todayComplete ? '¡Entreno hecho! ✅' : `${todayPlan?.focus ?? 'Hoy'}`}
        </Badge>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
        {todayMuscles.length === 0
          ? 'Hoy toca descanso o cardio. Recupérate 😴'
          : todayComplete
            ? 'Completaste los músculos de hoy. ¡Se pusieron verdes! 💚'
            : 'Los músculos que parpadean son los de hoy. Toca uno para ver la técnica.'}
      </p>

      <div className="flex justify-center gap-1.5 mb-3">
        {(['front', 'back'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${view === v ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
            {v === 'front' ? 'Frente' : 'Espalda'}
          </button>
        ))}
      </div>

      <div className="grid place-items-center">
        <svg viewBox="0 0 220 380" className="h-[340px] w-auto max-w-full" xmlns="http://www.w3.org/2000/svg">
          {/* base no-muscular (cabeza, articulaciones, manos, pies) */}
          <g fill="#57534e" opacity="0.55">
            <circle cx="110" cy="30" r="18" />
            <rect x="103" y="45" width="14" height="12" rx="4" />
            <rect x="90" y="152" width="40" height="26" rx="12" />
            <circle cx="53" cy="180" r="6" /><circle cx="167" cy="180" r="6" />
            <circle cx="95" cy="250" r="8" /><circle cx="125" cy="250" r="8" />
            <ellipse cx="93" cy="330" rx="8" ry="6" /><ellipse cx="127" cy="330" rx="8" ry="6" />
          </g>

          {view === 'front' ? (
            <>
              <Muscle id="trapecios"><path d="M100 60 q10 -6 20 0 l-4 10 q-6 -3 -12 0 z" /></Muscle>
              <Muscle id="hombros"><ellipse cx="74" cy="76" rx="13" ry="12" /><ellipse cx="146" cy="76" rx="13" ry="12" /></Muscle>
              <Muscle id="pecho"><ellipse cx="96" cy="90" rx="15" ry="12" transform="rotate(-8 96 90)" /><ellipse cx="124" cy="90" rx="15" ry="12" transform="rotate(8 124 90)" /></Muscle>
              <Muscle id="biceps"><ellipse cx="65" cy="112" rx="9" ry="20" /><ellipse cx="155" cy="112" rx="9" ry="20" /></Muscle>
              <Muscle id="antebrazo"><ellipse cx="57" cy="152" rx="8" ry="22" /><ellipse cx="163" cy="152" rx="8" ry="22" /></Muscle>
              <Muscle id="oblicuos"><ellipse cx="90" cy="128" rx="6" ry="20" /><ellipse cx="130" cy="128" rx="6" ry="20" /></Muscle>
              <Muscle id="abdomen"><rect x="97" y="104" width="26" height="48" rx="8" /></Muscle>
              <Muscle id="cuadriceps"><ellipse cx="96" cy="212" rx="13" ry="34" /><ellipse cx="124" cy="212" rx="13" ry="34" /></Muscle>
              <Muscle id="pantorrilla"><ellipse cx="94" cy="288" rx="10" ry="28" /><ellipse cx="126" cy="288" rx="10" ry="28" /></Muscle>
            </>
          ) : (
            <>
              <Muscle id="trapecios"><path d="M110 58 L126 74 L117 104 L110 110 L103 104 L94 74 Z" /></Muscle>
              <Muscle id="hombros"><ellipse cx="74" cy="76" rx="13" ry="12" /><ellipse cx="146" cy="76" rx="13" ry="12" /></Muscle>
              <Muscle id="dorsales"><ellipse cx="94" cy="120" rx="12" ry="24" transform="rotate(10 94 120)" /><ellipse cx="126" cy="120" rx="12" ry="24" transform="rotate(-10 126 120)" /></Muscle>
              <Muscle id="triceps"><ellipse cx="65" cy="112" rx="9" ry="20" /><ellipse cx="155" cy="112" rx="9" ry="20" /></Muscle>
              <Muscle id="antebrazo"><ellipse cx="57" cy="152" rx="8" ry="22" /><ellipse cx="163" cy="152" rx="8" ry="22" /></Muscle>
              <Muscle id="lumbar"><ellipse cx="110" cy="152" rx="12" ry="12" /></Muscle>
              <Muscle id="gluteos"><ellipse cx="98" cy="180" rx="13" ry="14" /><ellipse cx="122" cy="180" rx="13" ry="14" /></Muscle>
              <Muscle id="femoral"><ellipse cx="96" cy="222" rx="13" ry="30" /><ellipse cx="124" cy="222" rx="13" ry="30" /></Muscle>
              <Muscle id="pantorrilla"><ellipse cx="94" cy="288" rx="10" ry="28" /><ellipse cx="126" cy="288" rx="10" ry="28" /></Muscle>
            </>
          )}
        </svg>
      </div>

      {/* Leyenda */}
      <div className="mt-1 flex justify-center gap-4 text-[11px] text-stone-500 dark:text-stone-400">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS.today }} /> Hoy</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS.done }} /> Hecho</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS.idle }} /> Descanso</span>
      </div>

      {/* Tira de la semana */}
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 0].map((k) => {
          const d = phase.days.find((p) => p.key === k);
          const trained = d ? musclesForDay(d).length : 0;
          const complete = dayComplete(k);
          const isToday = k === todayKey;
          return (
            <div key={k} className={`rounded-lg border p-1.5 text-center ${isToday ? 'border-brand-500' : 'border-stone-200/60 dark:border-white/10'}`}>
              <p className="text-[10px] text-stone-400">{DAYS[k]}</p>
              <span className="mx-auto mt-1 grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold"
                style={{ background: complete ? `${COLORS.done}33` : trained ? `${COLORS.idle}22` : 'transparent', color: complete ? COLORS.done : trained ? '#a8a29e' : '#a8a29e' }}>
                {complete ? '✓' : trained || '·'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal de video */}
      <AnimatePresence>
        {open && (
          <m.div className="fixed inset-0 z-50 grid place-items-center bg-ink-950/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <m.div className="w-full max-w-lg rounded-2xl border border-white/10 bg-ink-950/90 p-4 shadow-2xl"
              initial={{ scale: 0.92, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-extrabold text-white">{MUSCLES[open].label}</h4>
                <button onClick={() => setOpen(null)} className="rounded-lg px-2 py-1 text-sm text-stone-400 hover:text-white hover:bg-white/10">✕</button>
              </div>
              <div className="rounded-xl overflow-hidden bg-black">
                {MUSCLES[open].anim ? (
                  <img src={`/ejercicios/${MUSCLES[open].slug}.avif`} alt={MUSCLES[open].label} className="w-full" />
                ) : (
                  <video src={`/ejercicios/${MUSCLES[open].slug}.mp4`} poster={`/ejercicios/${MUSCLES[open].slug}.png`} controls autoPlay loop muted playsInline className="w-full" />
                )}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
