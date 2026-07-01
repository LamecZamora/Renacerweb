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
