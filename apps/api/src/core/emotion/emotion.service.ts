import { prisma } from '../../lib/prisma.js';
import { bus } from '../bus/eventBus.js';

type EmotionScores = { motivation: number; stress: number; anxiety: number; frustration: number; joy: number };

// Léxico ligero (cimiento determinista, sin coste de IA). En producción se
// sustituye/combina con el AIProvider para mayor precisión.
const LEXICON: Record<keyof EmotionScores, string[]> = {
  motivation: ['logr', 'avanc', 'meta', 'orgullo', 'puedo', 'ganas', 'enfoc', 'disciplin', 'progreso'],
  stress: ['estres', 'estrés', 'presion', 'presión', 'agobi', 'saturad', 'tarde', 'urgente'],
  anxiety: ['ansie', 'nervios', 'miedo', 'preocup', 'inquiet', 'incertid'],
  frustration: ['frustr', 'rabia', 'enoj', 'no puedo', 'cansad', 'harto', 'fracas'],
  joy: ['feliz', 'content', 'alegr', 'disfrut', 'genial', 'gracias', 'bien'],
};

function score(text: string): EmotionScores {
  const t = text.toLowerCase();
  const out = {} as EmotionScores;
  (Object.keys(LEXICON) as (keyof EmotionScores)[]).forEach((k) => {
    const hits = LEXICON[k].reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
    out[k] = Math.min(100, hits * 35);
  });
  return out;
}

/** Analiza emoción de un texto, persiste y emite evento (alimenta Avatar + Memoria). */
export async function analyzeEmotion(params: { userId: string; text: string; source: 'JOURNAL' | 'VOICE' | 'CHAT' }) {
  const emotions = score(params.text);
  const valence = (emotions.joy + emotions.motivation - emotions.frustration - emotions.anxiety) / 100;
  const arousal = (emotions.stress + emotions.anxiety + emotions.motivation) / 150;

  await prisma.emotionLog.create({
    data: { userId: params.userId, source: params.source, emotions, valence, arousal },
  });

  const emotion = dominant(emotions, valence);
  bus.emit({ type: 'emotion.detected', userId: params.userId, source: params.source, valence, arousal, emotions });
  bus.emit({ type: 'avatar.state', userId: params.userId, emotion, intensity: Math.min(1, Math.abs(valence) + 0.3) });

  return { emotions, valence, arousal, emotion };
}

function dominant(e: EmotionScores, valence: number): string {
  const entries = Object.entries(e) as [keyof EmotionScores, number][];
  const top = entries.sort((a, b) => b[1] - a[1])[0];
  if (top[1] === 0) return valence >= 0 ? 'neutral' : 'concerned';
  return { motivation: 'determined', joy: 'happy', stress: 'tense', anxiety: 'worried', frustration: 'frustrated' }[top[0]];
}
