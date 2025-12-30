import enMessages from './en.json';
import hiMessages from './hi.json';
import mlMessages from './ml.json';
import arMessages from './ar.json';

const messages: Record<string, Record<string, string>> = {
  en: enMessages,
  hi: hiMessages,
  ml: mlMessages,
  ar: arMessages
};

export function t(key: string, lang: string): string {
  return messages[lang]?.[key] || messages['en']?.[key] || key;
}

export function getAvailableLanguages(): string[] {
  return Object.keys(messages);
}
