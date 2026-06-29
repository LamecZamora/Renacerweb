// Habilidades que se forman SOLAS a partir del progreso real de cursos + inglés.
import { COURSES } from '../data/courses';
import { courseProgress, learningDone } from './learning';
import { countDone } from './storage';
import { ENGLISH_TOTAL, SPEAKING_TOTAL } from '../data/english';

export type Skill = { name: string; pct: number; level: string; icon?: string; color?: string };

export function skillLevelLabel(p: number): string {
  if (p >= 90) return 'Experto';
  if (p >= 65) return 'Avanzado';
  if (p >= 35) return 'Intermedio';
  return 'Básico';
}

/** Mapea el % de inglés a un nivel CEFR aproximado (A1–C2). */
export function englishCEFR(p: number): string {
  if (p >= 92) return 'C2';
  if (p >= 75) return 'C1';
  if (p >= 55) return 'B2';
  if (p >= 35) return 'B1';
  if (p >= 15) return 'A2';
  return 'A1';
}

/** Devuelve tus habilidades (cursos con progreso + inglés), ordenadas de mayor a menor. */
export function autoSkills(done: Set<string> = learningDone()): Skill[] {
  const out: Skill[] = [];
  for (const c of COURSES) {
    const pct = courseProgress(c, done).pct;
    if (pct > 0) out.push({ name: c.name, pct, level: skillLevelLabel(pct), icon: c.icon, color: c.color });
  }
  const engPct = Math.min(100, Math.round((countDone('english') / (ENGLISH_TOTAL + SPEAKING_TOTAL)) * 100));
  if (engPct > 0) out.push({ name: 'Inglés', pct: engPct, level: englishCEFR(engPct), icon: '🗣', color: '#0ea5e9' });
  return out.sort((a, b) => b.pct - a.pct);
}
