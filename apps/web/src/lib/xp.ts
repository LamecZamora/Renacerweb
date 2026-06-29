// Sistema de XP y niveles: curva creciente (cada nivel cuesta más) + tope de XP por día.
// La XP de TODA tu actividad cuenta, pero cada día solo puedes ganar hasta DAILY_CAP,
// para que no sea grindear lo mismo todo el día. El progreso pasado se respeta al iniciar.

const KEY = 'renacer_xp';
const STEP = 10;            // empinado de la curva
export const DAILY_CAP = 100; // XP máxima por día

// ── Meta diaria (estilo Duolingo) ──
const GOAL_KEY = 'renacer_daily_goal';
export const GOAL_OPTIONS = [
  { id: 'relajado', label: 'Relajado', xp: 20 },
  { id: 'normal', label: 'Normal', xp: 40 },
  { id: 'serio', label: 'Serio', xp: 60 },
  { id: 'intenso', label: 'Intenso', xp: 100 },
];
export function getDailyGoal(): number {
  try { return Number(localStorage.getItem(GOAL_KEY)) || 40; } catch { return 40; }
}
export function setDailyGoal(n: number) {
  try { localStorage.setItem(GOAL_KEY, String(n)); } catch { /* noop */ }
}

/** XP acumulada necesaria para ALCANZAR el nivel L (curva triangular: cada nivel cuesta más). */
export function xpForLevel(L: number): number {
  return (STEP * L * (L - 1)) / 2;
}

export function levelFromXP(total: number): { level: number; intoLevel: number; needed: number } {
  let L = 1;
  while (xpForLevel(L + 1) <= total) L++;
  const base = xpForLevel(L);
  return { level: L, intoLevel: Math.floor(total - base), needed: STEP * L };
}

type Ledger = { effective: number; lastRaw: number; day: string; today: number };
const todayStr = () => new Date().toISOString().slice(0, 10);

export type XPState = { total: number; level: number; intoLevel: number; needed: number; today: number; cap: number };

/** Reconcilia el "XP bruto" (derivado de tu actividad) aplicando el tope diario. */
export function reconcileXP(raw: number): XPState {
  let l: Ledger | null = null;
  try { l = JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch { /* noop */ }
  const day = todayStr();

  if (!l) {
    // Primera vez: respeta TODO tu progreso pasado (sin tope). El tope aplica de aquí en adelante.
    l = { effective: raw, lastRaw: raw, day, today: 0 };
  } else {
    if (l.day !== day) { l.day = day; l.today = 0; }
    const delta = Math.max(0, raw - l.lastRaw);              // XP nueva desde la última vez
    const grant = Math.min(delta, Math.max(0, DAILY_CAP - l.today)); // limitada por el tope diario
    l.effective += grant;
    l.today += grant;
    l.lastRaw = raw;
  }
  try { localStorage.setItem(KEY, JSON.stringify(l)); } catch { /* noop */ }

  const lv = levelFromXP(l.effective);
  return { total: Math.floor(l.effective), level: lv.level, intoLevel: lv.intoLevel, needed: lv.needed, today: Math.floor(l.today), cap: DAILY_CAP };
}
