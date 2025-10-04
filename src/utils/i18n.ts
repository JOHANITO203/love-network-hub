/**
 * МойDate i18n - Internationalization utility
 * Supports: French (FR), English (EN), Portuguese (PT), Russian (RU)
 */

export type Language = 'fr' | 'en' | 'pt' | 'ru';

export interface Translations {
  [key: string]: {
    fr: string;
    en: string;
    pt: string;
    ru: string;
  };
}

// Base translations for common UI elements
export const translations: Translations = {
  // Navigation & General
  'app.name': {
    fr: 'МойDate',
    en: 'МойDate',
    pt: 'МойDate',
    ru: 'МойDate'
  },
  'nav.home': {
    fr: 'Accueil',
    en: 'Home',
    pt: 'Início',
    ru: 'Главная'
  },
  'nav.matches': {
    fr: 'Matchs',
    en: 'Matches',
    pt: 'Matches',
    ru: 'Совпадения'
  },
  'nav.messages': {
    fr: 'Messages',
    en: 'Messages',
    pt: 'Mensagens',
    ru: 'Сообщения'
  },
  'nav.profile': {
    fr: 'Profil',
    en: 'Profile',
    pt: 'Perfil',
    ru: 'Профиль'
  },
  'nav.feed': {
    fr: 'Fil',
    en: 'Feed',
    pt: 'Feed',
    ru: 'Лента'
  },

  // Actions
  'action.like': {
    fr: 'J\'aime',
    en: 'Like',
    pt: 'Curtir',
    ru: 'Нравится'
  },
  'action.dislike': {
    fr: 'Passer',
    en: 'Pass',
    pt: 'Passar',
    ru: 'Пропустить'
  },
  'action.superlike': {
    fr: 'Super Like',
    en: 'Super Like',
    pt: 'Super Curtida',
    ru: 'Супер-лайк'
  },
  'action.send': {
    fr: 'Envoyer',
    en: 'Send',
    pt: 'Enviar',
    ru: 'Отправить'
  },
  'action.save': {
    fr: 'Enregistrer',
    en: 'Save',
    pt: 'Salvar',
    ru: 'Сохранить'
  },
  'action.cancel': {
    fr: 'Annuler',
    en: 'Cancel',
    pt: 'Cancelar',
    ru: 'Отмена'
  },
  'action.edit': {
    fr: 'Modifier',
    en: 'Edit',
    pt: 'Editar',
    ru: 'Редактировать'
  },

  // Profile
  'profile.age': {
    fr: 'Âge',
    en: 'Age',
    pt: 'Idade',
    ru: 'Возраст'
  },
  'profile.location': {
    fr: 'Localisation',
    en: 'Location',
    pt: 'Localização',
    ru: 'Местоположение'
  },
  'profile.bio': {
    fr: 'Bio',
    en: 'Bio',
    pt: 'Bio',
    ru: 'О себе'
  },
  'profile.interests': {
    fr: 'Centres d\'intérêt',
    en: 'Interests',
    pt: 'Interesses',
    ru: 'Интересы'
  },

  // Messages
  'message.placeholder': {
    fr: 'Écrivez un message...',
    en: 'Write a message...',
    pt: 'Escreva uma mensagem...',
    ru: 'Напишите сообщение...'
  },
  'message.new_match': {
    fr: 'Nouveau match !',
    en: 'New match!',
    pt: 'Novo match!',
    ru: 'Новое совпадение!'
  },

  // Settings
  'settings.language': {
    fr: 'Langue',
    en: 'Language',
    pt: 'Idioma',
    ru: 'Язык'
  },
  'settings.notifications': {
    fr: 'Notifications',
    en: 'Notifications',
    pt: 'Notificações',
    ru: 'Уведомления'
  },
  'settings.privacy': {
    fr: 'Confidentialité',
    en: 'Privacy',
    pt: 'Privacidade',
    ru: 'Конфиденциальность'
  },

  // Errors
  'error.generic': {
    fr: 'Une erreur est survenue',
    en: 'An error occurred',
    pt: 'Ocorreu um erro',
    ru: 'Произошла ошибка'
  },
  'error.network': {
    fr: 'Erreur de connexion',
    en: 'Connection error',
    pt: 'Erro de conexão',
    ru: 'Ошибка подключения'
  },

  // Onboarding
  'onboarding.skip': {
    fr: 'Passer',
    en: 'Skip',
    pt: 'Pular',
    ru: 'Пропустить'
  },
  'onboarding.create_account': {
    fr: 'Créer un compte',
    en: 'Create an account',
    pt: 'Criar uma conta',
    ru: 'Создать аккаунт'
  },
  'onboarding.sign_in': {
    fr: 'Se connecter',
    en: 'Sign in',
    pt: 'Entrar',
    ru: 'Войти'
  },

  // Onboarding - Algorithm Slide
  'onboarding.algorithm.title': {
    fr: 'Matches intelligents',
    en: 'Smart Matches',
    pt: 'Matches Inteligentes',
    ru: 'Умные Совпадения'
  },
  'onboarding.algorithm.description': {
    fr: 'Vous likez, vous matchez, vous vivez. Le reste, c\'est juste du bonus.',
    en: 'You like, you match, you live. The rest is just a bonus.',
    pt: 'Você curte, você combina, você vive. O resto é apenas um bônus.',
    ru: 'Вы лайкаете, вы совпадаете, вы живете. Остальное — просто бонус.'
  },
  'onboarding.algorithm.narrative': {
    fr: 'Real People. Real Drama. Sur МойDate, même l\'algo a de la répartie.',
    en: 'Real People. Real Drama. On МойDate, even the algorithm has wit.',
    pt: 'Pessoas Reais. Drama Real. No МойDate, até o algoritmo tem espírito.',
    ru: 'Реальные Люди. Настоящая Драма. В МойDate даже алгоритм остроумный.'
  },

  // Onboarding - Matches Slide
  'onboarding.matches.title': {
    fr: 'Trouvez votre match',
    en: 'Find your match',
    pt: 'Encontre seu match',
    ru: 'Найдите свою пару'
  },
  'onboarding.matches.description': {
    fr: 'Notre algorithme intelligent analyse vos préférences pour vous proposer les meilleurs profils compatibles.',
    en: 'Our smart algorithm analyzes your preferences to suggest the best compatible profiles.',
    pt: 'Nosso algoritmo inteligente analisa suas preferências para sugerir os melhores perfis compatíveis.',
    ru: 'Наш умный алгоритм анализирует ваши предпочтения, чтобы предложить лучшие совместимые профили.'
  },
  'onboarding.matches.narrative': {
    fr: 'Likez, matchez, et laissez la magie opérer. Parfois, l\'amour commence par un simple geste.',
    en: 'Like, match, and let the magic happen. Sometimes, love starts with a simple gesture.',
    pt: 'Curta, combine e deixe a mágica acontecer. Às vezes, o amor começa com um simples gesto.',
    ru: 'Лайкайте, совпадайте и позвольте магии случиться. Иногда любовь начинается с простого жеста.'
  },

  // Onboarding - Premium Slide
  'onboarding.premium.title': {
    fr: 'Expérience Premium',
    en: 'Premium Experience',
    pt: 'Experiência Premium',
    ru: 'Премиум Опыт'
  },
  'onboarding.premium.description': {
    fr: 'Débloquez des fonctionnalités exclusives : Super Likes illimités, filtres avancés et voyez qui vous a liké.',
    en: 'Unlock exclusive features: Unlimited Super Likes, advanced filters, and see who liked you.',
    pt: 'Desbloqueie recursos exclusivos: Super Curtidas ilimitadas, filtros avançados e veja quem curtiu você.',
    ru: 'Разблокируйте эксклюзивные функции: безлимитные Супер-лайки, расширенные фильтры и узнайте, кто вас лайкнул.'
  },
  'onboarding.premium.narrative': {
    fr: 'Parce que l\'amour mérite le meilleur. Investissez dans votre vie amoureuse avec МойDate Premium.',
    en: 'Because love deserves the best. Invest in your love life with МойDate Premium.',
    pt: 'Porque o amor merece o melhor. Invista em sua vida amorosa com МойDate Premium.',
    ru: 'Потому что любовь заслуживает лучшего. Инвестируйте в свою личную жизнь с МойDate Премиум.'
  }
};

/**
 * Current language state
 */
let currentLanguage: Language = 'fr';

/**
 * Get current language
 */
export const getCurrentLanguage = (): Language => {
  return currentLanguage;
};

/**
 * Set current language
 */
export const setLanguage = (lang: Language): void => {
  currentLanguage = lang;
  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('moydate_language', lang);
  }
};

/**
 * Initialize language from localStorage or browser
 */
export const initLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    // Try to get from localStorage first
    const stored = localStorage.getItem('moydate_language') as Language;
    if (stored && ['fr', 'en', 'pt', 'ru'].includes(stored)) {
      currentLanguage = stored;
      return stored;
    }

    // Otherwise detect from browser
    const browserLang = navigator.language.split('-')[0];
    if (['fr', 'en', 'pt', 'ru'].includes(browserLang)) {
      currentLanguage = browserLang as Language;
      return currentLanguage;
    }
  }

  // Default to French
  return 'fr';
};

/**
 * Translate a key to current language
 */
export const t = (key: string): string => {
  const translation = translations[key];

  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  return translation[currentLanguage] || translation['fr'] || key;
};

/**
 * Translate a key to a specific language
 */
export const tLang = (key: string, lang: Language): string => {
  const translation = translations[key];

  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  return translation[lang] || translation['fr'] || key;
};

/**
 * Get all available languages
 */
export const getAvailableLanguages = (): { code: Language; name: string; flag: string }[] => {
  return [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];
};

/**
 * React hook for translations (to be implemented in a React component)
 */
export const useTranslation = () => {
  return {
    t,
    currentLanguage,
    setLanguage,
    availableLanguages: getAvailableLanguages()
  };
};
