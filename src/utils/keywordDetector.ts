import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type KeywordRow = Database['public']['Tables']['keyword_lexicon']['Row'];

interface LexiconEntry {
  id: string;
  category: 'messaging' | 'phone' | 'handle' | 'meeting';
  lang: string;
  variant: string;
  severity_score: number | null;
  pattern: string;
  fuzzy_key: string | null;
}

export interface KeywordMatch {
  category: LexiconEntry['category'];
  variant: string;
  matchedText: string;
  severity: number;
  type: 'regex' | 'fuzzy';
}

export interface KeywordDetectionResult {
  flags: LexiconEntry['category'][];
  confidence: number;
  matches: KeywordMatch[];
}

const lexiconCache = new Map<string, LexiconEntry[]>();
const SUPPORTED_LANGS = new Set(['en', 'fr', 'pt', 'ru']);

const DISCLAIMER_MESSAGES: Record<string, string> = {
  fr: "Attention: restez dans l'application. Evitez de partager vos coordonnees avant d'etre en confiance.",
  pt: "Atencao: fique no aplicativo. Evite compartilhar contatos ate sentir seguranca.",
  en: "Warning: please stay in-app. Avoid sharing off-platform contacts until you feel safe.",
  ru: "Vnimanie: obshchaites v prilozhenii. Ne delites kontaktami vne platformy poka ne uvereny.",
};

const DISCLAIMER_INTERVAL_MS = 60 * 60 * 1000;

const normalizeLang = (lang?: string) => {
  if (!lang) return 'en';
  const lower = lang.toLowerCase();
  if (SUPPORTED_LANGS.has(lower)) {
    return lower;
  }
  if (lower.startsWith('fr')) return 'fr';
  if (lower.startsWith('pt')) return 'pt';
  if (lower.startsWith('ru')) return 'ru';
  return 'en';
};

const stripDiacritics = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[']/g, '');

const tokenize = (value: string) =>
  stripDiacritics(value)
    .toLowerCase()
    .split(/[^a-z0-9@+]+/)
    .filter(Boolean);

const levenshtein = (a: string, b: string) => {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i += 1) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const fetchLexicon = async (lang: string): Promise<LexiconEntry[]> => {
  if (lexiconCache.has(lang)) {
    return lexiconCache.get(lang)!;
  }

  const { data, error } = await supabase
    .from<KeywordRow>('keyword_lexicon')
    .select('id, category, lang, variant, severity_score, pattern, fuzzy_key')
    .eq('lang', lang);

  if (error) {
    console.error('Failed to load keyword lexicon', error);
    lexiconCache.set(lang, []);
    return [];
  }

  const entries: LexiconEntry[] = (data ?? []).map((row) => ({
    id: row.id,
    category: row.category as LexiconEntry['category'],
    lang: row.lang,
    variant: row.variant,
    severity_score: row.severity_score,
    pattern: row.pattern,
    fuzzy_key: row.fuzzy_key,
  }));

  lexiconCache.set(lang, entries);
  return entries;
};

export const detectOffPlatformKeywords = async (
  text: string,
  lang?: string
): Promise<KeywordDetectionResult> => {
  const trimmed = text.trim();
  if (!trimmed) {
    return { flags: [], confidence: 0, matches: [] };
  }

  const normalizedLang = normalizeLang(lang);
  const [primary, fallback] = await Promise.all([
    fetchLexicon(normalizedLang),
    normalizedLang === 'en' ? Promise.resolve<LexiconEntry[]>([]) : fetchLexicon('en'),
  ]);

  const lexicon = [...primary, ...fallback];
  if (lexicon.length === 0) {
    return { flags: [], confidence: 0, matches: [] };
  }

  const matches: KeywordMatch[] = [];
  const tokens = tokenize(trimmed);

  lexicon.forEach((entry) => {
    const severity = entry.severity_score ?? 0;
    let regexMatched = false;

    try {
      const regex = new RegExp(entry.pattern, 'giu');
      if (regex.test(trimmed)) {
        regexMatched = true;
        matches.push({
          category: entry.category,
          variant: entry.variant,
          matchedText: entry.pattern,
          severity,
          type: 'regex',
        });
      }
    } catch (error) {
      console.error('Invalid regex pattern', entry.pattern, error);
    }

    if (regexMatched) {
      return;
    }

    const target = stripDiacritics((entry.fuzzy_key ?? entry.variant).toLowerCase());
    const fuzzyHit = tokens.some((token) => {
      if (!token) return false;
      if (Math.abs(token.length - target.length) > 3) {
        return false;
      }
      return levenshtein(token, target) <= 2;
    });

    if (fuzzyHit) {
      matches.push({
        category: entry.category,
        variant: entry.variant,
        matchedText: target,
        severity,
        type: 'fuzzy',
      });
    }
  });

  if (matches.length === 0) {
    return { flags: [], confidence: 0, matches: [] };
  }

  const flags = Array.from(new Set(matches.map((item) => item.category)));
  const confidence = Math.min(1, Math.max(...matches.map((item) => item.severity)) / 100);

  return { flags, confidence, matches };
};

export const getDisclaimerMessage = (lang?: string) => {
  const normalizedLang = normalizeLang(lang);
  return DISCLAIMER_MESSAGES[normalizedLang] ?? DISCLAIMER_MESSAGES.en;
};

export const getDisclaimerInterval = () => DISCLAIMER_INTERVAL_MS;
