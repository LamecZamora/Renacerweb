import { COURSES, EXAMS, type Course, type CourseLevel, type ExamQ } from '../data/courses';
import { getStreak } from './storage';

export function learningDone(): Set<string> {
  try { return new Set<string>(JSON.parse(localStorage.getItem('renacer_done_learning') ?? '[]')); }
  catch { return new Set(); }
}

export const levelExerciseIds = (lv: CourseLevel) => lv.exercises.map((e) => e.id);
export const levelDoneCount = (lv: CourseLevel, done: Set<string>) => lv.exercises.filter((e) => done.has(e.id)).length;
export const examFor = (levelId: string) => EXAMS[levelId];
export const examPassed = (levelId: string, done: Set<string>) => done.has(`exam:${levelId}`);
export const exercisesDone = (lv: CourseLevel, done: Set<string>) => lv.exercises.length > 0 && levelDoneCount(lv, done) === lv.exercises.length;
export const levelComplete = (lv: CourseLevel, done: Set<string>) => {
  const exam = EXAMS[lv.id];
  return exercisesDone(lv, done) && (!exam || examPassed(lv.id, done));
};

export const isLevelUnlocked = (course: Course, index: number, done: Set<string>) =>
  index === 0 || levelComplete(course.levels[index - 1], done);

export function courseProgress(course: Course, done: Set<string>) {
  const total = course.levels.reduce((n, l) => n + l.exercises.length, 0);
  const got = course.levels.reduce((n, l) => n + levelDoneCount(l, done), 0);
  return { got, total, pct: total ? Math.round((got / total) * 100) : 0 };
}

export const courseComplete = (course: Course, done: Set<string>) =>
  course.levels.length > 0 && course.levels.every((lv) => levelComplete(lv, done));

/** Un curso cuenta como "aprendido" (suficiente para construir) al superar el umbral de progreso. */
export const courseLearned = (courseId: string, done: Set<string>, threshold = 50) => {
  const c = COURSES.find((x) => x.id === courseId);
  return !!c && courseProgress(c, done).pct >= threshold;
};

/** Cursos 100% terminados (para certificados y logros). */
export function completedCourses(done: Set<string> = learningDone()): Course[] {
  return COURSES.filter((c) => courseComplete(c, done));
}

/** Examen final del curso: combina las preguntas de todos sus niveles; corte alto (85%). */
export function finalExam(course: Course): { pass: number; questions: ExamQ[] } | null {
  const questions = course.levels.flatMap((lv) => EXAMS[lv.id]?.questions ?? []);
  return questions.length >= 3 ? { pass: 85, questions } : null;
}
export const finalExamPassed = (courseId: string, done: Set<string>) => done.has(`finalexam:${courseId}`);

// ── Ruta recomendada (orden sugerido para llegar a dev en Vancouver 🍁) ──
export type RoadmapPhase = { id: string; title: string; goal: string; courseIds: string[] };
export const ROADMAP: RoadmapPhase[] = [
  { id: 'r1', title: 'Fase 1 · Cimientos', goal: 'Un lenguaje base + la terminal y el control de versiones que usarás todos los días.', courseIds: ['java', 'python', 'git', 'linux'] },
  { id: 'r2', title: 'Fase 2 · La Web', goal: 'Construir páginas y hablar con bases de datos: la base de cualquier producto.', courseIds: ['html', 'css', 'javascript', 'sql'] },
  { id: 'r3', title: 'Fase 3 · Profesionalízate', goal: 'Tipado fuerte, framework moderno y los algoritmos que piden en entrevistas.', courseIds: ['typescript', 'react', 'dsa'] },
  { id: 'r4', title: 'Fase 4 · Backend a escala', goal: 'Empaquetar, entender la red, diseñar sistemas y desplegar en la nube (perfil empleable).', courseIds: ['docker', 'redes', 'sysdesign', 'cloud'] },
  { id: 'r5', title: 'Fase 5 · Especialización', goal: 'Amplía tu rango con lenguajes y temas extra según el rol que busques.', courseIds: ['csharp', 'lua', 'go', 'rust', 'kotlin', 'angular', 'php', 'cpp', 'ciber', 'asm'] },
];

export function courseUnlocked(course: Course, done: Set<string>): { ok: boolean; missing: string[] } {
  if (!course.requires?.length) return { ok: true, missing: [] };
  const missing: string[] = [];
  for (const req of course.requires) {
    const c = COURSES.find((x) => x.id === req.courseId);
    const prog = c ? courseProgress(c, done).pct : 0;
    if (prog < 50) missing.push(req.label);
  }
  return { ok: missing.length === 0, missing };
}

// ── Repaso espaciado ──
const REVIEW_KEY = 'renacer_review';
function reviewMap(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(REVIEW_KEY) ?? '{}'); } catch { return {}; }
}
export function markLevelPracticed(levelId: string) {
  const m = reviewMap();
  m[levelId] = new Date().toISOString();
  localStorage.setItem(REVIEW_KEY, JSON.stringify(m));
}
export function reviewDue(days = 7): { course: string; title: string; days: number }[] {
  const done = learningDone();
  const m = reviewMap();
  const out: { course: string; title: string; days: number }[] = [];
  for (const c of COURSES) {
    for (const lv of c.levels) {
      if (!levelComplete(lv, done)) continue;
      const ts = m[lv.id];
      if (!ts) continue;
      const d = Math.floor((Date.now() - new Date(ts).getTime()) / 86_400_000);
      if (d >= days) out.push({ course: c.name, title: lv.title, days: d });
    }
  }
  return out.sort((a, b) => b.days - a.days);
}

/** Notas inteligentes tipo mentor, derivadas del progreso real. */
export function learningNotes(done: Set<string> = learningDone()): string[] {
  const notes: string[] = [];
  const java = COURSES.find((c) => c.id === 'java')!;
  const jp = courseProgress(java, done);
  const streak = getStreak();

  if (streak >= 2) notes.push(`Llevas ${streak} días seguidos activo. ¡No rompas la racha! 🔥`);

  const done100 = completedCourses(done);
  if (done100.length > 0) notes.push(`Has completado ${done100.length} curso(s) y ganado ${done100.length} certificado(s). 🎓`);

  // Siguiente curso recomendado según la ruta (el primero desbloqueado y no terminado).
  for (const phase of ROADMAP) {
    const next = phase.courseIds
      .map((id) => COURSES.find((c) => c.id === id))
      .find((c) => c && courseUnlocked(c, done).ok && !courseComplete(c, done));
    if (next) { notes.push(`Siguiente en tu ruta: ${next.icon} ${next.name} (${courseProgress(next, done).pct}%).`); break; }
  }

  const due = reviewDue(7);
  if (due[0]) notes.push(`Hace ${due[0].days} días no practicas "${due[0].title}". Te recomiendo un repaso. 🔁`);

  if (levelComplete(java.levels[0], done)) notes.push('Ya dominas los fundamentos de Java. ☕');
  if (levelComplete(java.levels[3], done)) notes.push('Manejas arreglos y colecciones: base sólida para estructuras de datos.');
  if (levelComplete(java.levels[5], done)) notes.push('Dominas POO. Antes de Spring Boot, repásala si tienes dudas.');

  // siguiente nivel desbloqueable
  const nextLocked = java.levels.findIndex((_lv, i) => !isLevelUnlocked(java, i, done));
  const lastUnlockedNotDone = java.levels.findIndex((lv, i) => isLevelUnlocked(java, i, done) && !levelComplete(lv, done));
  if (lastUnlockedNotDone >= 0) notes.push(`Tu reto actual: ${java.levels[lastUnlockedNotDone].title}.`);
  if (nextLocked > 0) {
    const remaining = java.levels[nextLocked - 1].exercises.length - levelDoneCount(java.levels[nextLocked - 1], done);
    if (remaining > 0) notes.push(`Te faltan ${remaining} ejercicio(s) para desbloquear ${java.levels[nextLocked].title}.`);
  }

  if (jp.pct >= 60) notes.push('Vas avanzado en Java: empieza a armar tu portafolio en GitHub para Vancouver. 🍁');
  if (jp.pct === 100) notes.push('¡Completaste Java! Estás listo para React y Full Stack.');
  if (jp.pct === 0) notes.push('Empieza por el Nivel 1 de Java: los fundamentos lo son todo.');

  return notes.slice(0, 5);
}

export type Challenge = { course: Course; level: CourseLevel; ex: { id: string; level: string; objective: string; hint?: string; solution: string } };

/** Reto del día: un ejercicio desbloqueado y sin hacer, elegido de forma estable por fecha. */
export function dailyChallenge(done: Set<string> = learningDone()): Challenge | null {
  const candidates: Challenge[] = [];
  for (const c of COURSES) {
    if (!courseUnlocked(c, done).ok) continue;
    c.levels.forEach((lv, i) => {
      if (!isLevelUnlocked(c, i, done)) return;
      for (const ex of lv.exercises) if (!done.has(ex.id)) candidates.push({ course: c, level: lv, ex });
    });
  }
  if (!candidates.length) return null;
  const seed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
  return candidates[seed % candidates.length];
}

export type PlanItem = { day: string; course: Course; level: CourseLevel };

/** Plan de estudio semanal: hasta 7 niveles desbloqueados y pendientes, en orden de la ruta. */
export function weeklyPlan(done: Set<string> = learningDone()): PlanItem[] {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const picks: { course: Course; level: CourseLevel }[] = [];
  for (const phase of ROADMAP) {
    for (const id of phase.courseIds) {
      const c = COURSES.find((x) => x.id === id);
      if (!c || !courseUnlocked(c, done).ok) continue;
      c.levels.forEach((lv, i) => {
        if (picks.length < 7 && isLevelUnlocked(c, i, done) && !levelComplete(lv, done)) picks.push({ course: c, level: lv });
      });
      if (picks.length >= 7) break;
    }
    if (picks.length >= 7) break;
  }
  return picks.map((p, i) => ({ day: days[i], ...p }));
}
