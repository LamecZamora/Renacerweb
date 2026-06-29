import { computeStats, type Stats } from './stats';
import { getActiveDays } from './storage';

// ── Identificador de la semana (ISO) ──
export function weekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86_400_000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

type Baseline = { week: string; exercises: number; english: number; journal: number; exams: number };
const BKEY = 'renacer_week_baseline';

function getBaseline(s: Stats): Baseline {
  let b: Baseline | null = null;
  try { b = JSON.parse(localStorage.getItem(BKEY) ?? 'null'); } catch { /* noop */ }
  const wk = weekKey();
  if (!b || b.week !== wk) {
    b = { week: wk, exercises: s.exercises, english: s.english, journal: s.journal, exams: s.courseExamsPassed + s.englishExamsPassed + s.finalExamsPassed };
    try { localStorage.setItem(BKEY, JSON.stringify(b)); } catch { /* noop */ }
  }
  return b;
}

function activeDaysThisWeek(): number {
  const days = new Set(getActiveDays());
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  let n = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    if (days.has(d.toISOString().slice(0, 10))) n++;
  }
  return n;
}

export type Quest = { id: string; icon: string; label: string; current: number; target: number; done: boolean };

export function weeklyQuests(): { quests: Quest[]; doneN: number; allDone: boolean; week: string } {
  const s = computeStats();
  const b = getBaseline(s);
  const examsNow = s.courseExamsPassed + s.englishExamsPassed + s.finalExamsPassed;
  const raw = [
    { id: 'q-ex', icon: '✏️', label: 'Completa 8 ejercicios', current: s.exercises - b.exercises, target: 8 },
    { id: 'q-eng', icon: '🗣', label: 'Practica inglés (8 ejercicios)', current: s.english - b.english, target: 8 },
    { id: 'q-active', icon: '🔥', label: 'Mantente activo 5 días', current: activeDaysThisWeek(), target: 5 },
    { id: 'q-journal', icon: '📔', label: 'Escribe 2 días en tu diario', current: s.journal - b.journal, target: 2 },
    { id: 'q-exam', icon: '📝', label: 'Aprueba 1 examen', current: examsNow - b.exams, target: 1 },
  ];
  const quests: Quest[] = raw.map((q) => {
    const cur = Math.max(0, q.current);
    return { ...q, current: Math.min(cur, q.target), done: cur >= q.target };
  });
  const doneN = quests.filter((q) => q.done).length;
  return { quests, doneN, allDone: doneN === quests.length, week: b.week };
}

// ── Recompensa: semanas completadas ──
const CLAIM = 'renacer_week_claimed';
const WEEKS_DONE = 'renacer_weeks_completed';

export function weekClaimed(week: string): boolean {
  try { return localStorage.getItem(CLAIM) === week; } catch { return false; }
}
export function weeksCompleted(): number {
  try { return Number(localStorage.getItem(WEEKS_DONE) ?? '0'); } catch { return 0; }
}
export function claimWeek(week: string) {
  if (weekClaimed(week)) return;
  try {
    localStorage.setItem(CLAIM, week);
    localStorage.setItem(WEEKS_DONE, String(weeksCompleted() + 1));
  } catch { /* noop */ }
}
