export type SyncStatus = 'idle' | 'syncing' | 'offline';

export function nextSyncStatus(isOnline: boolean): SyncStatus {
  return isOnline ? 'syncing' : 'offline';
}
