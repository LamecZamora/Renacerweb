import { useCallback, useEffect, useState } from 'react';

// ── Cuenta local (desde cero) ──
export type Profile = { name: string; goal: string; startWeight?: number; heightCm?: number; createdAt: string };

// ── Días activos / racha ──
const ACTIVE = 'renacer_active_days';
const today = () => new Date().toISOString().slice(0, 10);

export function markActive() {
  try {
    const days = new Set<string>(JSON.parse(localStorage.getItem(ACTIVE) ?? '[]'));
    if (!days.has(today())) {
      days.add(today());
      localStorage.setItem(ACTIVE, JSON.stringify([...days]));
    }
  } catch { /* noop */ }
}

export function getActiveDays(): string[] {
  try { return JSON.parse(localStorage.getItem(ACTIVE) ?? '[]'); } catch { return []; }
}

export function getStreak(): number {
  const days = new Set(getActiveDays());
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const cursor = new Date();
  if (!days.has(fmt(cursor))) cursor.setDate(cursor.getDate() - 1); // permite contar si hoy aún no
  let streak = 0;
  while (days.has(fmt(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getLongestStreak(): number {
  const days = [...new Set(getActiveDays())].sort();
  if (!days.length) return 0;
  let best = 1, cur = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) / 86_400_000);
    if (diff === 1) { cur++; best = Math.max(best, cur); } else if (diff > 1) { cur = 1; }
  }
  return best;
}

const PROFILE_KEY = 'renacer_profile';

export function getProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function clearAccount() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith('renacer_'))
    .forEach((k) => localStorage.removeItem(k));
}

/** Exporta todos los datos de la cuenta (renacer_*) a un objeto. */
export function exportAccount(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  Object.keys(localStorage)
    .filter((k) => k.startsWith('renacer_'))
    .forEach((k) => {
      try { data[k] = JSON.parse(localStorage.getItem(k) ?? 'null'); }
      catch { data[k] = localStorage.getItem(k); }
    });
  return data;
}

/** Restaura datos desde un backup (reemplaza la cuenta actual). */
export function importAccount(data: Record<string, unknown>) {
  clearAccount();
  Object.entries(data).forEach(([k, v]) => {
    if (k.startsWith('renacer_')) {
      localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  });
}

export function useProfile() {
  const [profile, setProfileState] = useState<Profile | null>(() => getProfile());
  const setProfile = (p: Profile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfileState(p);
  };
  const reset = () => {
    clearAccount();
    setProfileState(null);
  };
  return { profile, setProfile, reset };
}

// ── Progreso de ejercicios (set de ids completados por sección) ──
export function useProgress(namespace: string) {
  const key = `renacer_done_${namespace}`;
  const [done, setDone] = useState<Set<string>>(() => {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem(key) ?? '[]'));
    } catch {
      return new Set<string>();
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify([...done]));
  }, [key, done]);

  const toggle = useCallback((id: string) => {
    markActive();
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const complete = useCallback((id: string) => {
    markActive();
    setDone((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const isDone = useCallback((id: string) => done.has(id), [done]);

  return { done, toggle, complete, isDone, count: done.size };
}

/** Cuenta cuántos ids de una sección están completados (lectura simple, sin hook). */
export function countDone(namespace: string): number {
  try {
    return (JSON.parse(localStorage.getItem(`renacer_done_${namespace}`) ?? '[]') as string[]).length;
  } catch {
    return 0;
  }
}

// ── Listas persistentes por cuenta (diario, libros, proyectos, transacciones…) ──
export const uid = () => Math.random().toString(36).slice(2, 10);

export function readList<T>(namespace: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(`renacer_list_${namespace}`) ?? '[]') as T[];
  } catch {
    return [];
  }
}

export function useLocalList<T extends { id: string }>(namespace: string) {
  const key = `renacer_list_${namespace}`;
  const [items, setItems] = useState<T[]>(() => readList<T>(namespace));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [key, items]);

  const add = useCallback((item: T) => { markActive(); setItems((prev) => [item, ...prev]); }, []);
  const update = useCallback(
    (id: string, patch: Partial<T>) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it))),
    [],
  );
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((it) => it.id !== id)), []);

  return { items, add, update, remove };
}
