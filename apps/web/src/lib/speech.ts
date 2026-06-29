import { useCallback, useRef, useState } from 'react';

/** Texto a voz (TTS). Lee el texto en voz alta en el idioma indicado. */
export function speak(text: string, lang = 'es-ES') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text.replace(/[*_#`>]/g, ''));
  u.lang = lang;
  u.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}

export const speechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();

/** Compara lo dicho con la frase objetivo. Devuelve 0-1 (proporción de palabras acertadas). */
export function matchScore(heard: string, target: string): number {
  const h = new Set(norm(heard).split(' '));
  const t = norm(target).split(' ').filter(Boolean);
  if (!t.length) return 0;
  const hit = t.filter((w) => h.has(w)).length;
  return hit / t.length;
}

/** Hook de reconocimiento de voz (Web Speech API). */
export function useSpeechRecognition(lang = 'en-US') {
  const [listening, setListening] = useState(false);
  const recRef = useRef<unknown>(null);
  const supported =
    typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const listen = useCallback(
    (onResult: (alternatives: string[]) => void) => {
      if (!supported) return;
      const w = window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown };
      const Ctor = (w.SpeechRecognition ?? w.webkitSpeechRecognition)!;
      const rec = new Ctor() as {
        lang: string; interimResults: boolean; maxAlternatives: number;
        onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
        onend: () => void; onerror: () => void; start: () => void;
      };
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      rec.onresult = (e) => {
        const alts = Array.from(e.results[0] as ArrayLike<{ transcript: string }>).map((r) => r.transcript);
        onResult(alts);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recRef.current = rec;
      rec.start();
      setListening(true);
    },
    [lang, supported],
  );

  return { supported, listening, listen };
}
