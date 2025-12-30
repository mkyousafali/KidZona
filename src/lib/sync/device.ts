import { getFromStore, putInStore } from '$lib/db/indexeddb';

const DEVICE_ID_KEY = 'device_id';

export async function getOrCreateDeviceId(): Promise<string> {
  let deviceId = await getFromStore<string>('device_id', DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = generateDeviceId();
    await putInStore('device_id', { id: DEVICE_ID_KEY, value: deviceId });
  }

  return deviceId;
}

export function generateDeviceId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
