import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, Stat, PageHeader, Badge, Progress } from '../components/ui';
import { useProgress, useLocalList, uid, getProfile } from '../lib/storage';
import { computeStats } from '../lib/stats';
import { type DayPlan } from '../data/fitness';
import { phaseForBMI } from '../data/fitnessPlan';

type Metric = { id: string; date: string; weight?: number; waist?: number; bodyFat?: number; sleep?: number; water?: number };

const TIPS: { icon: string; title: string; tips: string[] }[] = [
  { icon: '💧', title: 'Agua', tips: ['Toma ~35 ml por kg de peso al día.', 'Bebe un vaso al despertar para activarte.', 'Lleva una botella y rellénala 3-4 veces.'] },
  { icon: '🍽️', title: 'Comidas', tips: ['Prioriza proteína en cada comida (huevo, pollo, atún, legumbres).', 'Llena medio plato de verduras.', 'Evita ultraprocesados y bebidas azucaradas.', 'Come despacio: la saciedad tarda ~20 min.'] },
  { icon: '🏋️', title: 'Ejercicio', tips: ['Calienta 5-10 min antes de entrenar.', 'Sube el peso poco a poco (sobrecarga progresiva).', 'Descansa 48 h cada grupo muscular.', 'Camina 8-10k pasos los días de descanso.'] },
  { icon: '🧘', title: 'Relajación', tips: ['Respira 4-7-8: inhala 4s, retén 7s, exhala 8s.', 'Estira 5 min antes de dormir.', 'Apaga pantallas 30 min antes de acostarte.', 'Duerme 7-8 h: el músculo crece descansando.'] },
  { icon: '🔥', title: 'Motivación', tips: ['Hazlo por sistema, no por ganas: agenda la hora.', 'Registra cada avance, por pequeño que sea.', 'No busques perfección, busca constancia.', 'Recuerda tu "por qué" cada mañana.'] },
  { icon: '✅', title: 'Hábitos', tips: ['Empieza con 1 hábito a la vez.', 'Encadena: después de X, hago Y.', 'No rompas la cadena dos días seguidos.', 'Celebra completar tu rutina del día.'] },
];

type FitGoal = { id: string; label: string; icon: string; focus: string; frequency: string; training: string[]; nutrition: string[] };
const FIT_GOALS: FitGoal[] = [
  { id: 'perder', label: 'Perder grasa', icon: '🔥', focus: 'Déficit calórico sostenible + mucho movimiento diario.', frequency: '3-4 días de fuerza + caminar 8-10k pasos',
    training: ['Full-body o torso/pierna (compuestos)', '2-3 series por ejercicio, ritmo constante', 'Añade 15-20 min de cardio al final', 'Sube los pasos en días de descanso'],
    nutrition: ['Déficit moderado (~300-500 kcal)', 'Proteína alta para no perder músculo (~1.8 g/kg)', 'Verduras a volumen, reduce azúcar y ultraprocesados', 'Hidrátate: a veces el hambre es sed'] },
  { id: 'musculo', label: 'Ganar músculo', icon: '💪', focus: 'Superávit ligero + sobrecarga progresiva.', frequency: '4-5 días, split por grupos musculares',
    training: ['Push / Pull / Legs o torso-pierna', '3-4 series, 6-12 repeticiones', 'Sube peso o reps cada semana', 'Descansa 48 h cada grupo muscular'],
    nutrition: ['Superávit ligero (~200-300 kcal)', 'Proteína 1.6-2 g/kg al día', 'Carbohidratos alrededor del entreno', 'Duerme 7-8 h: el músculo crece descansando'] },
  { id: 'fuerza', label: 'Ganar fuerza', icon: '🏋️', focus: 'Básicos pesados con técnica impecable.', frequency: '3-4 días enfocados en los grandes levantamientos',
    training: ['Sentadilla, peso muerto, press banca, press militar', '4-5 series de 3-6 repeticiones', 'Descansos largos (2-4 min)', 'Progresa el peso poco a poco, cuida la técnica'],
    nutrition: ['Mantenimiento o ligero superávit', 'Proteína suficiente (~1.6 g/kg)', 'Come bien antes de entrenar', 'Prioriza recuperación y sueño'] },
  { id: 'salud', label: 'Salud y energía', icon: '🌿', focus: 'Constancia, movilidad y bienestar general.', frequency: '3 días mixtos + caminatas',
    training: ['Circuito full-body moderado', 'Movilidad y estiramientos', 'Caminar a diario', 'Algo de cardio que disfrutes'],
    nutrition: ['Come comida real, mayormente sin procesar', 'Proteína y verduras en cada comida', 'Hidratación constante', 'Rutina de sueño estable'] },
];
const FITGOAL_KEY = 'renacer_fitgoal';

function GoalGuide() {
  const [goalId, setGoalId] = useState<string>(() => localStorage.getItem(FITGOAL_KEY) || 'perder');
  const pick = (id: string) => { setGoalId(id); localStorage.setItem(FITGOAL_KEY, id); };
  const goal = FIT_GOALS.find((g) => g.id === goalId) ?? FIT_GOALS[0];
  return (
    <Card className="mb-6 border-brand-500/30">
      <div className="flex items-center gap-2 mb-3"><span>🎯</span><h3 className="font-bold">Rutina guiada por objetivo</h3></div>
      <div className="flex flex-wrap gap-2 mb-4">
        {FIT_GOALS.map((g) => (
          <button key={g.id} onClick={() => pick(g.id)}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${goalId === g.id ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
            {g.icon} {g.label}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-brand-500/5 border border-brand-500/20 p-3 mb-3">
        <p className="text-sm font-semibold">{goal.icon} {goal.focus}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">📅 Frecuencia: {goal.frequency}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400 mb-1">🏋️ Entrenamiento</p>
          <ul className="space-y-1 text-sm text-stone-600 dark:text-stone-300">{goal.training.map((t, i) => <li key={i}>• {t}</li>)}</ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">🍽️ Nutrición</p>
          <ul className="space-y-1 text-sm text-stone-600 dark:text-stone-300">{goal.nutrition.map((t, i) => <li key={i}>• {t}</li>)}</ul>
        </div>
      </div>
    </Card>
  );
}

function DayCard({ plan, today, isDone, toggle }: { plan: DayPlan; today: boolean; isDone: (id: string) => boolean; toggle: (id: string) => void }) {
  const doneCount = plan.exercises.filter((e) => isDone(e.id)).length;
  const allDone = doneCount === plan.exercises.length;
  return (
    <Card className={today ? 'ring-2 ring-brand-500' : ''}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{plan.icon}</span>
          <div>
            <h3 className="font-bold leading-tight">{plan.day} {today && <span className="text-brand-500 text-xs">· HOY</span>}</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">{plan.focus}</p>
          </div>
        </div>
        <Badge tone={allDone ? 'green' : 'amber'}>{doneCount}/{plan.exercises.length}</Badge>
      </div>
      <Progress value={doneCount} max={plan.exercises.length} className="mb-3" />
      <ul className="space-y-1.5">
        {plan.exercises.map((ex) => {
          const done = isDone(ex.id);
          return (
            <li key={ex.id}>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={done} onChange={() => toggle(ex.id)} className="accent-brand-600 h-4 w-4" />
                <span className={`flex-1 ${done ? 'line-through text-stone-400' : ''}`}>{ex.name}</span>
                <span className="text-xs text-stone-400">{ex.detail}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export default function Fitness() {
  const todayKey = new Date().getDay();
  const { isDone, toggle } = useProgress('fitness');
  const { items: metrics, add } = useLocalList<Metric>('metrics');
  const profile = getProfile();
  const stats = computeStats();

  const [form, setForm] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const saveMetric = () => {
    const num = (k: string) => (form[k] ? Number(form[k]) : undefined);
    if (!form.weight && !form.waist && !form.bodyFat) return;
    add({ id: uid(), date: new Date().toISOString(), weight: num('weight'), waist: num('waist'), bodyFat: num('bodyFat'), sleep: num('sleep'), water: num('water') });
    setForm({});
  };

  const weightSeries = [...metrics]
    .filter((m) => m.weight)
    .reverse()
    .map((m) => ({ date: new Date(m.date).toLocaleDateString('es', { day: '2-digit', month: 'short' }), weight: m.weight, bodyFat: m.bodyFat }));
  const currentWeight = metrics.find((m) => m.weight)?.weight ?? profile?.startWeight;

  // Rutina automática según tu IMC (cambia de fase conforme bajas de peso).
  const phase = phaseForBMI(stats.imc);
  const phaseExercises = phase.days.flatMap((d) => d.exercises);
  const phaseTotal = phaseExercises.length;
  const phaseDone = phaseExercises.filter((e) => isDone(e.id)).length;
  const ordered = [...phase.days].sort((a, b) => (a.key === todayKey ? -1 : b.key === todayKey ? 1 : 0));

  const FIELDS: [string, string][] = [
    ['weight', 'Peso (kg)'], ['waist', 'Cintura (cm)'], ['bodyFat', '% Grasa'], ['sleep', 'Sueño (h)'], ['water', 'Agua (ml)'],
  ];

  return (
    <>
      <PageHeader title="Fitness" subtitle="Tu rutina se ajusta sola a tu IMC y evoluciona conforme bajas de peso." icon="🏋" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Ejercicios hechos" value={`${phaseDone}`} sub={`de ${phaseTotal} en tu fase`} />
        <Stat label="Peso actual" value={currentWeight ? `${currentWeight} kg` : '—'} sub={stats.weightDelta > 0 ? `−${stats.weightDelta} kg logrados` : 'regístralo abajo'} />
        <Stat label="IMC" value={stats.imc ? `${stats.imc}` : '—'} sub={stats.imc ? stats.imcLabel : 'añade tu altura'} />
        <Stat label="Día de hoy" value={phase.days.find((d) => d.key === todayKey)?.day ?? '—'} />
      </div>

      {/* Rutina automática por fase (IMC) */}
      <Card className="mb-6 border-l-4" style={{ borderLeftColor: phase.color }}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <h3 className="font-bold">🤖 Tu rutina automática · <span style={{ color: phase.color }}>{phase.name}</span></h3>
          <Badge tone="brand">{phase.range}</Badge>
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-300">{phase.focus}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">📅 {phase.frequency}</p>
        {!stats.imc && <p className="mt-2 text-xs text-amber-600">Registra tu peso abajo (y tu altura en Ajustes/Onboarding) para personalizar tu fase.</p>}
        <div className="mt-3 grid sm:grid-cols-2 gap-1.5">
          {phase.tips.map((t, i) => <p key={i} className="text-xs text-stone-600 dark:text-stone-300">• {t}</p>)}
        </div>
        <p className="mt-3 text-[11px] text-stone-400">💡 Conforme bajes de peso y tu IMC mejore, la app te cambia sola a la siguiente fase con ejercicios distintos. No te estancas.</p>
      </Card>

      <GoalGuide />

      <h3 className="font-display text-lg font-bold mb-3">Tu rutina de la semana</h3>
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        {ordered.map((plan) => (
          <DayCard key={plan.key} plan={plan} today={plan.key === todayKey} isDone={isDone} toggle={toggle} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold mb-3">Evolución del peso</h3>
          {weightSeries.length < 2 ? (
            <p className="text-sm text-stone-500">Registra tu peso al menos 2 veces para ver tu evolución.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#a8a29e33" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a8a29e" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11 }} stroke="#a8a29e" />
                <Tooltip />
                <Line type="monotone" dataKey="weight" name="Peso" stroke="#d97706" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="font-bold mb-3">Registrar métricas de hoy</h3>
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map(([key, label]) => (
              <label key={key} className="text-sm">
                <span className="text-stone-500 dark:text-stone-400 text-xs">{label}</span>
                <input value={form[key] ?? ''} onChange={(e) => set(key, e.target.value)} type="number"
                  className="mt-1 w-full rounded-lg border border-stone-200 dark:border-white/10 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </label>
            ))}
          </div>
          <button onClick={saveMetric} className="mt-4 w-full rounded-xl bg-brand-600 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">
            Guardar registro
          </button>
        </Card>
      </div>

      {/* Tips para mejorar hábitos */}
      <h3 className="font-display text-lg font-bold mt-8 mb-3">Tips para tu progreso</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TIPS.map((cat) => (
          <Card key={cat.title}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{cat.icon}</span>
              <h4 className="font-bold">{cat.title}</h4>
            </div>
            <ul className="space-y-1.5">
              {cat.tips.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-stone-600 dark:text-stone-300">
                  <span className="text-brand-500">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
