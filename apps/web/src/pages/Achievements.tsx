import { Card, Stat, PageHeader, Progress, Badge } from '../components/ui';
import { computeStats } from '../lib/stats';
import { getLongestStreak } from '../lib/storage';
import { ACHIEVEMENTS, RANK_COLOR } from '../data/achievements';
import ActivityCalendar from '../components/ActivityCalendar';

export default function Achievements() {
  const s = computeStats();
  const evaluated = ACHIEVEMENTS.map((a) => {
    const value = a.get(s);
    return { ...a, value, unlocked: value >= a.goal, pct: Math.min(100, Math.round((value / a.goal) * 100)) };
  });
  const unlocked = evaluated.filter((a) => a.unlocked);
  const byRank = (r: string) => ({
    total: ACHIEVEMENTS.filter((a) => a.rank === r).length,
    got: unlocked.filter((a) => a.rank === r).length,
  });
  const ranks = [['bronce', byRank('bronce')], ['plata', byRank('plata')], ['oro', byRank('oro')], ['platino', byRank('platino')], ['diamante', byRank('diamante')]] as const;
  const longest = getLongestStreak();

  return (
    <>
      <PageHeader title="Logros" subtitle="Insignias y constancia que ganas con tu progreso real." icon="🏆" />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Stat label="Logros" value={`${unlocked.length} / ${ACHIEVEMENTS.length}`} sub="desbloqueados" />
        <Stat label="Cursos" value={`${s.coursesCompleted}`} sub="certificados 🎓" />
        <Stat label="Racha actual" value={`${s.streak} días`} sub={`mejor: ${longest} días`} />
        <Stat label="Días activos" value={`${s.activeDays}`} sub="en total" />
        <Stat label="Nivel" value={`${s.level}`} sub={`${s.points} XP · hoy ${s.xpToday}/${s.xpCap}`} />
      </div>

      {/* Calendario de actividad */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-bold">Calendario de actividad</h3>
          <div className="flex gap-2">
            <Badge tone="brand">🔥 {s.streak} días seguidos</Badge>
            <Badge tone="slate">🏅 mejor: {longest}</Badge>
          </div>
        </div>
        <ActivityCalendar />
      </Card>

      {/* Desglose por rango */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
        {ranks.map(([rank, c]) => (
          <Card key={rank} className="text-center">
            <p className="text-2xl font-display font-extrabold" style={{ color: RANK_COLOR[rank] }}>{c.got}/{c.total}</p>
            <p className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 capitalize">{rank}</p>
          </Card>
        ))}
      </div>

      <h3 className="font-display text-lg font-bold mb-3">Todas las insignias</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {evaluated.map((a) => (
          <Card key={a.id} className={a.unlocked ? 'ring-1 ring-brand-500/40' : 'opacity-70'}>
            <div className="flex items-start justify-between mb-1">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl text-3xl ${a.unlocked ? '' : 'grayscale'}`}
                style={{ background: a.unlocked ? `${RANK_COLOR[a.rank]}22` : 'rgba(120,113,108,0.1)' }}>
                {a.unlocked ? a.icon : '🔒'}
              </span>
              <Badge tone={a.unlocked ? 'green' : 'slate'}>
                <span style={{ color: a.unlocked ? RANK_COLOR[a.rank] : undefined }} className="capitalize">{a.rank}</span>
              </Badge>
            </div>
            <h4 className="font-bold mt-2">{a.title}</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">{a.desc}</p>
            {a.unlocked ? (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✓ Desbloqueado</p>
            ) : (
              <>
                <Progress value={a.value} max={a.goal} />
                <p className="mt-1 text-xs text-stone-400">{Math.min(a.value, a.goal)} / {a.goal}</p>
              </>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
