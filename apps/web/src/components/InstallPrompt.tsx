import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';

type BIPEvent = Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> };

const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true);

const isIOS = () => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() => (typeof localStorage !== 'undefined' && localStorage.getItem('renacer_install_dismissed') === '1'));
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    const onBIP = (e: Event) => { e.preventDefault(); setDeferred(e as BIPEvent); };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onBIP);
    window.addEventListener('appinstalled', onInstalled);
    return () => { window.removeEventListener('beforeinstallprompt', onBIP); window.removeEventListener('appinstalled', onInstalled); };
  }, []);

  if (installed || isStandalone() || dismissed) return null;
  // En iOS no existe beforeinstallprompt: ofrecemos instrucciones.
  const ios = isIOS();
  if (!deferred && !ios) return null;

  const dismiss = () => { setDismissed(true); try { localStorage.setItem('renacer_install_dismissed', '1'); } catch { /* noop */ } };
  const install = async () => {
    if (!deferred) { setIosHint(true); return; }
    deferred.prompt();
    try { await deferred.userChoice; } catch { /* noop */ }
    setDeferred(null);
  };

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="no-print fixed bottom-4 left-4 safe-bottom z-[65] w-[min(92vw,22rem)] rounded-2xl border border-brand-500/30 bg-white/90 dark:bg-ink-950/90 backdrop-blur-md p-4 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-ink-950 font-display font-extrabold shadow-glow">R</span>
          <div className="min-w-0">
            <p className="text-sm font-bold">Instala RENACER como app</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Acceso directo, pantalla completa y funciona offline. 📲</p>
          </div>
          <button onClick={dismiss} aria-label="Cerrar" className="ml-auto text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm">✕</button>
        </div>

        {iosHint && ios ? (
          <p className="mt-3 rounded-lg bg-brand-500/10 p-2.5 text-xs text-stone-600 dark:text-stone-300">
            En iPhone/iPad: toca <b>Compartir</b> <span className="font-semibold">⬆️</span> y luego <b>“Agregar a inicio”</b>.
          </p>
        ) : (
          <div className="mt-3 flex gap-2">
            <button onClick={install} className="flex-1 rounded-xl bg-brand-600 py-2 text-sm font-bold text-ink-950 hover:brightness-105">📲 Instalar</button>
            <button onClick={dismiss} className="rounded-xl border border-stone-200 dark:border-white/10 px-3 py-2 text-sm font-semibold">Ahora no</button>
          </div>
        )}
      </m.div>
    </AnimatePresence>
  );
}
