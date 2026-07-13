// Sistema de Estadísticas de personaje (local-first) — deriva las 8 stats RPG
// de la actividad guardada en localStorage (computeStats + señales directas).
import { computeStats } from './stats';
import { readList } from './storage';

export type StatKey =
  | 'inteligencia' | 'fuerza' | 'disciplina' | 'ingles'
  | 'programacion' | 'ia' | 'finanzas' | 'descanso';

export type CharStat = {
  key: StatKey; label: string; icon: string; color: string;
  xp: number; level: number; intoLevel: number; toNext: number; pct: number; value: number;
};

export const STAT_META: Record<StatKey, { label: string; icon: string; color: string; weight: number }> = {
  inteligencia: { label: 'Inteligencia', icon: '🧠', color: '#8b5cf6', weight: 1.1 },
  fuerza:       { label: 'Fuerza',       icon: '💪', color: '#ef4444', weight: 1.0 },
  disciplina:   { label: 'Disciplina',   icon: '❤️', color: '#fb7185', weight: 1.2 },
  ingles:       { label: 'Inglés',       icon: '🇺🇸', color: '#3b82f6', weight: 1.3 },
  programacion: { label: 'Programación', icon: '💻', color: '#10b981', weight: 1.4 },
  ia:           { label: 'IA',           icon: '🤖', color: '#06b6d4', weight: 1.1 },
  finanzas:     { label: 'Finanzas',     icon: '💰', color: '#f59e0b', weight: 1.0 },
  descanso:     { label: 'Descanso',     icon: '😴', color: '#a78bfa', weight: 0.9 },
};

const MAX_LEVEL = 100;
// Curva por-stat (espejo de la del backend: 50·(l-1)² + 100·(l-1)) para coherencia futura.
export function statXpForLevel(l: number): number {
  const L = Math.max(1, Math.min(l, MAX_LEVEL));
  return Math.round(50 * (L - 1) ** 2 + 100 * (L - 1));
}
function levelInfo(xp: number) {
  let level = 1;
  while (level < MAX_LEVEL && xp >= statXpForLevel(level + 1)) level++;
  const base = statXpForLevel(level);
  const next = statXpForLevel(level + 1);
  const intoLevel = xp - base;
  const span = Math.max(1, next - base);
  return { level, intoLevel, toNext: Math.max(0, next - xp), pct: level >= MAX_LEVEL ? 100 : Math.round((intoLevel / span) * 100) };
}

// Cuenta los mensajes que el usuario ha enviado a los personajes IA (señal de uso de IA).
function countAiMessages(): number {
  let n = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('renacer_list_chat_')) {
      try {
        const arr = JSON.parse(localStorage.getItem(k) ?? '[]') as { role?: string }[];
        n += arr.filter((m) => m.role === 'user').length;
      } catch { /* noop */ }
    }
  }
  return n;
}

/** Deriva las 8 estadísticas y el nivel general (promedio ponderado). */
export function deriveCharacterStats(): { stats: CharStat[]; overall: number } {
  const s = computeStats();
  const financeCount = readList('finance').length;
  const aiMsgs = countAiMessages();

  // XP por stat a partir de la actividad local (proxies documentados donde no hay dato directo).
  const xpByStat: Record<StatKey, number> = {
    fuerza: s.fitness * 30 + s.metrics * 10,
    ingles: s.english * 25 + s.englishExamsPassed * 12,
    programacion: (s.code + s.courseExercises) * 18 + s.courseExamsPassed * 12 + s.finalExamsPassed * 20 + s.coursesCompleted * 30,
    inteligencia: Math.floor(s.pages / 2) * 2 + s.booksFinished * 25 + s.coursesCompleted * 15,
    disciplina: s.journal * 12 + s.activeDays * 6 + s.streak * 10 + s.tasksDone * 4,
    finanzas: financeCount * 12,
    ia: aiMsgs * 8,
    // Proxy de descanso: bienestar (ánimo del diario) + constancia de métricas. Se hará real con el registro de sueño.
    descanso: Math.round(s.moodAvg * s.journal * 2) + s.metrics * 4,
  };

  const order: StatKey[] = ['programacion', 'ingles', 'inteligencia', 'disciplina', 'fuerza', 'ia', 'finanzas', 'descanso'];
  const stats: CharStat[] = order.map((key) => {
    const meta = STAT_META[key];
    const xp = Math.max(0, Math.round(xpByStat[key]));
    const info = levelInfo(xp);
    return { key, label: meta.label, icon: meta.icon, color: meta.color, xp, ...info, value: Math.min(100, info.level) };
  });

  const wSum = stats.reduce((a, st) => a + STAT_META[st.key].weight, 0);
  const overall = Math.round(stats.reduce((a, st) => a + st.level * STAT_META[st.key].weight, 0) / wSum);

  return { stats, overall };
}

// ── Detección de subidas de nivel por stat (para animar solo la que subió) ──
const LEVELS_KEY = 'renacer_char_levels';
export type LevelUp = { key: StatKey; label: string; icon: string; color: string; level: number };

/** Compara los niveles actuales con los guardados; devuelve las stats que subieron y persiste el nuevo estado. */
export function detectLevelUps(stats: CharStat[]): LevelUp[] {
  let prev: Record<string, number> = {};
  try { prev = JSON.parse(localStorage.getItem(LEVELS_KEY) ?? '{}'); } catch { /* noop */ }
  const current: Record<string, number> = {};
  const ups: LevelUp[] = [];
  const firstRun = Object.keys(prev).length === 0;
  for (const st of stats) {
    current[st.key] = st.level;
    if (!firstRun && st.level > (prev[st.key] ?? 1)) {
      ups.push({ key: st.key, label: st.label, icon: st.icon, color: st.color, level: st.level });
    }
  }
  localStorage.setItem(LEVELS_KEY, JSON.stringify(current));
  return ups;
}
