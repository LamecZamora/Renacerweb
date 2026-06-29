import { countDone, readList, getProfile, getStreak, getActiveDays } from './storage';
import { completedCourses, learningDone } from './learning';
import { reconcileXP } from './xp';

type Book = { totalPages: number; pagesRead: number };
type Tx = { type: string; amount: number };
type Project = { tasks: { done: boolean }[] };
type Metric = { date: string; weight?: number };
type Entry = { mood: number };

export type Stats = {
  english: number; code: number; fitness: number; exercises: number;
  courseExercises: number; coursesCompleted: number;
  englishExamsPassed: number; courseExamsPassed: number; finalExamsPassed: number; projectsCompleted: number;
  journal: number; moodAvg: number;
  books: number; booksFinished: number; pages: number;
  income: number; expense: number; saving: number; net: number;
  projects: number; tasksDone: number;
  metrics: number; weightStart?: number; weightCurrent?: number; weightDelta: number;
  imc?: number; imcLabel: string;
  level: number; points: number; intoLevel: number;
  xpNeeded: number; xpToday: number; xpCap: number;
  streak: number; activeDays: number;
};

const IMC_LABELS: [number, string][] = [
  [18.5, 'Bajo peso'], [25, 'Normal'], [30, 'Sobrepeso'], [Infinity, 'Obesidad'],
];

// Caché de microtarea: dentro de un mismo render (síncrono) varias llamadas comparten el resultado;
// se limpia en la siguiente microtarea, así que nunca queda obsoleto entre renders.
let _statsCache: Stats | null = null;
export function computeStats(): Stats {
  if (_statsCache) return _statsCache;
  _statsCache = computeStatsRaw();
  queueMicrotask(() => { _statsCache = null; });
  return _statsCache;
}

function computeStatsRaw(): Stats {
  const profile = getProfile();
  const english = countDone('english');
  const code = countDone('code');
  const fitness = countDone('fitness');
  // Ejercicios del sistema de cursos (renacer_done_learning), sin contar los aprobados de examen ("exam:...").
  const learnIds = [...learningDone()];
  const courseExercises = learnIds.filter((id) => !id.startsWith('exam:') && !id.startsWith('finalexam:')).length;
  const coursesCompleted = completedCourses().length;
  const exercises = english + code + fitness + courseExercises;

  // Exámenes aprobados (rigor) y proyectos realmente completados.
  const courseExamsPassed = learnIds.filter((id) => id.startsWith('exam:')).length;
  const finalExamsPassed = learnIds.filter((id) => id.startsWith('finalexam:')).length;
  let engIds: string[] = [];
  try { engIds = JSON.parse(localStorage.getItem('renacer_done_english') ?? '[]'); } catch { /* noop */ }
  const englishExamsPassed = engIds.filter((id) => id.startsWith('exam:')).length;

  const journalList = readList<Entry>('journal');
  const journal = journalList.length;
  const moodAvg = journal ? journalList.reduce((s, e) => s + (e.mood + 1), 0) / journal : 0;

  const books = readList<Book>('books');
  const pages = books.reduce((s, b) => s + (b.pagesRead || 0), 0);
  const booksFinished = books.filter((b) => b.totalPages > 0 && b.pagesRead >= b.totalPages).length;

  const tx = readList<Tx>('finance');
  const income = tx.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const expense = tx.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  const saving = tx.filter((t) => t.type === 'SAVING').reduce((s, t) => s + t.amount, 0);

  const projectsList = readList<Project>('projects');
  const tasksDone = projectsList.reduce((s, p) => s + p.tasks.filter((t) => t.done).length, 0);
  const projectsCompleted = projectsList.filter((p) => p.tasks.length > 0 && p.tasks.every((t) => t.done)).length;

  const metricsList = readList<Metric>('metrics');
  const weightCurrent = metricsList.find((m) => m.weight)?.weight ?? profile?.startWeight;
  const weightStart = profile?.startWeight ?? metricsList.filter((m) => m.weight).slice(-1)[0]?.weight;
  const weightDelta = weightStart && weightCurrent ? +(weightStart - weightCurrent).toFixed(1) : 0;

  let imc: number | undefined;
  let imcLabel = '—';
  if (profile?.heightCm && weightCurrent) {
    const h = profile.heightCm / 100;
    imc = +(weightCurrent / (h * h)).toFixed(1);
    imcLabel = IMC_LABELS.find(([max]) => imc! < max)?.[1] ?? '—';
  }

  // ── XP: tu actividad da XP, con curva creciente y tope diario (ver lib/xp.ts) ──
  const examsTotal = courseExamsPassed + englishExamsPassed + finalExamsPassed;
  const rawXP = exercises * 6 + journal * 5 + tasksDone * 4 + Math.floor(pages / 2)
    + coursesCompleted * 40 + examsTotal * 12 + booksFinished * 20 + Math.min(getActiveDays().length, 60) * 5
    + projectsCompleted * 20;
  const xp = reconcileXP(rawXP);
  const points = xp.total;   // "points" ahora es XP total
  const level = xp.level;

  return {
    english, code, fitness, exercises,
    courseExercises, coursesCompleted,
    englishExamsPassed, courseExamsPassed, finalExamsPassed, projectsCompleted,
    journal, moodAvg: +moodAvg.toFixed(1),
    books: books.length, booksFinished, pages,
    income, expense, saving, net: income - expense,
    projects: projectsList.length, tasksDone,
    metrics: metricsList.length, weightStart, weightCurrent, weightDelta,
    imc, imcLabel,
    level, points, intoLevel: xp.intoLevel,
    xpNeeded: xp.needed, xpToday: xp.today, xpCap: xp.cap,
    streak: getStreak(), activeDays: getActiveDays().length,
  };
}
