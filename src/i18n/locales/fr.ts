import type { LocaleMessages } from '../types';
import { baseMessages } from './base';

/**
 * Les traductions FR seront réintroduites plus tard.
 * En attendant, on s’appuie sur le fallback anglais propre.
 */
export const frMessages: LocaleMessages = {
  ...baseMessages,
} as const;
