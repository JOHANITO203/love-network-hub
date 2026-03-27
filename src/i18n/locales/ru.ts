import type { LocaleMessages } from '../types';
import { baseMessages } from './base';

/**
 * Les traductions russes seront réécrites dans un sprint dédié.
 * Pour l’instant, on réutilise le fallback anglais propre.
 */
export const ruMessages: LocaleMessages = {
  ...baseMessages,
} as const;
