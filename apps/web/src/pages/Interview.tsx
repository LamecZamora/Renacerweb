import { useMemo, useState } from 'react';
import { Card, PageHeader, Badge, Stat } from '../components/ui';
import { useProgress } from '../lib/storage';
import { INTERVIEW_QUESTIONS, INT_CATEGORIES, type IntCategory, type IntQuestion } from '../data/interview';

const CAT_TONE: Record<IntCategory, 'brand' | 'green' | 'amber' | 'slate'> = {
  Behavioral: 'amber', Backend: 'brand', Frontend: 'green', DSA: 'slate', 'System Design': 'brand',
};

export default function Interview() {
  const { done, complete, count } = useProgress('interview');
  const [cat, setCat] = useState<IntCategory | 'Todas'>('Todas');
  const [current, setCurrent] = useState<IntQuestion>(() => INTERVIEW_QUESTIONS[0]);
  const [reveal, setReveal] = useState(false);

  const pool = useMemo(
    () => (cat === 'Todas' ? INTERVIEW_QUESTIONS : INTERVIEW_QUESTIONS.filter((q) => q.category === cat)),
    [cat],
  );

  const next = (fromCat = cat) => {
    const list = fromCat === 'Todas' ? INTERVIEW_QUESTIONS : INTERVIEW_QUESTIONS.filter((q) => q.category === fromCat);
    const candidates = list.filter((q) => q.id !== current.id);
    const pick = (candidates.length ? candidates : list)[Math.floor(Math.random() * (candidates.length ? candidates.length : list.length))];
    setCurrent(pick);
    setReveal(false);
  };

  const pickCat = (c: IntCategory | 'Todas') => { setCat(c); next(c); };
  const showAnswer = () => { setReveal(true); complete(current.id); };

  return (
    <>
      <PageHeader title="Simulador de Entrevista" subtitle="Practica preguntas técnicas y de comportamiento en inglés, con respuesta modelo. 🎤" icon="🎤" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Practicadas" value={`${count}`} sub={`de ${INTERVIEW_QUESTIONS.length} preguntas`} />
        <Stat label="Categoría" value={cat === 'Todas' ? 'Todas' : cat} sub={`${pool.length} preguntas`} />
        <Stat label="Behavioral" value={`${INTERVIEW_QUESTIONS.filter((q) => q.category === 'Behavioral' && done.has(q.id)).length}`} sub="método STAR" />
        <Stat label="Técnicas" value={`${INTERVIEW_QUESTIONS.filter((q) => q.category !== 'Behavioral' && done.has(q.id)).length}`} sub="back/front/DSA/design" />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(['Todas', ...INT_CATEGORIES] as const).map((c) => (
          <button key={c} onClick={() => pickCat(c)}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${cat === c ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
            {c}
          </button>
        ))}
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <Badge tone={CAT_TONE[current.category]}>{current.category}</Badge>
          {done.has(current.id) && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✓ practicada</span>}
        </div>
        <p className="font-display text-xl font-extrabold mb-1">🗣️ {current.q}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">💡 {current.tip}</p>

        {reveal ? (
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">Respuesta modelo (inglés)</p>
            <p className="text-sm text-stone-700 dark:text-stone-200 leading-relaxed">{current.answer}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-stone-300 dark:border-white/15 p-4 text-center">
            <p className="text-sm text-stone-500">Responde en voz alta como si fuera real. Cuando termines, revela la respuesta modelo y compárala.</p>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {!reveal && <button onClick={showAnswer} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-ink-950 hover:opacity-95">Ver respuesta modelo</button>}
          <button onClick={() => next()} className="rounded-xl border border-stone-200 dark:border-white/10 px-4 py-2 text-sm font-semibold hover:border-brand-500">Siguiente pregunta →</button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <Badge tone="brand">Tip</Badge>
          <p className="text-sm text-stone-600 dark:text-stone-300">Graba tu voz y escúchate: mejora tu fluidez y reduce los nervios. Para behavioral, estructura SIEMPRE con <b>STAR</b> (Situation, Task, Action, Result).</p>
        </div>
      </Card>
    </>
  );
}
