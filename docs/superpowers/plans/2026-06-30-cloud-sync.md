# Sincronización en la nube — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir login opcional con Google que sincroniza la cuenta completa (`renacer_*`) entre dispositivos vía Firestore, sin romper el modelo local-first.

**Architecture:** La lógica pura de decisión (`decideSync`) y la orquestación (`SyncEngine`) se aíslan detrás de puertos (`CloudStore`, `AccountPort`) para poder testearlas con *fakes* en memoria. `lib/cloud.ts` cablea las implementaciones reales (Firebase Auth + Firestore, cargado lazy) y detecta cambios parcheando `localStorage.setItem` en un solo lugar. La UI vive en `components/CloudSync.tsx`, dentro de Ajustes.

**Tech Stack:** React 18 + TypeScript + Vite · Vitest (nuevo) · Firebase v10 (auth + firestore, import dinámico).

---

## Estructura de archivos

| Archivo | Responsabilidad |
|---|---|
| `apps/web/vitest.config.ts` | Config de Vitest (entorno node para lógica pura). |
| `apps/web/src/lib/sync/types.ts` | Tipos e interfaces de puertos (`CloudStore`, `AccountPort`, `CloudDoc`, metas). |
| `apps/web/src/lib/sync/decideSync.ts` | Función pura de decisión. |
| `apps/web/src/lib/sync/decideSync.test.ts` | Tests de `decideSync`. |
| `apps/web/src/lib/sync/engine.ts` | `SyncEngine`: orquesta reconcile/push/resolveConflict usando los puertos. |
| `apps/web/src/lib/sync/engine.test.ts` | Tests de `SyncEngine` con *fakes*. |
| `apps/web/src/lib/firebaseConfig.ts` | Config pública del proyecto `renacer-55078`. |
| `apps/web/src/lib/cloud.ts` | Cableado real: Firebase lazy, `FirestoreCloudStore`, `LocalAccountPort`, parche de `setItem`, auth, push con debounce, pull al enfocar. |
| `apps/web/src/components/CloudSync.tsx` | UI de login/estado/cerrar sesión (en Ajustes). |
| `apps/web/src/pages/Settings.tsx` | Modificar: montar `<CloudSync />`. |
| `apps/web/firestore.rules` | Reglas de seguridad (referencia + para la consola). |

---

## Task 1: Instalar dependencias y configurar Vitest

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/src/lib/sync/smoke.test.ts` (temporal)

- [ ] **Step 1: Instalar dependencias**

Run:
```bash
cd apps/web
npm install firebase
npm install -D vitest
```
Expected: se agregan `firebase` a dependencies y `vitest` a devDependencies.

- [ ] **Step 2: Añadir script de test en package.json**

En `apps/web/package.json`, dentro de `"scripts"`, agregar:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Crear vitest.config.ts**

Create `apps/web/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Crear un test de humo**

Create `apps/web/src/lib/sync/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Correr y verificar que pasa**

Run: `npm test`
Expected: 1 test pasa (`smoke > runs`).

- [ ] **Step 6: Borrar el test de humo y commitear**

```bash
rm src/lib/sync/smoke.test.ts
git add apps/web/package.json apps/web/package-lock.json apps/web/vitest.config.ts
git commit -m "chore: configura Vitest e instala firebase"
```

---

## Task 2: Tipos e interfaces de sincronización

**Files:**
- Create: `apps/web/src/lib/sync/types.ts`

- [ ] **Step 1: Crear los tipos**

Create `apps/web/src/lib/sync/types.ts`:
```ts
// Datos de la cuenta serializada (salida de exportAccount()).
export type AccountData = Record<string, unknown>;

// Metadatos del estado local.
export type LocalMeta = {
  hasData: boolean;
  updatedAt: number | null;    // ms epoch del último cambio local
  lastSyncedAt: number | null; // ms epoch de la última sync exitosa
};

// Metadatos del estado en la nube.
export type CloudMeta = {
  exists: boolean;
  updatedAt: number | null;
};

export type SyncDecision = 'push' | 'pull' | 'ask' | 'noop';

// Documento tal como se guarda en Firestore.
export type CloudDoc = {
  data: AccountData;
  updatedAt: number;
  device: string;
};

// Puerto hacia el almacén remoto (Firestore en producción, fake en tests).
export interface CloudStore {
  get(uid: string): Promise<CloudDoc | null>;
  set(uid: string, doc: CloudDoc): Promise<void>;
}

// Puerto hacia la cuenta local (localStorage en producción, fake en tests).
export interface AccountPort {
  read(): { data: AccountData } & LocalMeta;
  write(data: AccountData, syncedAt: number): void; // importa + fija updatedAt y lastSyncedAt
  markSynced(syncedAt: number): void;               // tras un push exitoso
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/sync/types.ts
git commit -m "feat(sync): tipos e interfaces de sincronización"
```

---

## Task 3: Función pura `decideSync` (TDD)

**Files:**
- Create: `apps/web/src/lib/sync/decideSync.test.ts`
- Create: `apps/web/src/lib/sync/decideSync.ts`

- [ ] **Step 1: Escribir los tests que fallan**

Create `apps/web/src/lib/sync/decideSync.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { decideSync } from './decideSync';

describe('decideSync', () => {
  it('nube no existe y local vacío → noop', () => {
    expect(decideSync({ hasData: false, updatedAt: null, lastSyncedAt: null }, { exists: false, updatedAt: null }))
      .toBe('noop');
  });

  it('nube no existe y local con datos → push', () => {
    expect(decideSync({ hasData: true, updatedAt: 100, lastSyncedAt: null }, { exists: false, updatedAt: null }))
      .toBe('push');
  });

  it('nube existe y local vacío → pull', () => {
    expect(decideSync({ hasData: false, updatedAt: null, lastSyncedAt: null }, { exists: true, updatedAt: 200 }))
      .toBe('pull');
  });

  it('ambos con datos, nube más nueva y local sin cambios desde el sync → pull', () => {
    expect(decideSync({ hasData: true, updatedAt: 100, lastSyncedAt: 100 }, { exists: true, updatedAt: 200 }))
      .toBe('pull');
  });

  it('ambos con datos, local cambió y nube no → push', () => {
    expect(decideSync({ hasData: true, updatedAt: 300, lastSyncedAt: 200 }, { exists: true, updatedAt: 200 }))
      .toBe('push');
  });

  it('ambos cambiaron desde el último sync → ask', () => {
    expect(decideSync({ hasData: true, updatedAt: 300, lastSyncedAt: 100 }, { exists: true, updatedAt: 250 }))
      .toBe('ask');
  });

  it('ambos con datos e iguales → noop', () => {
    expect(decideSync({ hasData: true, updatedAt: 200, lastSyncedAt: 200 }, { exists: true, updatedAt: 200 }))
      .toBe('noop');
  });
});
```

- [ ] **Step 2: Correr para ver que falla**

Run: `npm test -- decideSync`
Expected: FAIL con "Cannot find module './decideSync'".

- [ ] **Step 3: Implementar la función**

Create `apps/web/src/lib/sync/decideSync.ts`:
```ts
import type { LocalMeta, CloudMeta, SyncDecision } from './types';

export function decideSync(local: LocalMeta, cloud: CloudMeta): SyncDecision {
  if (!cloud.exists) return local.hasData ? 'push' : 'noop';
  if (!local.hasData) return 'pull';

  const base = local.lastSyncedAt ?? 0;
  const localChanged = (local.updatedAt ?? 0) > base;
  const cloudChanged = (cloud.updatedAt ?? 0) > base;
  if (localChanged && cloudChanged) return 'ask';

  const localAt = local.updatedAt ?? 0;
  const cloudAt = cloud.updatedAt ?? 0;
  if (cloudAt > localAt) return 'pull';
  if (localAt > cloudAt) return 'push';
  return 'noop';
}
```

- [ ] **Step 4: Correr para ver que pasa**

Run: `npm test -- decideSync`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/sync/decideSync.ts apps/web/src/lib/sync/decideSync.test.ts
git commit -m "feat(sync): decideSync con TDD (7 escenarios)"
```

---

## Task 4: `SyncEngine` con puertos (TDD con fakes)

**Files:**
- Create: `apps/web/src/lib/sync/engine.test.ts`
- Create: `apps/web/src/lib/sync/engine.ts`

- [ ] **Step 1: Escribir los tests que fallan**

Create `apps/web/src/lib/sync/engine.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { SyncEngine } from './engine';
import type { AccountData, AccountPort, CloudDoc, CloudStore, LocalMeta } from './types';

class FakeCloud implements CloudStore {
  docs = new Map<string, CloudDoc>();
  async get(uid: string) { return this.docs.get(uid) ?? null; }
  async set(uid: string, doc: CloudDoc) { this.docs.set(uid, doc); }
}

class FakeAccount implements AccountPort {
  data: AccountData;
  meta: LocalMeta;
  constructor(data: AccountData, meta: LocalMeta) { this.data = data; this.meta = meta; }
  read() { return { data: this.data, ...this.meta }; }
  write(data: AccountData, syncedAt: number) {
    this.data = data;
    this.meta = { hasData: Object.keys(data).length > 0, updatedAt: syncedAt, lastSyncedAt: syncedAt };
  }
  markSynced(syncedAt: number) { this.meta = { ...this.meta, lastSyncedAt: syncedAt }; }
}

describe('SyncEngine', () => {
  let cloud: FakeCloud;
  beforeEach(() => { cloud = new FakeCloud(); });

  it('sube cuando la nube está vacía y hay datos locales', async () => {
    const acc = new FakeAccount({ renacer_x: 1 }, { hasData: true, updatedAt: 100, lastSyncedAt: null });
    const engine = new SyncEngine(cloud, acc);
    const r = await engine.reconcile('u1', 'testdev');
    expect(r).toBe('pushed');
    expect(cloud.docs.get('u1')?.data).toEqual({ renacer_x: 1 });
    expect(acc.read().lastSyncedAt).toBe(100);
  });

  it('baja cuando local está vacío y la nube tiene datos', async () => {
    cloud.docs.set('u1', { data: { renacer_y: 2 }, updatedAt: 500, device: 'other' });
    const acc = new FakeAccount({}, { hasData: false, updatedAt: null, lastSyncedAt: null });
    const engine = new SyncEngine(cloud, acc);
    const r = await engine.reconcile('u1', 'testdev');
    expect(r).toBe('pulled');
    expect(acc.read().data).toEqual({ renacer_y: 2 });
    expect(acc.read().lastSyncedAt).toBe(500);
  });

  it('devuelve ask cuando ambos cambiaron desde el último sync', async () => {
    cloud.docs.set('u1', { data: { renacer_y: 2 }, updatedAt: 250, device: 'other' });
    const acc = new FakeAccount({ renacer_x: 1 }, { hasData: true, updatedAt: 300, lastSyncedAt: 100 });
    const engine = new SyncEngine(cloud, acc);
    const r = await engine.reconcile('u1', 'testdev');
    expect(r).toBe('ask');
  });

  it('resolveConflict("cloud") importa los datos de la nube', async () => {
    cloud.docs.set('u1', { data: { renacer_y: 2 }, updatedAt: 250, device: 'other' });
    const acc = new FakeAccount({ renacer_x: 1 }, { hasData: true, updatedAt: 300, lastSyncedAt: 100 });
    const engine = new SyncEngine(cloud, acc);
    await engine.resolveConflict('u1', 'testdev', 'cloud');
    expect(acc.read().data).toEqual({ renacer_y: 2 });
  });

  it('resolveConflict("local") sube los datos locales', async () => {
    cloud.docs.set('u1', { data: { renacer_y: 2 }, updatedAt: 250, device: 'other' });
    const acc = new FakeAccount({ renacer_x: 1 }, { hasData: true, updatedAt: 300, lastSyncedAt: 100 });
    const engine = new SyncEngine(cloud, acc);
    await engine.resolveConflict('u1', 'testdev', 'local');
    expect(cloud.docs.get('u1')?.data).toEqual({ renacer_x: 1 });
  });
});
```

- [ ] **Step 2: Correr para ver que falla**

Run: `npm test -- engine`
Expected: FAIL con "Cannot find module './engine'".

- [ ] **Step 3: Implementar el engine**

Create `apps/web/src/lib/sync/engine.ts`:
```ts
import { decideSync } from './decideSync';
import type { AccountPort, CloudStore } from './types';

export type ReconcileResult = 'pushed' | 'pulled' | 'ask' | 'noop';

export class SyncEngine {
  constructor(private cloud: CloudStore, private account: AccountPort) {}

  async reconcile(uid: string, device: string): Promise<ReconcileResult> {
    const local = this.account.read();
    const cloudDoc = await this.cloud.get(uid);
    const decision = decideSync(
      { hasData: local.hasData, updatedAt: local.updatedAt, lastSyncedAt: local.lastSyncedAt },
      { exists: !!cloudDoc, updatedAt: cloudDoc?.updatedAt ?? null },
    );

    if (decision === 'pull' && cloudDoc) {
      this.account.write(cloudDoc.data, cloudDoc.updatedAt);
      return 'pulled';
    }
    if (decision === 'push') {
      await this.push(uid, device);
      return 'pushed';
    }
    if (decision === 'ask') return 'ask';
    return 'noop';
  }

  async push(uid: string, device: string): Promise<void> {
    const local = this.account.read();
    const updatedAt = local.updatedAt ?? Date.now();
    await this.cloud.set(uid, { data: local.data, updatedAt, device });
    this.account.markSynced(updatedAt);
  }

  async resolveConflict(uid: string, device: string, choice: 'local' | 'cloud'): Promise<void> {
    if (choice === 'cloud') {
      const cloudDoc = await this.cloud.get(uid);
      if (cloudDoc) this.account.write(cloudDoc.data, cloudDoc.updatedAt);
    } else {
      await this.push(uid, device);
    }
  }
}
```

- [ ] **Step 4: Correr para ver que pasa**

Run: `npm test -- engine`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/sync/engine.ts apps/web/src/lib/sync/engine.test.ts
git commit -m "feat(sync): SyncEngine (reconcile/push/resolveConflict) con TDD"
```

---

## Task 5: Config de Firebase y reglas de Firestore

**Files:**
- Create: `apps/web/src/lib/firebaseConfig.ts`
- Create: `apps/web/firestore.rules`

- [ ] **Step 1: Crear la config pública**

Create `apps/web/src/lib/firebaseConfig.ts`:
```ts
// Config pública del proyecto Firebase (la web API key NO es secreta).
export const firebaseConfig = {
  apiKey: 'AIzaSyCiMfWSUX8aSBB-1xQmmTzVZ9KTRPSwXxM',
  authDomain: 'renacer-55078.firebaseapp.com',
  projectId: 'renacer-55078',
  storageBucket: 'renacer-55078.firebasestorage.app',
  messagingSenderId: '212663743927',
  appId: '1:212663743927:web:2bcdbce54935a1351c6432',
};
```

- [ ] **Step 2: Crear el archivo de reglas**

Create `apps/web/firestore.rules`:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/firebaseConfig.ts apps/web/firestore.rules
git commit -m "feat(sync): config pública de Firebase y reglas de Firestore"
```

---

## Task 6: Cableado real en `lib/cloud.ts`

**Files:**
- Create: `apps/web/src/lib/cloud.ts`

Este módulo es integración (Firebase real); se verifica con typecheck/build y prueba manual E2E, no con unit tests.

- [ ] **Step 1: Implementar cloud.ts**

Create `apps/web/src/lib/cloud.ts`:
```ts
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
```

- [ ] **Step 2: Verificar typecheck**

Run: `cd apps/web && npx tsc --noEmit`
Expected: EXIT 0 (sin errores de tipos).

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/cloud.ts
git commit -m "feat(sync): cableado real con Firebase (auth + firestore lazy)"
```

---

## Task 7: UI de sincronización en Ajustes

**Files:**
- Create: `apps/web/src/components/CloudSync.tsx`
- Modify: `apps/web/src/pages/Settings.tsx`
- Modify: `apps/web/src/main.tsx`

- [ ] **Step 1: Crear el componente**

Create `apps/web/src/components/CloudSync.tsx`:
```tsx
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

export default function CloudSync() {
  const [user, setUser] = useState<SyncUser | null>(null);
  const [state, setState] = useState<SyncState>('idle');
  const [lastSyncedAt, setLast] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [conflict, setConflict] = useState(false);

  useEffect(() => onStatus((s) => { setUser(s.user); setState(s.state); setLast(s.lastSyncedAt); }), []);

  const handleSignIn = async () => {
    setBusy(true);
    try {
      const outcome = await signInWithGoogle();
      if (outcome === 'ask') setConflict(true);
    } catch {
      /* popup cancelado/bloqueado: no pasa nada, sigue local */
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
```

- [ ] **Step 2: Montar `initCloud()` al arrancar**

En `apps/web/src/main.tsx`, después de `initTheme();`, agregar:
```ts
import { initCloud } from './lib/cloud';
// ...
initCloud();
```
(Colocar el import junto a los demás imports y la llamada `initCloud();` justo después de `initTheme();`.)

- [ ] **Step 3: Montar `<CloudSync />` en Ajustes**

En `apps/web/src/pages/Settings.tsx`, importar y renderizar el componente cerca del inicio del contenido:
```tsx
import CloudSync from '../components/CloudSync';
```
Y dentro del JSX de la página (por ejemplo, como primera tarjeta del contenido), agregar:
```tsx
<div className="mb-6"><CloudSync /></div>
```

- [ ] **Step 4: Verificar typecheck y build**

Run: `cd apps/web && npx tsc --noEmit && npm run build`
Expected: EXIT 0, build genera `dist/` sin errores.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/CloudSync.tsx apps/web/src/pages/Settings.tsx apps/web/src/main.tsx
git commit -m "feat(sync): UI de sincronización en Ajustes + init en arranque"
```

---

## Task 8: Configuración en la consola de Firebase (manual) y verificación E2E

**Files:** ninguno (pasos en consola + prueba manual)

- [ ] **Step 1: Activar Google Auth**

En [console.firebase.google.com](https://console.firebase.google.com) → proyecto `renacer-55078` → Authentication → Sign-in method → habilitar **Google** → guardar.

- [ ] **Step 2: Crear Firestore y aplicar reglas**

Firestore Database → Crear base de datos (modo producción, región cercana) → pestaña **Rules** → pegar el contenido de `apps/web/firestore.rules` → Publicar.

- [ ] **Step 3: Verificar dominios autorizados**

Authentication → Settings → Authorized domains → confirmar que estén `localhost` y `renacer-55078.web.app` (agregar si falta).

- [ ] **Step 4: Prueba E2E manual**

1. `cd apps/web && npm run dev`.
2. En una **ventana normal** de Chrome: abre la app, ve a Ajustes → "Iniciar sesión con Google". Debe decir "Sincronizado".
3. En una **ventana de incógnito** (localStorage vacío): abre la app, inicia sesión con la **misma** cuenta. Debe **bajar** tu progreso (Nivel/XP aparecen) tras el reload.
4. Cambia algo en una ventana (completa un ejercicio), espera ~3 s, en la otra ventana quita y vuelve el foco (o recarga): el cambio debe aparecer.
5. Caso conflicto: con datos distintos en ambas antes de vincular, verifica que aparezca el diálogo "¿Cuál conservar?".

- [ ] **Step 5: Commit de documentación (si aplica)**

Si actualizas notas de deploy con los pasos de consola:
```bash
git add DEPLOY.md
git commit -m "docs: pasos de consola Firebase para sincronización"
```

---

## Notas de despliegue

- Tras implementar, `npm run build` + `firebase deploy` publica la versión con sync.
- Firebase (auth + firestore) se carga **solo al iniciar sesión** (import dinámico), así que el bundle inicial no cambia para quien no usa sync.
