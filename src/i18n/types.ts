export type SupportedLocale = 'ru' | 'fr' | 'en' | 'pt';

export interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (nextLocale: SupportedLocale) => void;
  availableLocales: Array<{ code: SupportedLocale; label: string }>;
}
