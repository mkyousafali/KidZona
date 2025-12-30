// Migration utilities for IndexedDB schema versioning
export interface Migration {
  version: number;
  migrate: (db: IDBDatabase) => void;
}

export const migrations: Migration[] = [
  {
    version: 1,
    migrate: (db: IDBDatabase) => {
      // Initial schema - already handled in indexeddb.ts
    }
];

export function getCurrentSchemaVersion(): number {
  return migrations.length;
}
