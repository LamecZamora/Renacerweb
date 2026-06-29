import { Card, Stat, PageHeader, Badge } from '../components/ui';
import { getProfile, getActiveDays } from '../lib/storage';
import { computeStats } from '../lib/stats';
import { ACHIEVEMENTS } from '../data/achievements';

export default function Reports() {
  const profile = getProfile();
  const s = computeStats();
  const unlocked = ACHIEVEMENTS.filter((a) => a.get(s) >= a.goal).length;
  const since = profile ? new Date(profile.createdAt).toLocaleDateString('es') : '—';

  const activeSet = new Set(getActiveDays());
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { key: d.toISOString().slice(0, 10), label: d.toLocaleDateString('es', { weekday: 'short' }).slice(0, 2), active: activeSet.has(d.toISOString().slice(0, 10)) };
  });
  const activeThisWeek = last7.filter((d) => d.active).length;

  const rows: [string, string | number][] = [
    ['Cuenta', profile?.name ?? ''],
    ['Desde', since],
    ['Nivel', s.level],
    ['XP total', s.points],
    ['XP hoy', `${s.xpToday}/${s.xpCap}`],
    ['Racha (días)', s.streak],
    ['Días activos', s.activeDays],
    ['Logros', `${unlocked}/${ACHIEVEMENTS.length}`],
    ['Ejercicios de cursos', s.courseExercises],
    ['Cursos completados', s.coursesCompleted],
    ['Ejercicios de inglés', s.english],
    ['Retos de programación', s.code],
    ['Ejercicios de fitness', s.fitness],
    ['Entradas de diario', s.journal],
    ['Ánimo medio (1-5)', s.moodAvg],
    ['Páginas leídas', s.pages],
    ['Libros terminados', s.booksFinished],
    ['Ingresos', s.income],
    ['Gastos', s.expense],
    ['Balance', s.net],
    ['Tareas de proyectos', s.tasksDone],
    ['Peso actual', s.weightCurrent ?? '—'],
    ['Peso perdido (kg)', s.weightDelta],
    ['IMC', s.imc ? `${s.imc} (${s.imcLabel})` : '—'],
  ];

  const exportCsv = () => {
    const csv = [['Métrica', 'Valor'], ...rows].map((r) => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `renacer-reporte-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader title="Reportes" subtitle="Tu progreso real, calculado desde tu cuenta." icon="▤" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Nivel" value={`${s.level}`} sub={`${s.points} XP`} />
        <Stat label="Racha" value={`${s.streak} días`} sub={`${s.activeDays} días activos`} />
        <Stat label="Logros" value={`${unlocked}/${ACHIEVEMENTS.length}`} />
        <Stat label="Balance" value={`$${s.net.toFixed(0)}`} sub="ingresos − gastos" />
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-bold">Esta semana</h3>
          <Badge tone={activeThisWeek >= 5 ? 'green' : activeThisWeek >= 3 ? 'brand' : 'amber'}>{activeThisWeek}/7 días activos</Badge>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {last7.map((d) => (
            <div key={d.key} className="text-center">
              <div className={`mx-auto grid h-9 w-9 place-items-center rounded-xl text-sm font-bold ${d.active ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-stone-200/50 dark:bg-white/5 text-stone-400'}`}>
                {d.active ? '✓' : '·'}
              </div>
              <p className="mt-1 text-[10px] uppercase text-stone-400">{d.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
          {activeThisWeek >= 5 ? '🔥 ¡Semana sólida! Mantén el ritmo.' : activeThisWeek >= 3 ? '👍 Vas bien, intenta sumar un par de días más.' : 'Cada día cuenta: una pequeña acción hoy ya es avance.'}
        </p>
      </Card>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-bold">Resumen de tu cuenta</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Activa desde {since} · {profile?.goal}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCsv} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-ink-950 hover:opacity-95">⬇ Exportar CSV</button>
            <button onClick={() => window.print()} className="rounded-lg border border-stone-200 dark:border-white/10 px-3 py-1.5 text-xs font-semibold">🖨 Imprimir</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {rows.slice(2).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-lg bg-stone-200/40 dark:bg-white/5 px-3 py-2">
              <span className="text-xs text-stone-500 dark:text-stone-400">{k}</span>
              <span className="font-display font-bold">{v}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <Badge tone="brand">Consejo</Badge>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Exporta tu reporte cada semana para ver cómo crece tu progreso. La constancia construye al nuevo tú.
          </p>
        </div>
      </Card>
    </>
  );
}
