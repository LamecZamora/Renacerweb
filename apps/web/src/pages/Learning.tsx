import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, PageHeader, Progress, Badge } from '../components/ui';
import { useProgress, getProfile } from '../lib/storage';
import { COURSES, sortExercises, exLevelColor, type Course, type Exercise, type Exam } from '../data/courses';
import { courseProgress, courseUnlocked, isLevelUnlocked, levelComplete, levelDoneCount, learningNotes, examFor, exercisesDone, markLevelPracticed, reviewDue, courseComplete, completedCourses, ROADMAP, weeklyPlan, finalExam, finalExamPassed } from '../lib/learning';
import Programming from './Programming';
import CodeRunner from '../components/CodeRunner';
import ListenButton from '../components/ListenButton';
import { toast } from '../lib/toast';
import { confetti } from '../lib/confetti';
import { motivate } from '../lib/motivate';
import ConsejoCard from '../components/ConsejoCard';
import { CODE_TIPS } from '../data/tips';

// Cursos de la familia JavaScript: el editor puede ejecutar el código en vivo.
const JS_FAMILY = new Set(['javascript', 'typescript', 'react', 'angular']);

function Certificate({ course, distinction, onClose }: { course: Course; distinction: boolean; onClose: () => void }) {
  const name = getProfile()?.name || 'Estudiante Renacer';
  const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  const print = () => {
    document.body.classList.add('printing-cert');
    const cleanup = () => { document.body.classList.remove('printing-cert'); window.removeEventListener('afterprint', cleanup); };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 1500);
  };
  return (
    <div className="no-print fixed inset-0 z-50 grid place-items-center bg-ink-950/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
        <div className="cert-print rounded-2xl border-[6px] p-8 sm:p-12 text-center bg-white text-ink-900 shadow-2xl" style={{ borderColor: course.color }}>
          <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl text-4xl mb-3" style={{ background: `${course.color}22` }}>🎓</div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">Certificado de Logro</p>
          <p className="mt-4 text-sm text-stone-500">Se otorga el presente reconocimiento a</p>
          <p className="font-display text-3xl sm:text-4xl font-extrabold mt-1" style={{ color: course.color }}>{name}</p>
          <p className="mt-4 text-sm text-stone-500">por completar al 100% el curso de</p>
          <p className="font-display text-2xl font-extrabold mt-1">{course.icon} {course.name}</p>
          {distinction && <p className="text-sm font-bold mt-1" style={{ color: course.color }}>🏅 con distinción (examen final superado)</p>}
          <p className="text-xs text-stone-400 mt-1 italic">{course.tagline}</p>
          <div className="mt-6 flex items-center justify-center gap-8 text-xs text-stone-500">
            <div><p className="font-bold text-ink-900">{fecha}</p><p className="border-t border-stone-300 mt-1 pt-1">Fecha</p></div>
            <div><p className="font-display font-extrabold text-ink-900">RENACER</p><p className="border-t border-stone-300 mt-1 pt-1">Sistema de Aprendizaje</p></div>
          </div>
        </div>
        <div className="no-print mt-4 flex justify-center gap-3">
          <button onClick={print} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-ink-950 hover:opacity-95">🖨 Imprimir / Guardar PDF</button>
          <button onClick={onClose} className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

function Roadmap({ done, onPick }: { done: Set<string>; onPick: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="mb-6 border-brand-500/30">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <div className="flex items-center gap-2"><span>🗺️</span><h3 className="font-bold">Ruta recomendada hacia Vancouver 🍁</h3></div>
        <span className="text-xs text-stone-400">{open ? 'Ocultar ▲' : 'Ver ruta ▼'}</span>
      </button>
      {open && (
        <div className="mt-4 space-y-4">
          {ROADMAP.map((phase, pi) => {
            const courses = phase.courseIds.map((id) => COURSES.find((c) => c.id === id)).filter(Boolean) as Course[];
            const total = courses.length;
            const doneN = courses.filter((c) => courseComplete(c, done)).length;
            return (
              <div key={phase.id} className="relative pl-6">
                <span className="absolute left-0 top-1 grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold text-ink-950" style={{ background: doneN === total ? '#10b981' : '#f59e0b' }}>{pi + 1}</span>
                {pi < ROADMAP.length - 1 && <span className="absolute left-[7px] top-6 bottom-[-16px] w-px bg-stone-300 dark:bg-white/10" />}
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm">{phase.title}</p>
                  <Badge tone={doneN === total ? 'green' : doneN > 0 ? 'brand' : 'slate'}>{doneN}/{total}</Badge>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">{phase.goal}</p>
                <div className="flex flex-wrap gap-1.5">
                  {courses.map((c) => {
                    const pct = courseProgress(c, done).pct;
                    return (
                      <button key={c.id} onClick={() => onPick(c.id)}
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium hover:ring-2 hover:ring-brand-500/40 transition"
                        style={{ borderColor: `${c.color}55`, background: pct === 100 ? `${c.color}18` : 'transparent' }}>
                        <span>{pct === 100 ? '✅' : c.icon}</span>{c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function ExerciseItem({ ex, done, runnerLang, onDone }: { ex: Exercise; done: boolean; runnerLang: string; onDone: () => void }) {
  const [hint, setHint] = useState(false);
  const [sol, setSol] = useState(false);
  const [editor, setEditor] = useState(false);
  return (
    <div className={`rounded-xl border p-3 ${done ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-stone-200/70 dark:border-white/10'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${exLevelColor[ex.level]}22`, color: exLevelColor[ex.level] }}>{ex.level}</span>
          <p className="text-sm font-medium">{ex.objective}</p>
        </div>
        <label className="flex items-center gap-1 text-xs cursor-pointer shrink-0">
          <input type="checkbox" checked={done} onChange={onDone} className="accent-emerald-600 h-4 w-4" />
          {done ? 'Hecho' : 'Marcar'}
        </label>
      </div>
      <div className="mt-2 flex gap-3">
        <button onClick={() => setEditor((e) => !e)} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">{editor ? 'Cerrar editor' : '✏️ Resolver aquí'}</button>
        {ex.hint && <button onClick={() => setHint((h) => !h)} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">{hint ? 'Ocultar pista' : '💡 Pista'}</button>}
        <button onClick={() => setSol((s) => !s)} className="text-xs font-semibold text-stone-500 hover:underline">{sol ? 'Ocultar solución' : 'Ver solución'}</button>
      </div>
      {hint && ex.hint && <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">💡 {ex.hint}</p>}
      {editor && <div className="mt-2"><CodeRunner lang={runnerLang} initial={`// ${ex.objective}\n`} /></div>}
      {sol && <pre className="mt-2 rounded-lg bg-ink-950 text-emerald-300 font-mono text-xs p-3 overflow-x-auto whitespace-pre">{ex.solution}</pre>}
    </div>
  );
}

function ExamBlock({ exam, passed, ready, onPass }: { exam: Exam; passed: boolean; ready: boolean; onPass: () => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = exam.questions.filter((q) => answers[q.id] === q.answer).length;
  const pct = Math.round((score / exam.questions.length) * 100);
  const aprueba = pct >= exam.pass;

  if (passed) {
    return (
      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">✅ Examen de desbloqueo aprobado · siguiente nivel disponible</p>
      </div>
    );
  }
  if (!ready) {
    return (
      <div className="rounded-xl border border-stone-200/70 dark:border-white/10 p-4">
        <p className="text-sm font-semibold mb-1">📝 Examen de desbloqueo</p>
        <p className="text-xs text-stone-500 dark:text-stone-400">Completa todos los ejercicios del nivel para desbloquear el examen.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
      <p className="text-sm font-bold mb-1">📝 Examen de desbloqueo <span className="text-xs font-normal text-stone-500">(necesitas {exam.pass}% para avanzar)</span></p>
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
        <button onClick={() => { setSubmitted(true); if (pct >= exam.pass) onPass(); else motivate(); }}
          disabled={Object.keys(answers).length < exam.questions.length}
          className="mt-3 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 hover:opacity-95 disabled:opacity-40">
          Entregar examen
        </button>
      ) : (
        <div className="mt-3">
          <p className={`text-sm font-bold ${aprueba ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            {aprueba ? `✅ ¡Aprobado! ${pct}% — nivel desbloqueado` : `❌ ${pct}% — necesitas ${exam.pass}%. Repasa la teoría y reintenta.`}
          </p>
          {!aprueba && <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="mt-2 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-ink-950">Reintentar</button>}
        </div>
      )}
    </div>
  );
}

function FinalExamBlock({ exam, passed, onPass }: { exam: Exam; passed: boolean; onPass: () => void }) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = exam.questions.filter((q) => answers[q.id] === q.answer).length;
  const pct = Math.round((score / exam.questions.length) * 100);
  const aprueba = pct >= exam.pass;

  if (passed) {
    return <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm font-semibold text-amber-600 dark:text-amber-500">🏅 Examen final superado — certificado con distinción</div>;
  }
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="w-full rounded-xl border border-amber-500/40 bg-amber-500/5 p-3 text-sm font-bold text-amber-600 dark:text-amber-500 hover:bg-amber-500/10">
        🏆 Examen final del curso ({exam.questions.length} preguntas · necesitas {exam.pass}%) — gana la distinción
      </button>
    );
  }
  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4">
      <p className="text-sm font-bold mb-2">🏆 Examen final <span className="text-xs font-normal text-stone-500">(difícil · {exam.pass}% para la distinción)</span></p>
      <div className="space-y-3">
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
                        : picked ? 'border-amber-500 bg-amber-500/10' : 'border-stone-200 dark:border-white/10 hover:border-amber-400'
                    }`}>{opt}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={() => { setSubmitted(true); if (pct >= exam.pass) onPass(); else motivate(); }} disabled={Object.keys(answers).length < exam.questions.length}
          className="mt-3 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-40">Entregar examen final</button>
      ) : (
        <div className="mt-3">
          <p className={`text-sm font-bold ${aprueba ? 'text-amber-600 dark:text-amber-500' : 'text-red-500'}`}>
            {aprueba ? `🏅 ¡Distinción lograda! ${pct}%` : `❌ ${pct}% — necesitas ${exam.pass}%. Repasa el curso y reintenta.`}
          </p>
          {!aprueba && <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white">Reintentar</button>}
        </div>
      )}
    </div>
  );
}

export default function Learning() {
  const { done, complete, toggle } = useProgress('learning');
  const [courseId, setCourseId] = useState(() => {
    const pending = localStorage.getItem('renacer_open_course');
    if (pending) { localStorage.removeItem('renacer_open_course'); if (COURSES.some((c) => c.id === pending)) return pending; }
    return 'java';
  });
  const [openLevel, setOpenLevel] = useState<string | null>(null);
  const [tab, setTab] = useState<'cursos' | 'practica'>('cursos');
  const [certCourse, setCertCourse] = useState<Course | null>(null);

  const course = COURSES.find((c) => c.id === courseId)!;
  const unlock = courseUnlocked(course, done);
  // Memoizados por `done`: evitan recalcular los 25 cursos en re-renders (cambiar de pestaña/nivel).
  const notes = useMemo(() => learningNotes(done), [done]);
  const due = useMemo(() => reviewDue(7), [done]);
  const certs = useMemo(() => completedCourses(done), [done]);
  const plan = useMemo(() => weeklyPlan(done), [done]);
  const courseCards = useMemo(
    () => COURSES.map((c) => ({ c, prog: courseProgress(c, done), u: courseUnlocked(c, done), complete: courseComplete(c, done) })),
    [done],
  );

  // Confetti + aviso cuando un curso pasa a estar 100% completo.
  const completedRef = useRef<Set<string> | null>(null);
  useEffect(() => {
    const nowComplete = new Set(completedCourses(done).map((c) => c.id));
    if (completedRef.current === null) { completedRef.current = nowComplete; return; }
    for (const id of nowComplete) {
      if (!completedRef.current.has(id)) {
        confetti();
        toast(`🎓 ¡Curso completado: ${COURSES.find((c) => c.id === id)?.name}!`, 'achievement');
        setTimeout(() => toast('🎤 ¡Entrevista disponible! Practica en el simulador antes de la real.', 'info'), 1600);
      }
    }
    completedRef.current = nowComplete;
  }, [done]);
  const pickCourse = (id: string) => {
    const u = courseUnlocked(COURSES.find((c) => c.id === id)!, done);
    if (u.ok) { setCourseId(id); setOpenLevel(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  return (
    <>
      <PageHeader title="Cursos" subtitle="Aprende a programar: ruta estructurada con teoría y exámenes, o práctica rápida con consola." icon="📚" />

      <div className="flex gap-2 mb-5">
        {([['cursos', '📚 Ruta de cursos'], ['practica', '⚡ Práctica rápida']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === k ? 'bg-brand-600 text-ink-950' : 'bg-stone-200/60 dark:bg-white/5 text-stone-500 hover:text-stone-800 dark:hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'practica' ? <Programming embedded /> : (<>

      {/* Notas del Mentor */}
      {notes.length > 0 && (
        <Card className="mb-6 bg-slate-900 text-white border-0">
          <div className="flex items-center gap-2 mb-2"><span>🧠</span><h3 className="font-bold">Notas del Mentor</h3></div>
          <ul className="space-y-1 text-sm text-slate-200">
            {notes.map((n, i) => <li key={i}>• {n}</li>)}
          </ul>
        </Card>
      )}

      {/* Repaso espaciado */}
      {due.length > 0 && (
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <h3 className="font-bold mb-2">🔁 Repaso recomendado</h3>
          <ul className="space-y-1 text-sm text-stone-600 dark:text-stone-300">
            {due.slice(0, 3).map((d, i) => (
              <li key={i}>• Hace <b>{d.days} días</b> que no practicas <b>{d.title}</b> ({d.course}). Dale un repaso para no oxidarte.</li>
            ))}
          </ul>
        </Card>
      )}

      <ConsejoCard tips={CODE_TIPS} title="Consejo para aprender a programar" />

      {/* Plan de estudio semanal */}
      {plan.length > 0 && (
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-1"><span>📅</span><h3 className="font-bold">Tu plan de estudio semanal</h3></div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Generado desde tu ruta: los próximos niveles desbloqueados y pendientes. Uno por día. 💪</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {plan.map((p) => (
              <button key={p.day} onClick={() => { pickCourse(p.course.id); setOpenLevel(p.level.id); }}
                className="flex items-center gap-3 rounded-xl border border-stone-200/70 dark:border-white/10 p-2.5 text-left hover:ring-2 hover:ring-brand-500/40 transition">
                <span className="grid h-9 w-9 place-items-center rounded-lg text-lg shrink-0" style={{ background: `${p.course.color}22` }}>{p.course.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-brand-600 dark:text-brand-400">{p.day}</p>
                  <p className="text-sm font-medium truncate">{p.course.name} · {p.level.title}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Ruta recomendada */}
      <Roadmap done={done} onPick={pickCourse} />

      {/* Certificados obtenidos */}
      {certs.length > 0 && (
        <Card className="mb-6 border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-2"><span>🎓</span><h3 className="font-bold">Mis certificados <span className="text-xs font-normal text-stone-500">({certs.length} de {COURSES.length} cursos)</span></h3></div>
          <div className="flex flex-wrap gap-2">
            {certs.map((c) => (
              <button key={c.id} onClick={() => setCertCourse(c)}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold hover:ring-2 hover:ring-emerald-500/40 transition"
                style={{ borderColor: `${c.color}55`, background: `${c.color}14` }}>
                {c.icon} {c.name} <span className="text-xs">🎓</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Selector de cursos */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {courseCards.map(({ c, prog, u, complete: isComplete }) => {
          return (
            <button key={c.id} onClick={() => { if (u.ok) { setCourseId(c.id); setOpenLevel(null); } }} disabled={!u.ok}
              className={`group glass-card text-left rounded-2xl border p-4 ${u.ok ? 'lift' : ''} ${
                courseId === c.id ? 'ring-2 ring-brand-500 border-transparent' : 'border-stone-200/70 dark:border-white/10'
              } ${u.ok ? '' : 'opacity-60 cursor-not-allowed'}`}>
              <div className="flex items-start justify-between gap-2">
                <span className="grid h-12 w-12 place-items-center rounded-2xl text-2xl ring-1 transition group-hover:scale-105"
                  style={{ background: `${c.color}1f`, boxShadow: `inset 0 0 0 1px ${c.color}40` }}>{u.ok ? c.icon : '🔒'}</span>
                <div className="flex items-center gap-1.5">
                  {isComplete && <span title="Certificado obtenido">🎓</span>}
                  <span className="font-display text-sm font-extrabold" style={{ color: prog.pct > 0 ? c.color : undefined }}>{prog.pct}%</span>
                </div>
              </div>
              <h4 className="font-bold mt-2.5 truncate">{c.name}</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 min-h-[2rem]">{c.tagline}</p>
              {u.ok ? (
                <div className="mt-2.5 h-1.5 rounded-full bg-stone-200/70 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${prog.pct}%`, background: c.color }} />
                </div>
              ) : (
                <p className="text-[11px] text-amber-600 mt-2.5">🔒 Requiere: {u.missing.join(', ')}</p>
              )}
            </button>
          );
        })}
      </div>

      {!unlock.ok ? (
        <Card><p className="text-sm text-stone-500">Curso bloqueado. Completa: {unlock.missing.join(', ')}.</p></Card>
      ) : (
        <div className="space-y-3">
          {courseComplete(course, done) && (
            <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 to-brand-500/10 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">🎉 ¡Completaste {course.name} al 100%!{finalExamPassed(course.id, done) && ' 🏅 con distinción'}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Has ganado tu certificado. Supera el examen final para la distinción.</p>
                </div>
                <button onClick={() => setCertCourse(course)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:opacity-95">🎓 Ver certificado</button>
              </div>
              {finalExam(course) && (
                <FinalExamBlock exam={finalExam(course)!} passed={finalExamPassed(course.id, done)} onPass={() => { complete(`finalexam:${course.id}`); toast('🏅 ¡Distinción lograda en ' + course.name + '!', 'achievement'); confetti(); }} />
              )}
            </div>
          )}
          {course.levels.map((lv, i) => {
            const unlocked = isLevelUnlocked(course, i, done);
            const doneCount = levelDoneCount(lv, done);
            const complete_ = levelComplete(lv, done);
            const isOpen = openLevel === lv.id;
            return (
              <Card key={lv.id} className={complete_ ? 'ring-1 ring-emerald-500/30' : ''}>
                <button onClick={() => unlocked && setOpenLevel(isOpen ? null : lv.id)} disabled={!unlocked}
                  className="flex w-full items-center justify-between text-left disabled:cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{unlocked ? (complete_ ? '✅' : '📘') : '🔒'}</span>
                    <div>
                      <h3 className="font-bold">{lv.title}</h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{lv.subtopics.join(' · ')}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {unlocked ? <Badge tone={complete_ ? 'green' : doneCount > 0 ? 'brand' : 'slate'}>{doneCount}/{lv.exercises.length}</Badge>
                      : <Badge tone="amber">Bloqueado</Badge>}
                  </div>
                </button>

                {!unlocked && <p className="mt-2 text-xs text-amber-600">Debes completar antes: {course.levels[i - 1].title}.</p>}

                {unlocked && isOpen && (
                  <div className="mt-4 space-y-4">
                    {/* Teoría */}
                    <div className="rounded-xl bg-brand-500/5 border border-brand-500/20 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold text-stone-400">📖 Lee · 🔊 Escucha · ✏️ Hazlo — aprende a tu manera</span>
                        <ListenButton text={lv.theory.teoria} lang="es-MX" label="Escuchar teoría" />
                      </div>
                      <p className="text-sm text-stone-600 dark:text-stone-300"><b className="text-brand-700 dark:text-brand-400">📖 Teoría:</b> {lv.theory.teoria}</p>
                      {lv.theory.ejemplo && <pre className="rounded-lg bg-ink-950 text-emerald-300 font-mono text-xs p-3 overflow-x-auto whitespace-pre">{lv.theory.ejemplo}</pre>}
                      {lv.theory.buenas && (
                        <div className="text-xs"><b className="text-emerald-600 dark:text-emerald-400">✓ Buenas prácticas:</b>
                          <ul className="mt-1 space-y-0.5 text-stone-600 dark:text-stone-300">{lv.theory.buenas.map((b, k) => <li key={k}>• {b}</li>)}</ul>
                        </div>
                      )}
                      {lv.theory.errores && (
                        <div className="text-xs"><b className="text-red-500">⚠ Errores comunes:</b>
                          <ul className="mt-1 space-y-0.5 text-stone-600 dark:text-stone-300">{lv.theory.errores.map((b, k) => <li key={k}>• {b}</li>)}</ul>
                        </div>
                      )}
                    </div>

                    {/* Ejercicios por dificultad */}
                    <div>
                      <h4 className="font-bold text-sm mb-2">Ejercicios</h4>
                      <Progress value={doneCount} max={lv.exercises.length} className="mb-3" />
                      <div className="space-y-2">
                        {sortExercises(lv.exercises).map((ex) => (
                          <ExerciseItem key={ex.id} ex={ex} done={done.has(ex.id)} runnerLang={JS_FAMILY.has(course.id) ? 'JavaScript' : course.name}
                            onDone={() => { markLevelPracticed(lv.id); if (done.has(ex.id)) { toggle(ex.id); } else { complete(ex.id); toast('✓ Ejercicio completado'); } }} />
                        ))}
                      </div>
                    </div>

                    {/* Examen de desbloqueo */}
                    {examFor(lv.id) && (
                      <ExamBlock
                        exam={examFor(lv.id)!}
                        passed={done.has(`exam:${lv.id}`)}
                        ready={exercisesDone(lv, done)}
                        onPass={() => { complete(`exam:${lv.id}`); markLevelPracticed(lv.id); toast('📝 ¡Examen aprobado! Nivel desbloqueado', 'info'); }}
                      />
                    )}

                    {/* Proyecto de etapa */}
                    {lv.project && (
                      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
                        <div className="flex items-center gap-2"><span>🚀</span><b className="text-sm">{lv.project.title}</b></div>
                        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">{lv.project.desc}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      </>)}

      {certCourse && <Certificate course={certCourse} distinction={finalExamPassed(certCourse.id, done)} onClose={() => setCertCourse(null)} />}
    </>
  );
}
