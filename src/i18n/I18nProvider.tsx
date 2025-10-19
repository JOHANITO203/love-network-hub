/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, MESSAGES, SUPPORTED_LOCALES } from './messages';
import type { LocaleContextValue, SupportedLocale } from './types';

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const resolveLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY) as SupportedLocale | null;
  if (storedLocale && storedLocale in MESSAGES) {
    return storedLocale;
  }

  const navigatorLocale = window.navigator?.languages?.[0] || window.navigator?.language;
  if (navigatorLocale) {
    const base = navigatorLocale.toLowerCase().split('-')[0];
    const match = SUPPORTED_LOCALES.find(({ code }) => code === base);
    if (match) {
      return match.code;
    }
  }

  return DEFAULT_LOCALE;
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => resolveLocale());

  const setLocale = useCallback((nextLocale: SupportedLocale) => {
    setLocaleState(nextLocale);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    }
  }, []);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    availableLocales: SUPPORTED_LOCALES
  }), [locale, setLocale]);

  const messages = MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];

  return (
    <LocaleContext.Provider value={value}>
      <IntlProvider locale={locale} messages={messages} defaultLocale={DEFAULT_LOCALE}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within an I18nProvider');
  }
  return context;
};
