// Conflict resolution strategy: latest timestamp wins
export function resolveConflict<T extends { timestamp: string }>(
  local: T,
  remote: T
): T {
  const localTime = new Date(local.timestamp).getTime();
  const remoteTime = new Date(remote.timestamp).getTime();

  return remoteTime > localTime ? remote : local;
}

export function shouldSync(lastSync: string | null): boolean {
  if (!lastSync) return true;

  const lastSyncTime = new Date(lastSync).getTime();
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  return now - lastSyncTime > fiveMinutes;
}
