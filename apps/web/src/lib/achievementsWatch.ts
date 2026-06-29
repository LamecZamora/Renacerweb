import { computeStats } from './stats';
import { ACHIEVEMENTS } from '../data/achievements';
import { toast } from './toast';

const KEY = 'renacer_seen_achievements';

/** Compara los logros desbloqueados con los ya vistos y notifica los nuevos. */
export function checkAchievements() {
  const s = computeStats();
  const unlocked = ACHIEVEMENTS.filter((a) => a.get(s) >= a.goal);
  const unlockedIds = unlocked.map((a) => a.id);

  let seen: string[] = [];
  try { seen = JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { /* noop */ }

  // Primera vez: registra lo ya logrado en silencio (sin spamear).
  if (seen.length === 0) { localStorage.setItem(KEY, JSON.stringify(unlockedIds)); return; }

  const seenSet = new Set(seen);
  const fresh = unlocked.filter((a) => !seenSet.has(a.id));
  fresh.forEach((a) => toast(`🏆 Logro desbloqueado: ${a.title}`, 'achievement'));
  if (fresh.length) localStorage.setItem(KEY, JSON.stringify(unlockedIds));
}
