import { browser } from '$app/environment';
import { initIndexedDB } from '$lib/db/indexeddb';
import { profileStore } from '$lib/stores/profile.store';
import { languageStore } from '$lib/stores/language.store';
import { getAllFromStore } from '$lib/db/indexeddb';
import type { Profile } from '$lib/stores/profile.store';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
  if (!browser) {
    return {
      hasProfile: false
    };
  }

  try {
    // Initialize IndexedDB
    await initIndexedDB();

    // Load profile from storage - get the first profile (should only be one)
    const profiles = await getAllFromStore<Profile>('profile');
    const profile = profiles && profiles.length > 0 ? profiles[0] : null;
    
    if (profile) {
      profileStore.set(profile);
      languageStore.set(profile.language);
    }

    return {
      hasProfile: !!profile
    };
  } catch (error) {
    console.error('Failed to load data:', error);
    return {
      hasProfile: false
    };
  }
};
