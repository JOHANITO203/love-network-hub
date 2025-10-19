import { supabase } from '@/integrations/supabase/client';
import { getErrorMessage } from './errorMessage';

const SUPPORTED_LANGUAGES = new Set(['fr', 'en', 'pt', 'ru']);

export const normalizeLocale = (locale?: string | null): string => {
  if (!locale) {
    return 'en';
  }
  const base = locale.toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.has(base) ? base : 'en';
};

interface TranslateOptions {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string | null;
}

export const translateText = async ({
  text,
  targetLanguage,
  sourceLanguage,
}: TranslateOptions): Promise<string> => {
  const cleanText = text?.trim();
  if (!cleanText) {
    return '';
  }

  const normalizedTarget = normalizeLocale(targetLanguage);
  const normalizedSource = sourceLanguage ? normalizeLocale(sourceLanguage) : undefined;

  if (normalizedTarget === normalizedSource) {
    return cleanText;
  }

  try {
    const { data, error } = await supabase.functions.invoke('translate-text', {
      body: {
        text: cleanText,
        target_language: normalizedTarget,
        source_language: normalizedSource,
      },
    });

    if (error) {
      console.error('Translation error:', getErrorMessage(error));
      return cleanText;
    }

    const translated = (data as { translated_text?: string } | null)?.translated_text;
    if (translated && translated.trim().length > 0) {
      return translated.trim();
    }

    return cleanText;
  } catch (error) {
    console.error('Translation exception:', getErrorMessage(error));
    return cleanText;
  }
};
