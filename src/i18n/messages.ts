import type { SupportedLocale } from './types';
import { baseMessages } from './locales/base';

export const DEFAULT_LOCALE: SupportedLocale = 'ru';
export const LOCALE_STORAGE_KEY = 'moydate_locale';

export const SUPPORTED_LOCALES: Array<{ code: SupportedLocale; label: string }> = [
  { code: 'ru', label: 'Русский' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];

/**
 * Les traductions spécifiques seront réintroduites lors d’un sprint dédié.
 * Pour l’instant, toutes les langues utilisent le fallback anglais afin
 * d’éviter les caractères corrompus et garantir une UX cohérente.
 */
export const MESSAGES: Record<SupportedLocale, Record<string, string>> = {
  ru: { ...baseMessages },
  fr: { ...baseMessages },
  en: { ...baseMessages },
  pt: { ...baseMessages },
};
