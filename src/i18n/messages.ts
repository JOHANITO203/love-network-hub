import type { SupportedLocale } from './types';

export const DEFAULT_LOCALE: SupportedLocale = 'ru';
export const LOCALE_STORAGE_KEY = 'moydate_locale';

export const SUPPORTED_LOCALES: Array<{ code: SupportedLocale; label: string }> = [
  { code: 'ru', label: 'Русский' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' }
];

export const MESSAGES: Record<SupportedLocale, Record<string, string>> = {
  ru: {
    'app.loading': 'Загрузка…',
    'app.name': 'МойDate',
    'app.language.auto': 'Автоматически (язык устройства)',
    'app.language.updated': 'Язык изменён'
  },
  fr: {
    'app.loading': 'Chargement…',
    'app.name': 'МойDate',
    'app.language.auto': "Automatique (langue de l'appareil)",
    'app.language.updated': 'Langue mise à jour'
  },
  en: {
    'app.loading': 'Loading…',
    'app.name': 'МойDate',
    'app.language.auto': 'Automatic (device language)',
    'app.language.updated': 'Language updated'
  },
  pt: {
    'app.loading': 'Carregando…',
    'app.name': 'МойDate',
    'app.language.auto': 'Automático (idioma do dispositivo)',
    'app.language.updated': 'Idioma atualizado'
  }
};
