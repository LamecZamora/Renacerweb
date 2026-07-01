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
