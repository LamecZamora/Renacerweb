import { exportAccount, importAccount } from './storage';
import { firebaseConfig } from './firebaseConfig';
import { SyncEngine, type ReconcileResult } from './sync/engine';
import type { AccountData, AccountPort, CloudDoc, CloudStore } from './sync/types';

const UPDATED = 'renacer_updatedAt';
const SYNCED = 'renacer_lastSyncedAt';
const ACTIVE_FLAG = '__cloud_active'; // fuera del prefijo renacer_ : NO se sincroniza ni dispara push

// setItem original (sin parchear) para escrituras internas.
const rawSetItem = localStorage.setItem.bind(localStorage);

let isSyncing = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

// ── Puerto local sobre localStorage ──
function localHasData(): boolean {
  return Object.keys(localStorage).some((k) => k.startsWith('renacer_') && k !== UPDATED && k !== SYNCED);
}
function numOr(key: string): number | null {
  const v = localStorage.getItem(key);
  return v ? Number(v) : null;
}

const accountPort: AccountPort = {
  read() {
    return {
      data: exportAccount() as AccountData,
      hasData: localHasData(),
      updatedAt: numOr(UPDATED),
      lastSyncedAt: numOr(SYNCED),
    };
  },
  write(data, syncedAt) {
    isSyncing = true;
    try {
      importAccount(data as Record<string, unknown>);
      rawSetItem(UPDATED, String(syncedAt));
      rawSetItem(SYNCED, String(syncedAt));
    } finally {
      isSyncing = false;
    }
  },
  markSynced(syncedAt) {
    rawSetItem(SYNCED, String(syncedAt));
  },
};

// ── Etiqueta de dispositivo (automática) ──
function deviceLabel(): string {
  const ua = navigator.userAgent;
  const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android'
    : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'Web';
  const browser = /Edg/.test(ua) ? 'Edge' : /Chrome/.test(ua) ? 'Chrome'
    : /Firefox/.test(ua) ? 'Firefox' : /Safari/.test(ua) ? 'Safari' : 'Navegador';
  return `${browser} · ${os}`;
}

// ── Estado de sync observable ──
export type SyncUser = { uid: string; email: string | null };
export type SyncState = 'idle' | 'syncing' | 'synced' | 'pending' | 'offline' | 'error';
type Status = { user: SyncUser | null; state: SyncState; lastSyncedAt: number | null };

let status: Status = { user: null, state: 'idle', lastSyncedAt: numOr(SYNCED) };
const listeners = new Set<(s: Status) => void>();
function setStatus(patch: Partial<Status>) {
  status = { ...status, ...patch };
  listeners.forEach((l) => l(status));
}
export function onStatus(cb: (s: Status) => void): () => void {
  listeners.add(cb);
  cb(status);
  return () => listeners.delete(cb);
}

// ── Firebase lazy ──
type Fb = {
  auth: import('firebase/auth').Auth;
  db: import('firebase/firestore').Firestore;
  provider: import('firebase/auth').GoogleAuthProvider;
  fns: typeof import('firebase/auth');
  store: typeof import('firebase/firestore');
};
let fbPromise: Promise<Fb> | null = null;
async function getFb(): Promise<Fb> {
  if (!fbPromise) {
    fbPromise = (async () => {
      const app = await import('firebase/app');
      const fns = await import('firebase/auth');
      const store = await import('firebase/firestore');
      const a = app.initializeApp(firebaseConfig);
      return {
        auth: fns.getAuth(a),
        db: store.getFirestore(a),
        provider: new fns.GoogleAuthProvider(),
        fns,
        store,
      };
    })();
  }
  return fbPromise;
}

// ── CloudStore real (Firestore) ──
async function makeCloudStore(): Promise<CloudStore> {
  const fb = await getFb();
  const { doc, getDoc, setDoc } = fb.store;
  return {
    async get(uid) {
      const snap = await getDoc(doc(fb.db, 'users', uid));
      return snap.exists() ? (snap.data() as CloudDoc) : null;
    },
    async set(uid, d) {
      await setDoc(doc(fb.db, 'users', uid), d);
    },
  };
}

let engine: SyncEngine | null = null;
let currentUid: string | null = null;

// ── Push con debounce (al detectar cambios) ──
function schedulePush() {
  if (!currentUid || !engine) return;
  setStatus({ state: 'pending' });
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    if (!currentUid || !engine) return;
    try {
      setStatus({ state: 'syncing' });
      await engine.push(currentUid, deviceLabel());
      setStatus({ state: 'synced', lastSyncedAt: numOr(SYNCED) });
    } catch {
      setStatus({ state: navigator.onLine ? 'error' : 'offline' });
    }
  }, 3000);
}

// Parche central: detecta escrituras renacer_* y agenda push.
function patchSetItem() {
  const patched = (key: string, value: string) => {
    rawSetItem(key, value);
    if (isSyncing) return;
    if (key.startsWith('renacer_') && key !== UPDATED && key !== SYNCED) {
      rawSetItem(UPDATED, String(Date.now()));
      schedulePush();
    }
  };
  localStorage.setItem = patched as typeof localStorage.setItem;
}

// ── API pública ──
export type ReconcileOutcome = ReconcileResult;

export async function signInWithGoogle(): Promise<ReconcileOutcome> {
  const fb = await getFb();
  const cred = await fb.fns.signInWithPopup(fb.auth, fb.provider);
  return afterAuth({ uid: cred.user.uid, email: cred.user.email });
}

async function afterAuth(user: SyncUser): Promise<ReconcileOutcome> {
  currentUid = user.uid;
  rawSetItem(ACTIVE_FLAG, '1'); // recordar que hay sesión (para restaurarla al recargar)
  const cloud = await makeCloudStore();
  engine = new SyncEngine(cloud, accountPort);
  setStatus({ user, state: 'syncing' });
  const outcome = await engine.reconcile(user.uid, deviceLabel());
  if (outcome === 'pulled') { location.reload(); return outcome; } // reflejar datos bajados
  setStatus({ state: outcome === 'ask' ? 'pending' : 'synced', lastSyncedAt: numOr(SYNCED) });
  return outcome;
}

export async function resolveConflict(choice: 'local' | 'cloud'): Promise<void> {
  if (!engine || !currentUid) return;
  setStatus({ state: 'syncing' });
  await engine.resolveConflict(currentUid, deviceLabel(), choice);
  if (choice === 'cloud') { location.reload(); return; } // reflejar datos importados
  setStatus({ state: 'synced', lastSyncedAt: numOr(SYNCED) });
}

export async function signOutCloud(opts?: { wipeLocal?: boolean }): Promise<void> {
  const fb = await getFb();
  await fb.fns.signOut(fb.auth);
  currentUid = null;
  engine = null;
  localStorage.removeItem(ACTIVE_FLAG);
  if (opts?.wipeLocal) {
    isSyncing = true;
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('renacer_')).forEach((k) => localStorage.removeItem(k));
    } finally { isSyncing = false; }
    location.reload();
    return;
  }
  setStatus({ user: null, state: 'idle' });
}

// Restaurar sesión y escuchar cambios de auth al cargar la app.
export function initCloud(): void {
  patchSetItem();
  window.addEventListener('focus', () => {
    if (currentUid && engine) {
      engine.reconcile(currentUid, deviceLabel())
        .then((o) => {
          if (o === 'pulled') { location.reload(); return; }
          setStatus({ state: o === 'ask' ? 'pending' : 'synced', lastSyncedAt: numOr(SYNCED) });
        })
        .catch(() => setStatus({ state: navigator.onLine ? 'error' : 'offline' }));
    }
  });
  // Solo carga Firebase si el usuario ya había iniciado sesión (preserva el lazy-load
  // para quienes no usan sync: nunca descargan el SDK).
  if (!localStorage.getItem(ACTIVE_FLAG)) return;
  getFb().then((fb) => {
    fb.fns.onAuthStateChanged(fb.auth, (u) => {
      if (u && u.uid !== currentUid) {
        afterAuth({ uid: u.uid, email: u.email }).catch(() => setStatus({ state: 'error' }));
      } else if (!u) {
        localStorage.removeItem(ACTIVE_FLAG);
      }
    });
  }).catch(() => { /* offline: sin sync, la app sigue local */ });
}
