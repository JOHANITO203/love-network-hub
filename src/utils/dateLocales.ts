import type { Locale } from "date-fns";
import { enUS, fr, ru, pt, ptBR } from "date-fns/locale";

const LOCALE_MAP: Record<string, Locale> = {
  ru,
  "ru-RU": ru,
  fr,
  "fr-FR": fr,
  en: enUS,
  "en-US": enUS,
  "en-GB": enUS,
  pt,
  "pt-PT": pt,
  "pt-BR": ptBR,
};

export const getDateLocale = (locale: string | undefined): Locale => {
  if (!locale) {
    return enUS;
  }

  const normalized = locale.toLowerCase();

  if (LOCALE_MAP[normalized]) {
    return LOCALE_MAP[normalized];
  }

  // Try to match by prefix (e.g., fr-CA -> fr)
  const prefix = normalized.split("-")[0];
  if (LOCALE_MAP[prefix]) {
    return LOCALE_MAP[prefix];
  }

  return enUS;
};
