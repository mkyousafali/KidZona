import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY } from '$lib/config/supabase';
import { getOrCreateDeviceId } from './device';
import { getUnsynced } from './queue';
import { updateLastSync } from '$lib/stores/network.store';

export async function syncToSupabase(): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Skipping sync.');
    return;
  }

  try {
    const deviceId = await getOrCreateDeviceId();
    const unsynced = await getUnsynced();

    if (unsynced.length === 0) {
      console.log('No events to sync.');
      updateLastSync();
      return;
    }

    // TODO: Implement actual Supabase push logic
    console.log(`Syncing ${unsynced.length} events for device ${deviceId}`);

    // This is a placeholder - real implementation would:
    // 1. POST events to Supabase
    // 2. Mark events as synced in IDB
    // 3. Pull new content packs if available

    updateLastSync();
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
}

export async function pullContentPacks(): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Skipping content pull.');
    return;
  }

  // TODO: Implement content pack fetching from Supabase
  console.log('Pulling content packs...');
}
