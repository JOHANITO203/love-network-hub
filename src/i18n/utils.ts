import { baseMessages } from './locales/base';

const humanizeId = (id: string): string => {
  const lastSegment = id.split('.').pop() ?? id;
  const spaced = lastSegment
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!spaced) {
    return id;
  }

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export const getDefaultMessage = (id: string): string => {
  const baseMessage = baseMessages[id];
  if (typeof baseMessage === 'string' && baseMessage.trim().length > 0) {
    return baseMessage;
  }

  return humanizeId(id);
};
