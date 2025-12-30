import { writable } from 'svelte/store';
import { DEFAULT_LANGUAGE } from '$lib/config/app';

export const languageStore = writable<string>(DEFAULT_LANGUAGE);

export function setLanguage(lang: string) {
  languageStore.set(lang);
}
