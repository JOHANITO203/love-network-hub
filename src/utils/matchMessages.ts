/**
 * Internationalization messages for Match Modal
 */

export const matchMessages = {
  en: {
    title: "It's a match!",
    subtitle: (name: string) => `You and ${name} liked each other`,
    sayHello: "Say hello",
    keepSwiping: "Keep swiping",
    chatOpened: "Chat opened",
    chatDescription: (name: string) => `Start chatting with ${name}`,
  },
  fr: {
    title: "C'est un match !",
    subtitle: (name: string) => `Vous et ${name} vous aimez mutuellement`,
    sayHello: "Dire bonjour",
    keepSwiping: "Continuer à swiper",
    chatOpened: "Chat ouvert",
    chatDescription: (name: string) => `Commencez à discuter avec ${name}`,
  },
  ru: {
    title: "Это совпадение!",
    subtitle: (name: string) => `Вы и ${name} понравились друг другу`,
    sayHello: "Сказать привет",
    keepSwiping: "Продолжить поиск",
    chatOpened: "Чат открыт",
    chatDescription: (name: string) => `Начните общение с ${name}`,
  },
};

export type SupportedLanguage = keyof typeof matchMessages;

export const getMatchMessage = (
  lang: SupportedLanguage,
  key: keyof typeof matchMessages.en,
  ...args: any[]
): string => {
  const message = matchMessages[lang]?.[key] || matchMessages.en[key];

  if (typeof message === 'function') {
    return message(...args);
  }

  return message as string;
};
