import { useEffect, useState } from 'react';

/** Lee un texto en voz alta (para quien aprende escuchando). Usa la voz del navegador. */
export default function ListenButton({ text, lang = 'es-MX', label = 'Escuchar' }: { text: string; lang?: string; label?: string }) {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);

  if (!supported) return null;

  const toggle = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.96;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  return (
    <button onClick={toggle}
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${speaking ? 'bg-red-500/15 text-red-500' : 'bg-brand-500/15 text-brand-700 dark:text-brand-400 hover:bg-brand-500/25'}`}>
      {speaking ? '⏹ Detener' : `🔊 ${label}`}
    </button>
  );
}
