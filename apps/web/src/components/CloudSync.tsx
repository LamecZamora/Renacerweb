import { useEffect, useState } from 'react';
import { Card, Badge } from './ui';
import {
  onStatus, signInWithGoogle, signOutCloud, resolveConflict,
  type SyncState, type SyncUser,
} from '../lib/cloud';

const STATE_LABEL: Record<SyncState, string> = {
  idle: 'Sin sincronizar', syncing: 'Sincronizando…', synced: 'Sincronizado',
  pending: 'Cambios pendientes', offline: 'Sin conexión', error: 'Error al sincronizar',
};

// Pistas legibles para los errores de auth más comunes.
const ERROR_HINT: Record<string, string> = {
  'auth/operation-not-allowed': 'Activa Google en Firebase → Authentication → Sign-in method.',
  'auth/configuration-not-found': 'Authentication no está configurado en la consola (activa Google).',
  'auth/unauthorized-domain': 'Dominio no autorizado: Firebase → Authentication → Settings → Authorized domains.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana emergente. Permite pop-ups y reintenta.',
};

export default function CloudSync() {
  const [user, setUser] = useState<SyncUser | null>(null);
  const [state, setState] = useState<SyncState>('idle');
  const [lastSyncedAt, setLast] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onStatus((s) => { setUser(s.user); setState(s.state); setLast(s.lastSyncedAt); }), []);

  const handleSignIn = async () => {
    setBusy(true);
    setError(null);
    try {
      const outcome = await signInWithGoogle();
      if (outcome === 'ask') setConflict(true);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code ?? '';
      // Cerrar el popup a propósito no es un error.
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        console.error('[cloud sync] error de inicio de sesión:', e);
        const hint = ERROR_HINT[code];
        setError(hint ? `${code} — ${hint}` : (code || (e as Error)?.message || 'Error al iniciar sesión'));
      }
    } finally { setBusy(false); }
  };

  const choose = async (choice: 'local' | 'cloud') => {
    setBusy(true);
    try { await resolveConflict(choice); setConflict(false); }
    finally { setBusy(false); }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-2"><span>☁️</span><h3 className="font-bold">Sincronización en la nube</h3></div>

      {!user ? (
        <>
          <p className="text-sm text-stone-600 dark:text-stone-300 mb-3">
            Inicia sesión para guardar tu progreso en la nube y usarlo en otros dispositivos. La app sigue funcionando sin cuenta.
          </p>
          <button onClick={handleSignIn} disabled={busy}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-ink-950 disabled:opacity-50">
            {busy ? 'Conectando…' : 'Iniciar sesión con Google'}
          </button>
          {error && (
            <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-700 dark:text-red-300 break-words">{error}</p>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Sesión: <b>{user.email ?? 'cuenta Google'}</b>
            </p>
            <Badge tone={state === 'synced' ? 'green' : state === 'error' ? 'amber' : 'brand'}>{STATE_LABEL[state]}</Badge>
          </div>
          {lastSyncedAt && (
            <p className="text-xs text-stone-500 mt-1">Última sincronización: {new Date(lastSyncedAt).toLocaleString('es')}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => signOutCloud()} disabled={busy}
              className="rounded-xl bg-stone-200/70 dark:bg-white/10 px-3 py-2 text-sm font-semibold disabled:opacity-50">
              Cerrar sesión
            </button>
            <button onClick={() => { if (confirm('¿Cerrar sesión y BORRAR los datos de este dispositivo? Tu progreso en la nube se conserva.')) signOutCloud({ wipeLocal: true }); }}
              disabled={busy}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-500/10 disabled:opacity-50">
              Cerrar sesión y borrar de este dispositivo
            </button>
          </div>
        </>
      )}

      {conflict && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-sm font-semibold mb-2">Encontramos progreso en la nube y en este dispositivo.</p>
          <p className="text-xs text-stone-600 dark:text-stone-300 mb-3">¿Cuál quieres conservar? El otro se reemplaza.</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => choose('cloud')} disabled={busy}
              className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-ink-950 disabled:opacity-50">Usar el de la nube</button>
            <button onClick={() => choose('local')} disabled={busy}
              className="rounded-xl bg-stone-200/70 dark:bg-white/10 px-3 py-2 text-sm font-semibold disabled:opacity-50">Usar el de este dispositivo</button>
          </div>
        </div>
      )}
    </Card>
  );
}
