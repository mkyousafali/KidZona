import { writable } from 'svelte/store';

export const networkStore = writable<{
  online: boolean;
  lastSync: string | null;
}>({
  online: typeof navigator !== 'undefined' ? navigator.onLine : false,
  lastSync: null
});

export function updateNetworkStatus(online: boolean) {
  networkStore.update((state) => ({
    ...state,
    online
  }));
}

export function updateLastSync() {
  networkStore.update((state) => ({
    ...state,
    lastSync: new Date().toISOString()
  }));
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => updateNetworkStatus(true));
  window.addEventListener('offline', () => updateNetworkStatus(false));
}
