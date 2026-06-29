// Cliente de IA para el frontend (estilo Character.AI).
// Llama a Claude directo desde el navegador con la API key del usuario,
// guardada SOLO en su navegador (localStorage). Sin key → modo demo.

const KEY = 'renacer_anthropic_key';
const MODEL = 'renacer_model';

export const getKey = () => localStorage.getItem(KEY) ?? '';
export const setKey = (k: string) => (k ? localStorage.setItem(KEY, k) : localStorage.removeItem(KEY));
export const hasKey = () => !!getKey();

export const getModel = () => localStorage.getItem(MODEL) ?? 'claude-opus-4-8';
export const setModel = (m: string) => localStorage.setItem(MODEL, m);

export const MODELS = [
  { id: 'claude-opus-4-8', name: 'Opus 4.8 (más capaz)' },
  { id: 'claude-sonnet-4-6', name: 'Sonnet 4.6 (equilibrado)' },
  { id: 'claude-haiku-4-5', name: 'Haiku 4.5 (rápido y barato)' },
];

export type ChatMsg = { role: 'user' | 'assistant'; content: string };

export async function chatWithCharacter(persona: string, history: ChatMsg[]): Promise<string> {
  const key = getKey();
  if (!key) {
    const last = history.filter((m) => m.role === 'user').slice(-1)[0]?.content ?? '';
    return `(modo demo) Me dijiste: “${last.slice(0, 70)}”. Agrega tu API key de Anthropic arriba para que pueda responderte de verdad y en personaje.`;
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: getModel(),
        max_tokens: 1024,
        system: persona,
        messages: history.slice(-20),
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      if (res.status === 401) return '⚠ API key inválida. Revísala en la configuración de arriba.';
      return `⚠ Error de la API (${res.status}). ${t.slice(0, 140)}`;
    }
    const data = await res.json();
    const block = (data.content as { type: string; text?: string }[] | undefined)?.find((b) => b.type === 'text');
    return block?.text ?? '(sin respuesta)';
  } catch (e) {
    return '⚠ No pude conectar con la IA. ' + (e instanceof Error ? e.message : '');
  }
}
