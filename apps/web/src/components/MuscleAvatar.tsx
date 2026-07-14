import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Card, Badge } from './ui';
import { useProgress } from '../lib/storage';
import { computeStats } from '../lib/stats';
import { phaseForBMI } from '../data/fitnessPlan';
import { MUSCLES, musclesForDay, type MuscleId } from '../data/muscles';

type State = 'idle' | 'today' | 'done';
const STROKE = '#3f3f5e';
const COLORS: Record<State, string> = { idle: '#cbd1dc', today: '#f59e0b', done: '#22c55e' };
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Silueta anatómica del cuerpo (compartida frente/espalda), viewBox 0 0 240 470.
const SILHOUETTE = 'M120 8 C132 8 141 18 141 31 C141 39 138 44 138 49 C146 52 156 54 164 59 C176 66 184 78 188 94 C193 114 196 136 197 158 C198 176 201 194 207 210 C209 216 205 221 199 219 C192 216 187 208 183 198 C179 188 176 176 174 166 C174 182 173 198 171 212 C168 232 166 252 166 272 C166 300 163 330 158 360 C155 384 152 408 147 430 C145 440 137 442 131 436 C127 432 125 424 124 416 C121 390 120 362 120 342 C120 362 119 390 116 416 C115 424 113 432 109 436 C103 442 95 440 93 430 C88 408 85 384 82 360 C77 330 74 300 74 272 C74 252 72 232 69 212 C67 198 66 182 66 166 C64 176 61 188 57 198 C53 208 48 216 41 219 C35 221 31 216 33 210 C39 194 42 176 43 158 C44 136 47 114 52 94 C56 78 64 66 76 59 C84 54 94 52 102 49 C102 44 99 39 99 31 C99 18 108 8 120 8 Z';

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
        stroke={STROKE} strokeWidth={1.4} strokeLinejoin="round"
        onClick={() => setOpen(id)} role="button" aria-label={MUSCLES[id].label}>
        <title>{MUSCLES[id].label}</title>
        {children}
      </g>
    );
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2"><span>🗺️</span><h3 className="font-display font-extrabold tracking-tight">Mapa muscular · hoy</h3></div>
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
        <svg viewBox="0 0 240 470" className="h-[360px] w-auto max-w-full" xmlns="http://www.w3.org/2000/svg">
          {/* Silueta anatómica base */}
          <path d={SILHOUETTE} fill={COLORS.idle} stroke={STROKE} strokeWidth={1.7} strokeLinejoin="round" />

          {view === 'front' ? (
            <>
              <Muscle id="trapecios"><path d="M104 50 C112 47 128 47 136 50 L131 67 C127 64 123 63 120 63 C117 63 113 64 109 67 Z" /></Muscle>
              <Muscle id="hombros"><path d="M78 66 C66 70 58 82 56 96 C55 104 61 108 67 103 C71 89 77 80 87 74 C85 70 82 67 78 66 Z" /><path d="M162 66 C174 70 182 82 184 96 C185 104 179 108 173 103 C169 89 163 80 153 74 C155 70 158 67 162 66 Z" /></Muscle>
              <Muscle id="pecho"><path d="M116 67 C104 67 91 71 85 81 C80 90 83 101 95 105 C107 109 117 104 118 92 L118 69 C118 67 117 67 116 67 Z" /><path d="M124 67 C136 67 149 71 155 81 C160 90 157 101 145 105 C133 109 123 104 122 92 L122 69 C122 67 123 67 124 67 Z" /></Muscle>
              <Muscle id="biceps"><path d="M62 100 C54 104 50 116 50 130 C50 142 55 150 61 152 C65 138 69 120 73 106 C70 102 66 100 62 100 Z" /><path d="M178 100 C186 104 190 116 190 130 C190 142 185 150 179 152 C175 138 171 120 167 106 C170 102 174 100 178 100 Z" /></Muscle>
              <Muscle id="antebrazo"><path d="M57 155 C51 169 48 187 50 203 C52 213 59 214 63 207 C65 189 65 171 64 157 C61 153 59 153 57 155 Z" /><path d="M183 155 C189 169 192 187 190 203 C188 213 181 214 177 207 C175 189 175 171 176 157 C179 153 181 153 183 155 Z" /></Muscle>
              <Muscle id="oblicuos"><path d="M97 113 C90 116 86 127 86 147 C86 163 91 175 100 183 L102 176 L102 114 C102 112 99 112 97 113 Z" /><path d="M143 113 C150 116 154 127 154 147 C154 163 149 175 140 183 L138 176 L138 114 C138 112 141 112 143 113 Z" /></Muscle>
              <Muscle id="abdomen"><path d="M107 106 C104 106 102 109 102 113 L102 173 C102 187 110 197 120 201 C130 197 138 187 138 173 L138 113 C138 109 136 106 133 106 Z" /></Muscle>
              <Muscle id="cuadriceps"><path d="M86 210 C79 232 79 264 87 296 C92 314 104 314 108 300 C111 266 110 236 106 210 C100 202 92 202 86 210 Z" /><path d="M154 210 C161 232 161 264 153 296 C148 314 136 314 132 300 C129 266 130 236 134 210 C140 202 148 202 154 210 Z" /></Muscle>
              <Muscle id="pantorrilla"><path d="M89 308 C84 330 84 360 90 388 C93 402 103 402 107 390 C110 360 109 332 105 310 C100 304 93 304 89 308 Z" /><path d="M151 308 C156 330 156 360 150 388 C147 402 137 402 133 390 C130 360 131 332 135 310 C140 304 147 304 151 308 Z" /></Muscle>
              {/* líneas del abdomen */}
              <g stroke={STROKE} strokeWidth={1.1} fill="none" strokeLinecap="round" opacity={todaySet.has('abdomen') ? 0.9 : 0.45}>
                <path d="M120 116 L120 194" /><path d="M104 132 L136 132" /><path d="M104 150 L136 150" /><path d="M104 168 L136 168" />
              </g>
            </>
          ) : (
            <>
              <Muscle id="trapecios"><path d="M120 49 C130 49 141 53 149 59 L140 98 C133 91 127 89 120 89 C113 89 107 91 100 98 L91 59 C99 53 110 49 120 49 Z" /></Muscle>
              <Muscle id="hombros"><path d="M78 66 C66 70 58 82 56 96 C55 104 61 108 67 103 C71 89 77 80 87 74 C85 70 82 67 78 66 Z" /><path d="M162 66 C174 70 182 82 184 96 C185 104 179 108 173 103 C169 89 163 80 153 74 C155 70 158 67 162 66 Z" /></Muscle>
              <Muscle id="dorsales"><path d="M97 100 C87 106 83 126 85 152 C87 168 95 178 105 184 L107 122 C107 110 104 102 100 100 Z" /><path d="M143 100 C153 106 157 126 155 152 C153 168 145 178 135 184 L133 122 C133 110 136 102 140 100 Z" /></Muscle>
              <Muscle id="triceps"><path d="M62 100 C54 104 50 116 50 130 C50 142 55 150 61 152 C65 138 69 120 73 106 C70 102 66 100 62 100 Z" /><path d="M178 100 C186 104 190 116 190 130 C190 142 185 150 179 152 C175 138 171 120 167 106 C170 102 174 100 178 100 Z" /></Muscle>
              <Muscle id="antebrazo"><path d="M57 155 C51 169 48 187 50 203 C52 213 59 214 63 207 C65 189 65 171 64 157 C61 153 59 153 57 155 Z" /><path d="M183 155 C189 169 192 187 190 203 C188 213 181 214 177 207 C175 189 175 171 176 157 C179 153 181 153 183 155 Z" /></Muscle>
              <Muscle id="lumbar"><path d="M108 152 C104 154 102 164 104 176 C106 186 114 190 120 190 C126 190 134 186 136 176 C138 164 136 154 132 152 C127 154 113 154 108 152 Z" /></Muscle>
              <Muscle id="gluteos"><path d="M92 192 C81 194 77 208 82 223 C87 236 100 237 106 228 L106 198 C106 193 99 191 92 192 Z" /><path d="M148 192 C159 194 163 208 158 223 C153 236 140 237 134 228 L134 198 C134 193 141 191 148 192 Z" /></Muscle>
              <Muscle id="femoral"><path d="M88 232 C81 254 81 284 89 312 C94 326 104 326 108 314 C111 284 110 256 106 232 C100 224 94 224 88 232 Z" /><path d="M152 232 C159 254 159 284 151 312 C146 326 136 326 132 314 C129 284 130 256 134 232 C140 224 146 224 152 232 Z" /></Muscle>
              <Muscle id="pantorrilla"><path d="M89 322 C84 344 84 366 90 392 C93 404 103 404 107 392 C110 366 109 344 105 324 C100 318 93 318 89 322 Z" /><path d="M151 322 C156 344 156 366 150 392 C147 404 137 404 133 392 C130 366 131 344 135 324 C140 318 147 318 151 322 Z" /></Muscle>
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
