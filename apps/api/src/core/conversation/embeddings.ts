// Embeddings para memoria semántica.
// Cimiento determinista (hashing bag-of-words → vector fijo) que funciona SIN
// proveedor externo. Interfaz lista para sustituir por embeddings reales
// (OpenAI/Anthropic) + pgvector en producción.

const DIM = 128;

function hashToken(token: string): number {
  let h = 2166136261;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function embed(text: string): number[] {
  const vec = new Array(DIM).fill(0);
  const tokens = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  for (const t of tokens) {
    vec[hashToken(t) % DIM] += 1;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

export function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // ambos vectores ya están normalizados
}
