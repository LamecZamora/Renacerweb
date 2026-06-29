import { useState } from 'react';
import { Card, Badge } from './ui';
import { computeStats } from '../lib/stats';
import { getDailyGoal, setDailyGoal, GOAL_OPTIONS } from '../lib/xp';

export default function DailyGoal() {
  const [goal, setGoalState] = useState(getDailyGoal());
  const s = computeStats();
  const today = s.xpToday;
  const pct = Math.min(100, goal ? Math.round((today / goal) * 100) : 0);
  const done = today >= goal;
  const pick = (n: number) => { setGoalState(n); setDailyGoal(n); };

  const r = 32, circ = 2 * Math.PI * r;

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
            <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" className="text-stone-200 dark:text-white/10" strokeWidth="7" />
            <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(var(--brand-500))" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ} style={{ transition: 'stroke-dashoffset .6s ease' }} />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-lg">{done ? '✅' : '🎯'}</span>
          </div>
        </div>
        <div className="flex-1 min-w-[160px]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold">Meta diaria</h3>
            {done && <Badge tone="green">¡Cumplida! 🔥</Badge>}
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-300">{today}/{goal} XP hoy {done ? '· ¡vas con todo!' : `· te faltan ${Math.max(0, goal - today)}`}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {GOAL_OPTIONS.map((o) => (
              <button key={o.id} onClick={() => pick(o.xp)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${goal === o.xp ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
                {o.label} · {o.xp}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
