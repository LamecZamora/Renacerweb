import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { Card, Stat, Progress, Badge, Skeleton } from '../components/ui';
import { getProfile, readList, getActiveDays } from '../lib/storage';
import { computeStats } from '../lib/stats';
import { ACHIEVEMENTS } from '../data/achievements';
import { learningNotes, dailyChallenge, weeklyPlan } from '../lib/learning';
import { ENGLISH_TOTAL, SPEAKING_TOTAL, ENGLISH_EXAMS } from '../data/english';
import WeeklyQuests from '../components/WeeklyQuests';
import DailyGoal from '../components/DailyGoal';

type Metric = { date: string; weight?: number };

// recharts se carga diferido: las gráficas entran después del primer render.
const WeightChart = lazy(() => import('../components/DashboardCharts').then((m) => ({ default: m.WeightChart })));
const StatsRadar = lazy(() => import('../components/DashboardCharts').then((m) => ({ default: m.StatsRadar })));
const ChartFallback = () => <Skeleton className="h-[220px] w-full rounded-xl" />;

export default function Dashboard() {
  const profile = getProfile();
  const s = computeStats();

  const unlocked = ACHIEVEMENTS.filter((a) => a.get(s) >= a.goal);
  const notes = learningNotes();
  const reto = dailyChallenge();

  const hour = new Date().getHours();
  const saludo = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  const activeToday = getActiveDays().includes(new Date().toISOString().slice(0, 10));
  const streakAtRisk = s.streak > 0 && !activeToday;
  const plan = weeklyPlan();
  const engGrand = ENGLISH_TOTAL + SPEAKING_TOTAL + Object.keys(ENGLISH_EXAMS).length;
  const engPct = Math.round((s.english / engGrand) * 100);
  const resumen = [
    { icon: '🔥', label: 'Racha', value: `${s.streak} ${s.streak === 1 ? 'día' : 'días'}`, tone: streakAtRisk ? 'text-amber-600 dark:text-amber-500' : '' },
    { icon: '🎯', label: 'Reto de hoy', value: reto ? '1 pendiente' : '✓ al día', tone: '' },
    { icon: '📚', label: 'Próximo nivel', value: plan[0] ? plan[0].course.name : '—', tone: '' },
    { icon: '🗣', label: 'Inglés', value: `${engPct}%`, tone: '' },
  ];
  const subtitle = streakAtRisk
    ? `🔥 Tu racha de ${s.streak} días está en riesgo: completa algo hoy para mantenerla.`
    : reto
      ? 'Tu reto del día te espera. Un paso más hacia Vancouver. 🍁'
      : 'Tu mejor versión se construye hoy.';
  const metrics = readList<Metric>('metrics');
  const weightSeries = [...metrics].filter((m) => m.weight).reverse()
    .map((m) => ({ date: new Date(m.date).toLocaleDateString('es', { day: '2-digit', month: 'short' }), weight: m.weight }));

  const radar = [
    { stat: 'Fuerza', level: Math.min(20, s.fitness) },
    { stat: 'Inglés', level: Math.min(20, s.english) },
    { stat: 'Programación', level: Math.min(20, s.code + Math.floor(s.courseExercises / 2)) },
    { stat: 'Disciplina', level: Math.min(20, s.journal + s.fitness) },
    { stat: 'Conocimiento', level: Math.min(20, Math.floor(s.pages / 20) + s.coursesCompleted * 2) },
    { stat: 'Creatividad', level: Math.min(20, s.tasksDone) },
  ];

  const goals = [
    { title: 'Entrenar · ejercicios de la semana', progress: s.fitness, target: 15 },
    { title: 'Inglés · ejercicios', progress: s.english, target: 10 },
    { title: 'Programación · retos', progress: s.code, target: 5 },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">{saludo}{profile?.name ? `, ${profile.name}` : ''}</h1>
        <p className={`mt-1 text-sm ${streakAtRisk ? 'text-amber-600 dark:text-amber-500 font-semibold' : 'text-stone-500 dark:text-stone-400'}`}>{subtitle}</p>
      </div>

      <DailyGoal />
      <WeeklyQuests />

      {/* Mini-resumen del día */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {resumen.map((r) => (
          <div key={r.label} className="flex items-center gap-2 rounded-xl border border-stone-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] px-3 py-2">
            <span className="text-xl shrink-0">{r.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-stone-400">{r.label}</p>
              <p className={`text-sm font-bold truncate ${r.tone}`}>{r.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Card className="mb-6 relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white border-0 shadow-glow">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] opacity-80">Tu nivel general</p>
            <p className="font-display text-5xl font-extrabold">Nivel {s.level}</p>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="rounded-full bg-white/20 px-2 py-0.5">🔥 {s.streak} días de racha</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5">🏆 {unlocked.length}/{ACHIEVEMENTS.length} logros</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.18em] opacity-80">XP total</p>
            <p className="font-display text-4xl font-extrabold">{s.points}</p>
            <p className="text-[11px] opacity-80 mt-0.5">hoy {s.xpToday}/{s.xpCap} XP</p>
          </div>
        </div>
        <div className="relative mt-4">
          <div className="h-3 rounded-full bg-white/25 overflow-hidden">
            <m.div className="h-full rounded-full bg-white" initial={{ width: 0 }}
              animate={{ width: `${(s.intoLevel / s.xpNeeded) * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
          <p className="mt-1 text-xs opacity-80">{s.intoLevel}/{s.xpNeeded} XP hacia el nivel {s.level + 1} · máx {s.xpCap} XP al día</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Ejercicios" value={`${s.exercises}`} sub="completados" />
        <Stat label="Peso actual" value={s.weightCurrent ? `${s.weightCurrent} kg` : '—'} sub={s.weightDelta > 0 ? `−${s.weightDelta} kg logrados` : s.imcLabel !== '—' ? `IMC ${s.imc} · ${s.imcLabel}` : 'registra en Fitness'} />
        <Stat label="Diario" value={`${s.journal}`} sub={s.journal ? `ánimo medio ${s.moodAvg}/5` : 'sin entradas'} />
        <Stat label="Lectura" value={`${s.pages}`} sub={`${s.booksFinished} libros terminados`} />
      </div>

      {reto && (
        <Link to="/learning" className="block mb-6">
          <Card className="border-brand-500/40 bg-gradient-to-br from-brand-500/10 to-transparent hover:ring-2 hover:ring-brand-500/40 transition">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl text-2xl shrink-0" style={{ background: `${reto.course.color}22` }}>🎯</span>
                <div>
                  <div className="flex items-center gap-2"><h3 className="font-bold">Reto del día</h3><Badge tone="brand">{reto.ex.level}</Badge></div>
                  <p className="text-sm text-stone-600 dark:text-stone-300">{reto.ex.objective}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{reto.course.icon} {reto.course.name} · {reto.level.title}</p>
                </div>
              </div>
              <Badge tone="amber">Resolver →</Badge>
            </div>
          </Card>
        </Link>
      )}

      <Link to="/learning" className="block mb-6">
        <Card className="hover:ring-2 hover:ring-brand-500/40 transition">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/15 text-2xl">📚</span>
              <div>
                <h3 className="font-bold">Ruta de cursos</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">{s.courseExercises} ejercicios hechos · {s.coursesCompleted} cursos completados 🎓</p>
              </div>
            </div>
            <Badge tone={s.coursesCompleted > 0 ? 'green' : 'brand'}>Continuar →</Badge>
          </div>
        </Card>
      </Link>

      {notes.length > 0 && (
        <Card className="mb-6 bg-slate-900 text-white border-0">
          <div className="flex items-center gap-2 mb-2"><span>🧠</span><h3 className="font-bold">Notas del Mentor</h3></div>
          <ul className="space-y-1 text-sm text-slate-200">
            {notes.slice(0, 4).map((n, i) => <li key={i}>• {n}</li>)}
          </ul>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <h3 className="font-bold mb-3">Evolución del peso</h3>
          {weightSeries.length < 2 ? (
            <div className="grid place-items-center h-[220px] text-center">
              <p className="text-sm text-stone-500">Registra tu peso en <b>Fitness</b> para ver tu evolución aquí.</p>
            </div>
          ) : (
            <Suspense fallback={<ChartFallback />}>
              <WeightChart data={weightSeries} />
            </Suspense>
          )}
        </Card>

        <Card>
          <h3 className="font-bold mb-3">Tus estadísticas</h3>
          {s.points === 0 ? (
            <div className="grid place-items-center h-[220px] text-center">
              <p className="text-sm text-stone-500">Completa ejercicios y tus estadísticas crecerán.</p>
            </div>
          ) : (
            <Suspense fallback={<ChartFallback />}>
              <StatsRadar data={radar} />
            </Suspense>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold mb-3">Objetivos de la semana</h3>
          <div className="space-y-3">
            {goals.map((g) => (
              <div key={g.title}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{g.title}</span>
                  <span className="text-stone-500">{Math.min(g.progress, g.target)}/{g.target}</span>
                </div>
                <Progress value={g.progress} max={g.target} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Logros</h3>
            <Link to="/achievements"><Badge tone="brand">{unlocked.length}/{ACHIEVEMENTS.length} · ver todos →</Badge></Link>
          </div>
          {unlocked.length === 0 ? (
            <p className="text-sm text-stone-500">Completa actividades para desbloquear tus primeras insignias.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {unlocked.slice(0, 12).map((a) => (
                <span key={a.id} title={a.title} className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/15 text-2xl">{a.icon}</span>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
