import { useMemo, useState } from 'react';
import { Card, Stat, PageHeader, Progress, Badge } from '../components/ui';
import { computeStats } from '../lib/stats';
import { getLongestStreak } from '../lib/storage';
import { ACHIEVEMENTS, RANK_COLOR } from '../data/achievements';
import ActivityCalendar from '../components/ActivityCalendar';

const RANKS = ['bronce', 'plata', 'oro', 'platino', 'diamante'] as const;

export default function Achievements() {
  const s = computeStats();
  const [filter, setFilter] = useState<string>('todos');

  const evaluated = useMemo(() => ACHIEVEMENTS.map((a) => {
    const value = a.get(s);
    return { ...a, value, unlocked: value >= a.goal, pct: Math.min(100, Math.round((value / a.goal) * 100)) };
  }), [s]);
  const unlocked = evaluated.filter((a) => a.unlocked);
  const longest = getLongestStreak();
  const byRank = (r: string) => ({
    total: evaluated.filter((a) => a.rank === r).length,
    got: unlocked.filter((a) => a.rank === r).length,
  });

  const shown = evaluated
    .filter((a) => filter === 'todos' ? true
      : filter === 'progreso' ? !a.unlocked
      : filter === 'logrados' ? a.unlocked
      : a.rank === filter)
    .sort((a, b) => (b.unlocked ? 1 : 0) - (a.unlocked ? 1 : 0) || b.pct - a.pct);

  const FILTERS: { id: string; label: string }[] = [
    { id: 'todos', label: `Todos (${evaluated.length})` },
    { id: 'progreso', label: `En progreso (${evaluated.length - unlocked.length})` },
    { id: 'logrados', label: `Desbloqueados (${unlocked.length})` },
    ...RANKS.map((r) => ({ id: r, label: r[0].toUpperCase() + r.slice(1) })),
  ];

  return (
    <>
      <PageHeader title="Logros" subtitle="Insignias y constancia que ganas con tu progreso real." icon="🏆" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Logros" value={`${unlocked.length} / ${evaluated.length}`} sub={`${Math.round((unlocked.length / evaluated.length) * 100)}% completado`} />
        <Stat label="Racha actual" value={`${s.streak} días`} sub={`mejor: ${longest} días`} />
        <Stat label="Días activos" value={`${s.activeDays}`} sub="en total" />
        <Stat label="Nivel" value={`${s.level}`} sub={`${s.points} XP`} />
      </div>

      {/* Progreso global + desglose por rango (clic para filtrar) */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h3 className="font-bold">Progreso de insignias</h3>
          <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{unlocked.length}/{evaluated.length}</span>
        </div>
        <Progress value={unlocked.length} max={evaluated.length} className="mb-4" />
        <div className="grid grid-cols-5 gap-2">
          {RANKS.map((r) => {
            const c = byRank(r);
            return (
              <button key={r} onClick={() => setFilter(filter === r ? 'todos' : r)}
                className={`rounded-xl border p-2 text-center transition ${filter === r ? 'ring-2 ring-brand-500 border-transparent' : 'border-stone-200/60 dark:border-white/10 hover:border-brand-500/40'}`}>
                <p className="font-display text-lg font-extrabold leading-none" style={{ color: RANK_COLOR[r] }}>{c.got}<span className="text-stone-400 text-sm">/{c.total}</span></p>
                <p className="text-[10px] uppercase tracking-wide text-stone-500 dark:text-stone-400 capitalize mt-1">{r}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Calendario de actividad */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-bold">Calendario de actividad</h3>
          <div className="flex gap-2">
            <Badge tone="brand">🔥 {s.streak} seguidos</Badge>
            <Badge tone="slate">🏅 mejor: {longest}</Badge>
          </div>
        </div>
        <ActivityCalendar />
      </Card>

      {/* Filtros */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filter === f.id ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {shown.map((a, i) => (
          <div key={a.id}
            className={`rise glass-card rounded-2xl border p-4 ${a.unlocked ? '' : 'opacity-80'}`}
            style={{ animationDelay: `${Math.min(i * 0.015, 0.3)}s`, borderColor: a.unlocked ? `${RANK_COLOR[a.rank]}66` : undefined }}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl text-3xl ${a.unlocked ? '' : 'grayscale opacity-70'}`}
                style={{ background: a.unlocked ? `${RANK_COLOR[a.rank]}22` : 'rgba(120,113,108,0.1)', boxShadow: a.unlocked ? `inset 0 0 0 1px ${RANK_COLOR[a.rank]}55` : undefined }}>
                {a.unlocked ? a.icon : '🔒'}
              </span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide capitalize"
                style={{ background: `${RANK_COLOR[a.rank]}1f`, color: RANK_COLOR[a.rank] }}>{a.rank}</span>
            </div>
            <h4 className="font-bold mt-2 leading-tight">{a.title}</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-2 line-clamp-2 min-h-[2rem]">{a.desc}</p>
            {a.unlocked ? (
              <p className="text-xs font-bold flex items-center gap-1" style={{ color: RANK_COLOR[a.rank] }}>✓ Desbloqueado</p>
            ) : (
              <>
                <Progress value={a.value} max={a.goal} />
                <p className="mt-1 text-xs text-stone-400 tabular-nums">{Math.min(a.value, a.goal)} / {a.goal} · {a.pct}%</p>
              </>
            )}
          </div>
        ))}
      </div>
      {shown.length === 0 && <p className="text-sm text-stone-500 text-center py-8">No hay insignias en este filtro.</p>}
    </>
  );
}
