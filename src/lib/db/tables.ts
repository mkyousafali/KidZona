export interface ProfileTable {
  id: string;
  name: string;
  birthDate: string;
  avatar: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressTable {
  id: string;
  activityId: string;
  score: number;
  timestamp: string;
  synced: boolean;
}

export interface SyncQueueTable {
  id: string;
  type: 'progress' | 'profile_update';
  data: Record<string, unknown>;
  createdAt: string;
  synced: boolean;
}

export interface ContentPackTable {
  id: string;
  name: string;
  version: string;
  manifest: Record<string, unknown>;
  downloadedAt: string;
}
