// Cliente API mínimo para hablar con Core IA. Maneja el token JWT en localStorage.
const BASE = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://localhost:4000/api/v1';

let token: string | null = localStorage.getItem('renacer_token');

export function setToken(t: string | null) {
  token = t;
  if (t) localStorage.setItem('renacer_token', t);
  else localStorage.removeItem('renacer_token');
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()).data as T;
}

export type ChatResult = {
  conversationId: string;
  reply: string;
  emotion: string;
  valence: number;
  intent: string;
  memoriesUsed: number;
};
