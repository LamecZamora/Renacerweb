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
