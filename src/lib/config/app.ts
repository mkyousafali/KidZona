// App configuration
export const APP_NAME = 'KidZona';
export const APP_VERSION = '0.1.0';

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'ml', 'ar'] as const;
export const DEFAULT_LANGUAGE = 'en';

export const AGE_BANDS = [
  { min: 2, max: 4, name: 'Toddler' },
  { min: 5, max: 6, name: 'Kindergarten' },
  { min: 7, max: 9, name: 'School' }
] as const;

export const MODULES = [
  'computer',
  'spelling',
  'languages',
  'math',
  'science',
  'animals',
  'sounds',
  'ai'
] as const;
