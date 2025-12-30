import { writable } from 'svelte/store';

export interface ProgressEvent {
  id: string;
  activityId: string;
  score: number;
  timestamp: string;
  synced: boolean;
}

export const progressStore = writable<ProgressEvent[]>([]);

export function addProgress(activityId: string, score: number) {
  const event: ProgressEvent = {
    id: crypto.getRandomValues(new Uint8Array(16)).toString(),
    activityId,
    score,
    timestamp: new Date().toISOString(),
    synced: false
  };

  progressStore.update((events) => [...events, event]);
  return event;
}
