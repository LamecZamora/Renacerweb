import { useState } from 'react';
import { Card, Badge, Progress } from './ui';
import { weeklyQuests, weekClaimed, claimWeek, weeksCompleted } from '../lib/quests';
import { confetti } from '../lib/confetti';
import { toast } from '../lib/toast';

export default function WeeklyQuests() {
  const [, force] = useState(0);
  const { quests, doneN, allDone, week } = weeklyQuests();
  const claimed = weekClaimed(week);
  const weeks = weeksCompleted();

  const claim = () => {
    if (!allDone || claimed) return;
    claimWeek(week);
    confetti();
    toast('🏆 ¡Misión semanal completada! Eres una máquina.', 'achievement');
    force((x) => x + 1);
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2"><span>🗡️</span><h3 className="font-bold">Misiones de la semana</h3></div>
        <div className="flex items-center gap-2">
          {weeks > 0 && <Badge tone="amber">🔥 {weeks} semana(s) completa(s)</Badge>}
          <Badge tone={allDone ? 'green' : 'brand'}>{doneN}/{quests.length}</Badge>
        </div>
      </div>
      <div className="space-y-2.5">
        {quests.map((q) => (
          <div key={q.id}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className={`flex items-center gap-2 ${q.done ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}`}>
                <span>{q.done ? '✅' : q.icon}</span> {q.label}
              </span>
              <span className="text-xs text-stone-500">{q.current}/{q.target}</span>
            </div>
            <Progress value={q.current} max={q.target} />
          </div>
        ))}
      </div>
      {allDone && !claimed && (
        <button onClick={claim} className="mt-4 w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-2.5 text-sm font-bold text-ink-950 shadow-glow hover:brightness-105">
          🏆 Reclamar recompensa de la semana
        </button>
      )}
      {claimed && <p className="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400 text-center">✅ Semana completada y reclamada. ¡Vuelve el lunes por más!</p>}
      {!allDone && <p className="mt-3 text-[11px] text-stone-400 text-center">Las misiones se reinician cada semana. Completa las 5 para tu recompensa.</p>}
    </Card>
  );
}
