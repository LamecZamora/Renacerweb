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
