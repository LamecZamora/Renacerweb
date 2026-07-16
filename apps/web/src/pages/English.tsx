import { useState } from 'react';
import { Card, PageHeader, Progress, Badge } from '../components/ui';
import { useProgress, markActive } from '../lib/storage';
import { useSpeechRecognition, matchScore } from '../lib/speech';
import { WRITING_PROMPTS } from '../data/writing';
import ConsejoCard from '../components/ConsejoCard';
import { ENGLISH_TIPS } from '../data/tips';
import Flashcards from '../components/Flashcards';
import Immersion from '../components/Immersion';
import ListenButton from '../components/ListenButton';
import { toast } from '../lib/toast';
import { motivate } from '../lib/motivate';
import {
  ENGLISH_LESSONS, ENGLISH_TOTAL, ENGLISH_LEVELS, LESSON_THEORY,
  SPEAKING, SPEAKING_TOTAL, ENGLISH_EXAMS, SPELLING_WORDS, LISTENING, type Quiz, type Speak, type EngExam,
} from '../data/english';

const PASS = 90;

function EnglishExam({ exam, passed, onPass }: { exam: EngExam; passed: boolean; onPass: () => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = exam.questions.filter((q) => answers[q.id] === q.answer).length;
  const pct = Math.round((score / exam.questions.length) * 100);
  const aprueba = pct >= exam.pass;

  if (passed) {
    return (
      <Card className="ring-1 ring-emerald-500/40">
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">✅ Examen del nivel aprobado</p>
      </Card>
    );
  }
  return (
    <Card className="border-brand-500/30 bg-brand-500/5">
      <h3 className="font-bold mb-1">📝 Examen del nivel <span className="text-xs font-normal text-stone-500">(difícil · necesitas {exam.pass}%)</span></h3>
      <div className="space-y-3 mt-2">
        {exam.questions.map((q, qi) => (
          <div key={q.id}>
            <p className="text-sm font-medium">{qi + 1}. {q.q}</p>
            <div className="mt-1 grid sm:grid-cols-2 gap-1.5">
              {q.options.map((opt, i) => {
                const picked = answers[q.id] === i;
                const showState = submitted && (i === q.answer ? 'good' : picked ? 'bad' : '');
                return (
                  <button key={i} disabled={submitted} onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    className={`text-left rounded-lg border px-3 py-1.5 text-sm transition ${
                      showState === 'good' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : showState === 'bad' ? 'border-red-500 bg-red-500/10 text-red-500'
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
      {!submitted ? (
        <button onClick={() => { setSubmitted(true); if (pct >= exam.pass) onPass(); else motivate(); }} disabled={Object.keys(answers).length < exam.questions.length}
          className="mt-3 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95 disabled:opacity-40">Entregar examen</button>
      ) : (
        <div className="mt-3">
          <p className={`text-sm font-bold ${aprueba ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            {aprueba ? `✅ ¡Aprobado! ${pct}%` : `❌ ${pct}% — necesitas ${exam.pass}%. Repasa y reintenta.`}
          </p>
          {!aprueba && <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="mt-2 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-ink-950">Reintentar</button>}
        </div>
      )}
    </Card>
  );
}

function Spelling() {
  const [i, setI] = useState(() => Math.floor(Math.random() * SPELLING_WORDS.length));
  const [val, setVal] = useState('');
  const [result, setResult] = useState<'idle' | 'good' | 'bad'>('idle');
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const word = SPELLING_WORDS[i];
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const say = () => {
    if (!supported) return;
    const u = new SpeechSynthesisUtterance(word.word);
    u.lang = 'en-US'; u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };
  const check = () => {
    const ok = val.trim().toLowerCase() === word.word.toLowerCase();
    setResult(ok ? 'good' : 'bad');
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
  };
  const next = () => { setI(Math.floor(Math.random() * SPELLING_WORDS.length)); setVal(''); setResult('idle'); };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2"><span>🔤</span><h3 className="font-bold">Deletreo (Spelling)</h3></div>
        <Badge tone="brand">{score.ok}/{score.total} aciertos</Badge>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Escucha la palabra y escríbela. Pista: <b>{word.hint}</b>.</p>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button onClick={say} disabled={!supported} className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-ink-950 hover:opacity-95 disabled:opacity-40">🔊 Escuchar</button>
        {!supported && <span className="text-xs text-stone-400">Tu navegador no soporta audio (usa Chrome).</span>}
      </div>
      <div className="flex gap-2">
        <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (result === 'idle' ? check() : next())}
          spellCheck={false} autoCapitalize="off" placeholder="Escribe lo que escuchaste…"
          className={`flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 ${result === 'good' ? 'border-emerald-500 focus:ring-emerald-500' : result === 'bad' ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 dark:border-white/10 focus:ring-brand-500'}`} />
        {result === 'idle'
          ? <button onClick={check} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950">Comprobar</button>
          : <button onClick={next} className="rounded-lg border border-stone-200 dark:border-white/10 px-4 py-2 text-sm font-semibold">Siguiente →</button>}
      </div>
      {result === 'good' && <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">✅ ¡Correcto! «{word.word}»</p>}
      {result === 'bad' && <p className="mt-2 text-sm font-semibold text-red-500">❌ Se escribe «{word.word}». ¡Inténtalo en la siguiente!</p>}
    </Card>
  );
}

function QuizItem({ quiz, done, onCorrect }: { quiz: Quiz; done: boolean; onCorrect: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  return (
    <div className="rounded-xl border border-stone-200/70 dark:border-white/10 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">{quiz.q}</p>
        {done && <Badge tone="green">✓</Badge>}
      </div>
      <div className="mt-2 grid sm:grid-cols-2 gap-2">
        {quiz.options.map((opt, i) => {
          const isCorrect = i === quiz.answer;
          const state = !answered ? 'idle'
            : i === picked && isCorrect ? 'good'
            : i === picked && !isCorrect ? 'bad'
            : isCorrect ? 'reveal' : 'idle';
          const cls = {
            idle: 'border-stone-200 dark:border-white/10 hover:border-brand-400',
            good: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            bad: 'border-red-500 bg-red-500/10 text-red-500',
            reveal: 'border-emerald-500/50 bg-emerald-500/5',
          }[state];
          return (
            <button key={i} disabled={answered}
              onClick={() => { setPicked(i); if (isCorrect) onCorrect(); }}
              className={`text-left rounded-lg border px-3 py-1.5 text-sm transition disabled:cursor-default ${cls}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
          {picked === quiz.answer ? '✅ ¡Correcto! ' : '❌ Incorrecto. '} {quiz.explain}
        </p>
      )}
    </div>
  );
}

function SpeakItem({ item, done, onPass }: { item: Speak; done: boolean; onPass: () => void }) {
  const { supported, listening, listen } = useSpeechRecognition('en-US');
  const [heard, setHeard] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const tryIt = () => {
    setHeard(null); setScore(null);
    listen((alts) => {
      const best = Math.max(...alts.map((a) => matchScore(a, item.phrase)));
      setHeard(alts[0]);
      setScore(best);
      if (best >= 0.8) onPass();
    });
  };

  return (
    <div className="rounded-xl border border-stone-200/70 dark:border-white/10 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">🗣 “{item.phrase}”</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">{item.es}</p>
        </div>
        {done && <Badge tone="green">✓</Badge>}
      </div>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <button
          onClick={tryIt}
          disabled={!supported}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-950 transition ${
            listening ? 'bg-red-500 animate-pulse text-white' : 'bg-brand-600 hover:opacity-95'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {listening ? '🎙 Escuchando…' : '🎙 Pronunciar'}
        </button>
        {!supported && <span className="text-xs text-stone-400">Tu navegador no soporta micrófono (usa Chrome).</span>}
        {score !== null && (
          <span className={`text-xs font-semibold ${score >= 0.8 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
            {score >= 0.8 ? '✅ ¡Bien pronunciado!' : `Casi (${Math.round(score * 100)}%) · intenta de nuevo`}
          </span>
        )}
      </div>
      {heard && <p className="mt-1 text-xs text-stone-400">Escuché: “{heard}”</p>}
    </div>
  );
}

function WritingPractice() {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const prompt = WRITING_PROMPTS[i];
  const results = prompt.checks.map((c) => ({ label: c.label, ok: c.ok(text) }));
  const passedN = results.filter((r) => r.ok).length;
  const allOk = checked && passedN === results.length;

  const review = () => {
    if (!text.trim()) return;
    setChecked(true);
    markActive();
    if (results.every((r) => r.ok)) toast('✍️ ¡Bien escrito! Buen inglés.');
    else motivate();
  };
  const next = () => { setI((p) => (p + 1) % WRITING_PROMPTS.length); setText(''); setChecked(false); setShowExample(false); };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2"><span>✍️</span><h3 className="font-bold">Escribe en inglés</h3></div>
        <ListenButton text={prompt.prompt} lang="en-US" label="Oír consigna" />
      </div>
      <p className="text-sm font-semibold mb-1">{prompt.prompt}</p>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">💡 {prompt.hint}</p>
      <textarea value={text} onChange={(e) => { setText(e.target.value); setChecked(false); }}
        placeholder="Type your answer in English…" spellCheck={false}
        className="w-full h-24 rounded-lg border border-stone-200 dark:border-white/10 bg-transparent p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
      <div className="mt-2 flex flex-wrap gap-2">
        <button onClick={review} disabled={!text.trim()} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-ink-950 hover:opacity-95 disabled:opacity-40">Revisar</button>
        <button onClick={() => setShowExample((s) => !s)} className="rounded-xl border border-stone-200 dark:border-white/10 px-3 py-2 text-sm font-semibold">{showExample ? 'Ocultar ejemplo' : 'Ver ejemplo'}</button>
        <button onClick={next} className="rounded-xl border border-stone-200 dark:border-white/10 px-3 py-2 text-sm font-semibold">Otro reto →</button>
      </div>

      {showExample && <p className="mt-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2.5 text-xs text-stone-600 dark:text-stone-300 italic">Ejemplo: “{prompt.example}”</p>}

      {checked && (
        <div className="mt-3 rounded-xl border border-stone-200/70 dark:border-white/10 p-3">
          <p className={`text-sm font-bold mb-1.5 ${allOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
            {allOk ? '✅ ¡Muy bien! Cumpliste todo.' : `Vas ${passedN}/${results.length}. Corrige los ✗ e inténtalo.`}
          </p>
          <ul className="space-y-1">
            {results.map((r, k) => (
              <li key={k} className={`text-xs flex items-center gap-1.5 ${r.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`}>
                <span>{r.ok ? '✓' : '✗'}</span> {r.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-2 text-[11px] text-stone-400">Revisión automática básica (estructura, longitud, que esté en inglés). No reemplaza a un profe, pero te guía a escribir mejor. 💪</p>
    </Card>
  );
}

function Listening() {
  const [i, setI] = useState(() => Math.floor(Math.random() * LISTENING.length));
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const item = LISTENING[i];
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const answered = picked !== null;

  const play = () => {
    if (!supported) return;
    const u = new SpeechSynthesisUtterance(item.text);
    u.lang = 'en-US'; u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };
  const choose = (k: number) => {
    if (answered) return;
    setPicked(k); markActive();
    const ok = k === item.answer;
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
    if (ok) toast('🎧 ¡Correcto! Buen oído.'); else motivate();
  };
  const next = () => { setI(Math.floor(Math.random() * LISTENING.length)); setPicked(null); };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2"><span>🎧</span><h3 className="font-bold">Listening · escucha y responde</h3></div>
        <Badge tone="brand">{score.ok}/{score.total} aciertos</Badge>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Toca ▶ para escuchar el audio en inglés (las veces que quieras) y responde la pregunta. <Badge tone="slate">{item.level}</Badge></p>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button onClick={play} disabled={!supported} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-ink-950 hover:opacity-95 disabled:opacity-40">▶ Reproducir audio</button>
        {!supported && <span className="text-xs text-stone-400">Tu navegador no soporta audio (usa Chrome).</span>}
      </div>
      <p className="text-sm font-semibold mb-2">{item.q}</p>
      <div className="grid sm:grid-cols-2 gap-1.5">
        {item.options.map((opt, k) => {
          const state = !answered ? 'idle' : k === item.answer ? 'good' : k === picked ? 'bad' : 'idle';
          const cls = { idle: 'border-stone-200 dark:border-white/10 hover:border-brand-400', good: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', bad: 'border-red-500 bg-red-500/10 text-red-500' }[state];
          return <button key={k} disabled={answered} onClick={() => choose(k)} className={`text-left rounded-lg border px-3 py-1.5 text-sm transition ${cls}`}>{opt}</button>;
        })}
      </div>
      {answered && (
        <div className="mt-3">
          <p className="text-xs text-stone-500 dark:text-stone-400 rounded-lg bg-stone-200/40 dark:bg-white/5 p-2">📝 El audio decía: “{item.text}”</p>
          <button onClick={next} className="mt-2 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-ink-950">Otro audio →</button>
        </div>
      )}
    </Card>
  );
}

export default function English() {
  const { isDone, complete, count } = useProgress('english');

  const stats = ENGLISH_LEVELS.map((lv) => {
    const ids = [
      ...ENGLISH_LESSONS.filter((l) => l.level === lv).flatMap((l) => l.quizzes.map((q) => q.id)),
      ...SPEAKING.filter((s) => s.level === lv).map((s) => s.id),
    ];
    const done = ids.filter((id) => isDone(id)).length;
    const total = ids.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const hasExam = !!ENGLISH_EXAMS[lv];
    const examOk = isDone(`exam:${lv}`);
    // Se avanza APROBANDO EL EXAMEN del nivel (≥80%). Si el nivel no tiene examen, por % de ejercicios.
    const approved = hasExam ? examOk : pct >= PASS;
    return { lv, total, done, pct, approved, hasExam, examOk };
  });
  const isUnlocked = (i: number) => i === 0 || stats[i - 1].approved;

  const firstOpen = ENGLISH_LEVELS[stats.findIndex((s, i) => isUnlocked(i) && !s.approved)] ?? 'A1';
  const [openLevel, setOpenLevel] = useState(firstOpen);
  const current = stats.find((s) => s.lv === openLevel)!;
  const speakOfLevel = SPEAKING.filter((s) => s.level === openLevel);
  const grandTotal = ENGLISH_TOTAL + SPEAKING_TOTAL + Object.keys(ENGLISH_EXAMS).length;
  const levelExam = ENGLISH_EXAMS[openLevel];

  return (
    <>
      <PageHeader title="Academia de Inglés" subtitle="Teoría, ejercicios y pronunciación con micrófono. 90% para subir de nivel." icon="🗣" />

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">Tu progreso total</h3>
          <Badge tone="brand">{count} / {grandTotal}</Badge>
        </div>
        <Progress value={count} max={grandTotal} />
      </Card>

      <ConsejoCard tips={ENGLISH_TIPS} title="Consejo para aprender inglés" />

      <Flashcards />
      <Immersion />
      <Spelling />
      <Listening />
      <WritingPractice />

      <div className="flex gap-2 flex-wrap mb-4">
        {ENGLISH_LEVELS.map((lv, i) => {
          const s = stats[i];
          const locked = !isUnlocked(i);
          return (
            <button key={lv} disabled={locked} onClick={() => setOpenLevel(lv)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                openLevel === lv ? 'bg-brand-600 text-ink-950'
                  : locked ? 'bg-stone-200/40 dark:bg-white/5 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'
              }`}
              title={locked ? 'Aprueba el nivel anterior con 90%' : ''}>
              {lv} {s.approved ? '✓' : locked ? '🔒' : ''}
            </button>
          );
        })}
      </div>

      <Card className={`mb-5 ${current.approved ? 'ring-1 ring-emerald-500/40' : ''}`}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h3 className="font-bold">Nivel {openLevel} — aprobación {current.pct}%</h3>
          {current.approved
            ? <Badge tone="green">✓ Aprobado · siguiente desbloqueado</Badge>
            : current.hasExam
              ? <Badge tone="amber">Aprueba el examen del nivel para avanzar</Badge>
              : <Badge tone="amber">Necesitas {PASS}% para avanzar</Badge>}
        </div>
        <div className="relative">
          <Progress value={current.pct} max={100} />
          <div className="absolute top-0 h-2 border-r-2 border-emerald-500/70" style={{ left: `${PASS}%` }} />
        </div>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{current.done}/{current.total} completados (ejercicios + pronunciación)</p>
      </Card>

      <div className="space-y-4">
        {ENGLISH_LESSONS.filter((l) => l.level === openLevel).map((lesson) => {
          const doneCount = lesson.quizzes.filter((q) => isDone(q.id)).length;
          const theory = LESSON_THEORY[lesson.id];
          return (
            <Card key={lesson.id}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold">{lesson.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{lesson.area}</p>
                </div>
                <Badge tone={doneCount === lesson.quizzes.length ? 'green' : 'amber'}>{doneCount}/{lesson.quizzes.length}</Badge>
              </div>
              {theory && (
                <div className="mb-3 rounded-lg bg-brand-500/10 border border-brand-500/20 p-3 text-xs text-stone-600 dark:text-stone-300">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <b className="text-brand-700 dark:text-brand-400">📖 Lee · 🔊 Escucha · ✏️ Hazlo</b>
                    <ListenButton text={theory} lang="es-MX" label="Escuchar" />
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{theory}</p>
                </div>
              )}
              <div className="space-y-2">
                {lesson.quizzes.map((quiz) => (
                  <QuizItem key={quiz.id} quiz={quiz} done={isDone(quiz.id)} onCorrect={() => complete(quiz.id)} />
                ))}
              </div>
            </Card>
          );
        })}

        {speakOfLevel.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold">🎤 Pronunciación (Speaking)</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Pulsa el micrófono y di la frase en voz alta.</p>
              </div>
              <Badge tone="brand">{speakOfLevel.filter((s) => isDone(s.id)).length}/{speakOfLevel.length}</Badge>
            </div>
            <div className="space-y-2">
              {speakOfLevel.map((s) => (
                <SpeakItem key={s.id} item={s} done={isDone(s.id)} onPass={() => complete(s.id)} />
              ))}
            </div>
          </Card>
        )}

        {levelExam && (
          <EnglishExam exam={levelExam} passed={isDone(`exam:${openLevel}`)} onPass={() => { complete(`exam:${openLevel}`); toast(`📝 ¡Examen ${openLevel} de inglés aprobado!`, 'info'); setTimeout(() => toast('🎤 ¡Entrevista en inglés disponible! Practícala.', 'info'), 1600); }} />
        )}
      </div>
    </>
  );
}
