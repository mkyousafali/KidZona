const DB_NAME = 'kidzona';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export async function initIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create profile store
      if (!database.objectStoreNames.contains('profile')) {
        database.createObjectStore('profile', { keyPath: 'id' });
      }

      // Create progress store
      if (!database.objectStoreNames.contains('progress')) {
        const progressStore = database.createObjectStore('progress', { keyPath: 'id' });
        progressStore.createIndex('activityId', 'activityId', { unique: false });
        progressStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Create sync queue
      if (!database.objectStoreNames.contains('sync_queue')) {
        const queueStore = database.createObjectStore('sync_queue', { keyPath: 'id' });
        queueStore.createIndex('synced', 'synced', { unique: false });
      }

      // Create content packs
      if (!database.objectStoreNames.contains('content_packs')) {
        database.createObjectStore('content_packs', { keyPath: 'id' });
      }
    };
  });
}

export function getDB(): IDBDatabase {
  if (!db) {
    throw new Error('IndexedDB not initialized. Call initIndexedDB() first.');
  }
  return db;
}

export async function getFromStore<T>(storeName: string, key: string): Promise<T | undefined> {
  const database = getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function putInStore<T>(storeName: string, value: T): Promise<void> {
  const database = getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const database = getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function deleteFromStore(storeName: string, key: string): Promise<void> {
  const database = getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function clearStore(storeName: string): Promise<void> {
  const database = getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
