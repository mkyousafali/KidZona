import { writable } from 'svelte/store';

export interface Profile {
  id: string;
  name: string;
  birthDate: string; // ISO date
  avatar: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

const initialProfile: Profile | null = null;

export const profileStore = writable<Profile | null>(initialProfile);

export function createProfile(name: string, birthDate: string, avatar: string, language: string) {
  const profile: Profile = {
    id: crypto.getRandomValues(new Uint8Array(16)).toString(),
    name,
    birthDate,
    avatar,
    language,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  profileStore.set(profile);
  return profile;
}

export function updateProfile(updates: Partial<Profile>) {
  let updatedProfile: Profile | null = null;
  profileStore.update((profile) => {
    if (!profile) return null;
    updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return updatedProfile;
  });
  return updatedProfile;
}
