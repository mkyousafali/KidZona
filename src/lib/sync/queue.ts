import { putInStore, getAllFromStore } from '$lib/db/indexeddb';
import type { SyncQueueTable } from '$lib/db/tables';

export async function enqueueProgressEvent(
  activityId: string,
  score: number,
  timestamp: string
): Promise<void> {
  const event: SyncQueueTable = {
    id: generateId(),
    type: 'progress',
    data: { activityId, score, timestamp },
    createdAt: new Date().toISOString(),
    synced: false
  };

  await putInStore('sync_queue', event);
}

export async function getQueuedEvents(): Promise<SyncQueueTable[]> {
  return getAllFromStore<SyncQueueTable>('sync_queue');
}

export async function getUnsynced(): Promise<SyncQueueTable[]> {
  const events = await getQueuedEvents();
  return events.filter((e) => !e.synced);
}

function generateId(): string {
  return crypto.getRandomValues(new Uint8Array(8)).toString();
}
