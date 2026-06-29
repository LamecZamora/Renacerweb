import { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, PageHeader, Badge, Stat } from '../components/ui';
import { useLocalList, uid } from '../lib/storage';
import { motivate } from '../lib/motivate';

type Entry = {
  id: string;
  date: string;
  mood: number; // 0-4
  feeling: string;
  didToday: string;
  learned: string;
  improve: string;
  gratitude?: string;
  love?: string;
  finances?: string;
  worry?: string;
};

const MOODS = ['😞', '😕', '😐', '🙂', '😄'];
const MOOD_LABEL = ['Difícil', 'Bajo', 'Neutral', 'Bien', 'Genial'];
const MOOD_COLOR = ['#ef4444', '#f59e0b', '#a8a29e', '#22c55e', '#10b981'];

function MoodScale({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {MOODS.map((_, i) => (
        <span
          key={i}
          className="h-2 w-5 rounded-full"
          style={{ background: i <= value ? MOOD_COLOR[value] : 'rgba(120,113,108,0.25)' }}
        />
      ))}
      <span className="ml-1 text-xs font-semibold" style={{ color: MOOD_COLOR[value] }}>{MOOD_LABEL[value]}</span>
    </div>
  );
}

export default function Journal() {
  const { items, add, remove } = useLocalList<Entry>('journal');
  const [mood, setMood] = useState(3);
  const [feeling, setFeeling] = useState('');
  const [didToday, setDidToday] = useState('');
  const [learned, setLearned] = useState('');
  const [improve, setImprove] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [love, setLove] = useState('');
  const [finances, setFinances] = useState('');
  const [worry, setWorry] = useState('');

  const save = () => {
    if (!feeling.trim() && !didToday.trim()) return;
    add({ id: uid(), date: new Date().toISOString(), mood, feeling, didToday, learned, improve, gratitude, love, finances, worry });
    if (mood <= 1) setTimeout(motivate, 400); // si el ánimo viene bajo, un empujón
    setFeeling(''); setDidToday(''); setLearned(''); setImprove(''); setMood(3);
    setGratitude(''); setLove(''); setFinances(''); setWorry('');
  };

  // Serie de ánimo (cronológica) para la gráfica
  const series = [...items].reverse().map((e, i) => ({
    n: i + 1,
    fecha: new Date(e.date).toLocaleDateString('es', { day: '2-digit', month: 'short' }),
    animo: e.mood + 1, // 1-5
  }));
  const avg = items.length ? (items.reduce((s, e) => s + e.mood + 1, 0) / items.length).toFixed(1) : '—';

  return (
    <>
      <PageHeader title="Diario personal" subtitle="Registra cómo va tu día y observa tu ánimo en el tiempo." icon="✶" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Entradas" value={`${items.length}`} />
        <Stat label="Ánimo medio" value={`${avg}/5`} sub="de tus entradas" />
        <Stat label="Última" value={items[0] ? MOOD_LABEL[items[0].mood] : '—'} />
        <Stat label="Mejor racha" value={items.length ? `${items.length} días` : '0'} sub="sigue escribiendo" />
      </div>

      {/* Gráfica de evolución del ánimo */}
      <Card className="mb-6">
        <h3 className="font-bold mb-3">Tu ánimo en el tiempo</h3>
        {series.length < 2 ? (
          <div className="grid place-items-center h-[200px] text-center">
            <p className="text-sm text-stone-500">Escribe al menos 2 entradas para ver tu gráfica de ánimo.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a8a29e33" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} stroke="#a8a29e" />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} stroke="#a8a29e" />
              <Tooltip formatter={(v: number) => [MOOD_LABEL[(v as number) - 1], 'Ánimo']} />
              <Line type="monotone" dataKey="animo" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold mb-3">Nueva entrada</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">¿Cómo te sientes hoy?</p>
          <div className="flex gap-2 mb-2">
            {MOODS.map((m, i) => (
              <button
                key={i}
                onClick={() => setMood(i)}
                className={`grid place-items-center h-11 w-11 rounded-xl text-2xl transition ${
                  mood === i ? 'bg-brand-500/20 ring-2 ring-brand-500 scale-110' : 'bg-stone-200/50 dark:bg-white/5 hover:scale-105'
                }`}
                title={MOOD_LABEL[i]}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mb-4"><MoodScale value={mood} /></div>

          {[
            ['😊 Cómo me siento', feeling, setFeeling] as const,
            ['📋 Qué hice hoy', didToday, setDidToday] as const,
            ['💡 Qué aprendí', learned, setLearned] as const,
            ['🎯 Qué quiero mejorar a futuro', improve, setImprove] as const,
            ['💛 Qué agradezco hoy', gratitude, setGratitude] as const,
            ['❤️ Cómo me siento con mis relaciones / amor', love, setLove] as const,
            ['💰 Cómo me siento con mis finanzas', finances, setFinances] as const,
            ['😟 Qué me preocupa o me estresa', worry, setWorry] as const,
          ].map(([label, val, setter]) => (
            <label key={label} className="block text-sm mb-3">
              <span className="text-stone-500 dark:text-stone-400 text-xs">{label}</span>
              <textarea
                value={val}
                onChange={(e) => setter(e.target.value)}
                className="mt-1 w-full h-16 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </label>
          ))}
          <button onClick={save} className="w-full rounded-xl bg-brand-600 py-2 text-sm font-semibold text-ink-950 hover:opacity-95">
            Guardar entrada
          </button>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Tu historial</h3>
            <Badge tone="brand">{items.length} entradas</Badge>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-stone-500">Aún no escribes nada. Empieza con tu primera entrada de hoy.</p>
          ) : (
            <div className="space-y-3 max-h-[560px] overflow-auto pr-1">
              {items.map((e) => (
                <motion.div key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-stone-200/70 dark:border-white/10 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{MOODS[e.mood]}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400">{new Date(e.date).toLocaleDateString('es')}</span>
                      <button onClick={() => remove(e.id)} className="text-xs text-stone-400 hover:text-red-500">✕</button>
                    </div>
                  </div>
                  <MoodScale value={e.mood} />
                  {e.feeling && <p className="text-sm mt-2">{e.feeling}</p>}
                  {e.didToday && <p className="text-xs text-stone-500 dark:text-stone-400 mt-1"><b>Hice:</b> {e.didToday}</p>}
                  {e.learned && <p className="text-xs text-stone-500 dark:text-stone-400"><b>Aprendí:</b> {e.learned}</p>}
                  {e.gratitude && <p className="text-xs text-stone-500 dark:text-stone-400"><b>💛 Agradezco:</b> {e.gratitude}</p>}
                  {e.love && <p className="text-xs text-stone-500 dark:text-stone-400"><b>❤️ Relaciones:</b> {e.love}</p>}
                  {e.finances && <p className="text-xs text-stone-500 dark:text-stone-400"><b>💰 Finanzas:</b> {e.finances}</p>}
                  {e.worry && <p className="text-xs text-stone-500 dark:text-stone-400"><b>😟 Me preocupa:</b> {e.worry}</p>}
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
