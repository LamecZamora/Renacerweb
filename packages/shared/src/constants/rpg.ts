// Sistema RPG compartido — niveles, estadísticas y recompensas de XP.

export const RPG_STATS = [
  'STRENGTH', 'STAMINA', 'DISCIPLINE', 'INTELLIGENCE', 'KNOWLEDGE',
  'CREATIVITY', 'CHARISMA', 'HEALTH', 'PROGRAMMING', 'ENGLISH',
] as const;
export type RpgStat = (typeof RPG_STATS)[number];

export const STAT_LABELS: Record<RpgStat, string> = {
  STRENGTH: 'Fuerza',
  STAMINA: 'Resistencia',
  DISCIPLINE: 'Disciplina',
  INTELLIGENCE: 'Inteligencia',
  KNOWLEDGE: 'Conocimiento',
  CREATIVITY: 'Creatividad',
  CHARISMA: 'Carisma',
  HEALTH: 'Salud',
  PROGRAMMING: 'Programación',
  ENGLISH: 'Inglés',
};

export const MAX_LEVEL = 100;

/** XP acumulada necesaria para alcanzar un nivel (curva cuadrática suave). */
export function xpForLevel(level: number): number {
  const l = Math.max(1, Math.min(level, MAX_LEVEL));
  return Math.round(50 * (l - 1) * (l - 1) + 100 * (l - 1));
}

/** Deriva nivel + progreso al siguiente a partir de XP total. */
export function levelFromXp(totalXp: number): {
  level: number;
  intoLevel: number;
  toNext: number;
  pct: number;
} {
  let level = 1;
  while (level < MAX_LEVEL && totalXp >= xpForLevel(level + 1)) level++;
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const intoLevel = totalXp - base;
  const span = Math.max(1, next - base);
  return {
    level,
    intoLevel,
    toNext: next - totalXp,
    pct: level >= MAX_LEVEL ? 100 : Math.round((intoLevel / span) * 100),
  };
}

/** Recompensas base de XP por tipo de acción. */
export const XP_REWARDS = {
  WORKOUT_LOGGED: 30,
  METRIC_LOGGED: 10,
  ENGLISH_EXERCISE: 25,
  CODE_CHALLENGE: 40,
  JOURNAL_ENTRY: 15,
  READING_SESSION: 20,
  TASK_DONE: 10,
  HABIT_KEPT: 10,
  PROJECT_LOG: 15,
} as const;

export const RANKS = [
  { from: 1, name: 'Iniciado' },
  { from: 10, name: 'Aprendiz' },
  { from: 25, name: 'Constante' },
  { from: 45, name: 'Disciplinado' },
  { from: 65, name: 'Maestro' },
  { from: 85, name: 'Leyenda' },
] as const;

export function rankForLevel(level: number): string {
  return [...RANKS].reverse().find((r) => level >= r.from)?.name ?? 'Iniciado';
}
