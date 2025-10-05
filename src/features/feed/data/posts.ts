import profile1 from '@/assets/profile1.jpg';
import profile2 from '@/assets/profile2.jpg';
import date1 from '@/assets/date1.jpg';
import date2 from '@/assets/date2.jpg';
import { fillTemplate, getTemplateByType } from '@/data/feedTemplates';

export type FeedPostType =
  | 'match'
  | 'official_couple'
  | 'badge'
  | 'story_highlight'
  | 'sarcastic';

export interface FeedUser {
  id: string;
  name: string;
  avatar: string;
  age?: number;
  sign?: string;
  job?: string;
  location?: string;
}

export interface ReactionStats {
  likes: number;
  comments: number;
  superLikes?: number;
  shares?: number;
}

export interface FeedMedia {
  kind: 'image' | 'badge';
  url: string;
  alt: string;
}

export interface SarcasmOverlay {
  tone: 'sarcastic';
  message: string;
}

export interface FeedPost {
  id: string;
  type: FeedPostType;
  headline: string;
  subheadline?: string;
  body?: string;
  timestamp: string;
  primaryUser: FeedUser;
  secondaryUser?: FeedUser;
  media?: FeedMedia;
  accentColor?: string;
  tags?: string[];
  stats: ReactionStats;
  overlay?: SarcasmOverlay;
  storyRef?: string;
}

const makeSarcasm = (
  templateKey: string,
  variables: Record<string, string | number>,
  fallback: string
): SarcasmOverlay => {
  const template = getTemplateByType(templateKey);
  if (!template) {
    return { tone: 'sarcastic', message: fallback };
  }

  return {
    tone: 'sarcastic',
    message: fillTemplate(template.template, variables),
  };
};

export const feedPosts: FeedPost[] = [
  {
    id: 'feed-post-1',
    type: 'match',
    headline: 'Match confirmé : Emma + Alex',
    subheadline: 'Deux swipes, une étincelle et un DM enflammé.',
    body: 'Ils ont matché à 22h17. À 22h19 elle envoyait déjà son plus beau meme.',
    timestamp: 'Il y a 12 min',
    primaryUser: {
      id: 'profile-emma',
      name: 'Emma',
      avatar: profile1,
      age: 26,
      sign: 'Gémeaux',
      location: 'Paris',
    },
    secondaryUser: {
      id: 'profile-alex',
      name: 'Alex',
      avatar: profile2,
      age: 28,
      sign: 'Lion',
      location: 'Paris',
    },
    media: {
      kind: 'image',
      url: date1,
      alt: 'Emma et Alex trinquent chez Laurent',
    },
    accentColor: 'from-brand-red via-brand-orange to-brand-purple',
    tags: ['#MatchTime', '#TeamParis'],
    stats: { likes: 128, comments: 18, superLikes: 5 },
  },
  {
    id: 'feed-post-2',
    type: 'official_couple',
    headline: 'Couple officiel : Sofia + Marcus',
    subheadline: 'Questionnaire compatibilité 92 %',
    body: 'Ils ont survécu à la checklist « espresso, tarot, playlists » de Sofia. On valide.',
    timestamp: 'Il y a 2 h',
    primaryUser: {
      id: 'profile-sofia',
      name: 'Sofia',
      avatar: profile1,
      age: 24,
      sign: 'Balance',
      job: 'Autrice',
    },
    secondaryUser: {
      id: 'profile-marcus',
      name: 'Marcus',
      avatar: profile2,
      age: 27,
      sign: 'Verseau',
      job: 'Data analyst',
    },
    media: {
      kind: 'image',
      url: date2,
      alt: 'Sofia et Marcus main dans la main au parc',
    },
    accentColor: 'from-brand-purple via-brand-red to-brand-orange',
    tags: ['#OfficialCouple', '#QuestionnaireValidé'],
    stats: { likes: 204, comments: 32, superLikes: 12 },
  },
  {
    id: 'feed-post-3',
    type: 'badge',
    headline: 'Badge débloqué : Serial swiper',
    subheadline: 'Johane vient de liker 100 profils cette semaine.',
    timestamp: 'Il y a 4 h',
    primaryUser: {
      id: 'profile-johane',
      name: 'Johane',
      avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
      age: 29,
      sign: 'Scorpion',
    },
    media: {
      kind: 'badge',
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80',
      alt: 'Badge Serial swiper',
    },
    stats: { likes: 79, comments: 11 },
    overlay: makeSarcasm(
      'serial_swiper',
      { username: 'Johane', age: 29, sign: 'Scorpion', like_count: 100 },
      'Johane a encore battu son record de swipes. RIP son pouce.'
    ),
  },
  {
    id: 'feed-post-4',
    type: 'story_highlight',
    headline: 'Story highlight : Linh reprend la main',
    subheadline: 'Story 45 s - « Next chapter, same energy »',
    body: 'Spoiler : elle a friendzoné deux matchs en 12 h et ne regrette rien.',
    timestamp: 'Il y a 5 h',
    primaryUser: {
      id: 'profile-linh',
      name: 'Linh',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
      age: 25,
      sign: 'Sagittaire',
    },
    storyRef: 'feed-story-3',
    stats: { likes: 56, comments: 9, shares: 4 },
    overlay: makeSarcasm(
      'astro_fun',
      { username: 'Linh', sign: 'Sagittaire' },
      'Sagittaire en feu : elle swipe, elle triomphe, elle ghoste.'
    ),
  },
  {
    id: 'feed-post-5',
    type: 'sarcastic',
    headline: 'Algo Reality : focus sur Noa',
    subheadline: 'Le narrateur sarcastique n’a pas pu s’empêcher…',
    timestamp: 'Il y a 8 h',
    primaryUser: {
      id: 'profile-noa',
      name: 'Noa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      age: 31,
      sign: 'Capricorne',
      job: 'Product lead',
    },
    accentColor: 'from-brand-orange via-brand-red to-brand-purple',
    stats: { likes: 112, comments: 24, superLikes: 7 },
    overlay: makeSarcasm(
      'always_online',
      { username: 'Noa' },
      'Noa est connecté 24/7. Quelqu’un lui a parlé de la sieste ?'
    ),
  },
];
