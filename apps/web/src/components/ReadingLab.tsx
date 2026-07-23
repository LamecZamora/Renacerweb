import { useState } from 'react';
import { Card, Badge } from './ui';
import ListenButton from './ListenButton';
import { useProgress } from '../lib/storage';
import { toast } from '../lib/toast';
import { motivate } from '../lib/motivate';
import { READINGS } from '../data/reading';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function ReadingLab() {
  const { isDone, complete } = useProgress('english');
  const [level, setLevel] = useState('A1');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  const passage = READINGS.find((r) => r.level === level)!;
  const done = isDone(passage.id);
  const correct = passage.questions.filter((q, i) => answers[i] === q.answer).length;
  const pct = Math.round((correct / passage.questions.length) * 100);

  const pick = (lv: string) => { setLevel(lv); setAnswers({}); setChecked(false); };
  const grade = () => {
    setChecked(true);
    if (pct >= 80) { if (!done) complete(passage.id); toast('📖 ¡Buena comprensión lectora!'); } else motivate();
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2"><span>📖</span><h3 className="font-bold">Reading · lee y escucha</h3></div>
        <div className="flex gap-1.5 flex-wrap">
          {LEVELS.map((lv) => {
            const passed = isDone(READINGS.find((r) => r.level === lv)!.id);
            return (
              <button key={lv} onClick={() => pick(lv)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${level === lv ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
                {lv} {passed ? '✓' : ''}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Lee el texto, escúchalo en inglés y responde. 80% para aprobar la lectura.</p>

      <div className="rounded-xl border-l-2 border-brand-500/50 bg-brand-500/5 p-4 mb-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <b className="text-sm">{passage.title}</b>
          <ListenButton text={passage.text} lang="en-US" label="🔊 Escuchar" />
        </div>
        <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-200">{passage.text}</p>
      </div>

      <div className="space-y-3">
        {passage.questions.map((q, qi) => (
          <div key={qi}>
            <p className="text-sm font-medium mb-1">{qi + 1}. {q.q}</p>
            <div className="grid sm:grid-cols-2 gap-1.5">
              {q.options.map((opt, oi) => {
                const picked = answers[qi] === oi;
                const state = checked && (oi === q.answer ? 'good' : picked ? 'bad' : '');
                return (
                  <button key={oi} disabled={checked} onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={`text-left rounded-lg border px-3 py-1.5 text-sm transition ${
                      state === 'good' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : state === 'bad' ? 'border-red-500 bg-red-500/10 text-red-500'
                        : picked ? 'border-brand-500 bg-brand-500/10' : 'border-stone-200 dark:border-white/10 hover:border-brand-400'
                    }`}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!checked ? (
        <button onClick={grade} disabled={Object.keys(answers).length < passage.questions.length}
          className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 disabled:opacity-50">Calificar lectura</button>
      ) : (
        <div className={`mt-4 flex items-center justify-between rounded-xl border p-3 ${pct >= 80 ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-amber-500/40 bg-amber-500/5'}`}>
          <span className="text-sm font-semibold">{correct}/{passage.questions.length} correctas · {pct}%</span>
          {pct >= 80 ? <Badge tone="green">✓ Aprobada</Badge> : <button onClick={() => { setAnswers({}); setChecked(false); }} className="text-sm font-semibold text-brand-600 dark:text-brand-400">Reintentar</button>}
        </div>
      )}
    </Card>
  );
}
