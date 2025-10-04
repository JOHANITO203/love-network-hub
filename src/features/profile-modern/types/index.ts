/**
 * МойDate - Profile Feature Types
 */

export type RelationshipStatus = 'available' | 'chill' | 'busy';

export type PaymentMethod = 'yoomoney' | 'mir' | 'qiwi' | 'apple_pay' | 'google_pay' | 'stripe';

export interface UserProfile {
  id: string;
  username: string;
  dateOfBirth: string; // ISO date
  age: number; // Calculated
  countryOfOrigin: string;
  countryFlag: string; // Emoji flag
  currentCity: string;
  distanceKm?: number; // Distance from viewer
  sexualOrientation: 'heterosexual' | 'homosexual' | 'bisexual' | 'pansexual' | 'asexual' | 'other'; // Hidden from others, used by algo
  astroSign: string; // ♈︎ ♉︎ ♊︎ etc
  relationshipStatus: RelationshipStatus;
  verified: boolean;
  bio: string;
  passions: string[];
  media: ProfileMedia[];
  mainPhotoIndex: number;
  badges: Badge[];
  stats: ProfileStats;
  settings: ProfileSettings;
  isPremium: boolean;
  premiumExpiry?: string; // ISO date
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface ProfileMedia {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string; // For videos
  duration?: number; // For videos (in seconds, max 15)
  uploadedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji
  category: 'achievement' | 'verified' | 'premium' | 'special';
  unlockedAt?: string; // ISO date, undefined if not unlocked
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ProfileStats {
  profileViews7d: number;
  profileViewsChange: number; // Percentage change
  engagementScore: number; // 0-100
  engagementVsAverage: number; // Percentage vs average
  totalLikesReceived: number;
  totalMatchesCount: number;
  totalMessagesCount: number;
  hotStreak: number; // Consecutive days active
}

export interface ProfileSettings {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  privacy: {
    hideAge: boolean;
    hideDistance: boolean;
    onlyVerifiedUsers: boolean;
    showOnlineStatus: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    socialMediaDetection: boolean; // Auto-detect phone/social handles
  };
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean; // If user has premium
}

export interface ProfileCompletion {
  percentage: number;
  missingItems: string[];
  suggestions: string[];
}

export interface ProfileEditData {
  username?: string;
  bio?: string;
  passions?: string[];
  relationshipStatus?: RelationshipStatus;
  currentCity?: string;
}

// Available passions
export const AVAILABLE_PASSIONS = [
  'Music', 'Travel', 'Sports', 'Reading', 'Movies', 'Gaming',
  'Cooking', 'Photography', 'Art', 'Dancing', 'Fitness', 'Yoga',
  'Hiking', 'Animals', 'Coffee', 'Wine', 'Fashion', 'Technology',
  'Entrepreneurship', 'Volunteer', 'Writing', 'Languages'
] as const;

// Astro signs with dates
export const ASTRO_SIGNS = {
  '♈︎': { name: 'Aries', start: '03-21', end: '04-19' },
  '♉︎': { name: 'Taurus', start: '04-20', end: '05-20' },
  '♊︎': { name: 'Gemini', start: '05-21', end: '06-20' },
  '♋︎': { name: 'Cancer', start: '06-21', end: '07-22' },
  '♌︎': { name: 'Leo', start: '07-23', end: '08-22' },
  '♍︎': { name: 'Virgo', start: '08-23', end: '09-22' },
  '♎︎': { name: 'Libra', start: '09-23', end: '10-22' },
  '♏︎': { name: 'Scorpio', start: '10-23', end: '11-21' },
  '♐︎': { name: 'Sagittarius', start: '11-22', end: '12-21' },
  '♑︎': { name: 'Capricorn', start: '12-22', end: '01-19' },
  '♒︎': { name: 'Aquarius', start: '01-20', end: '02-18' },
  '♓︎': { name: 'Pisces', start: '02-19', end: '03-20' },
};

// Relationship status icons
export const RELATIONSHIP_STATUS_CONFIG = {
  available: { label: 'Disponible', icon: '❤️', color: 'bg-red-500' },
  chill: { label: 'Chill', icon: '😎', color: 'bg-blue-500' },
  busy: { label: 'Occupé', icon: '💼', color: 'bg-gray-500' },
};

// Badge rarity colors
export const BADGE_RARITY_CONFIG = {
  common: { color: 'bg-gray-500', gradient: 'from-gray-400 to-gray-600' },
  rare: { color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600' },
  epic: { color: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600' },
  legendary: { color: 'bg-yellow-500', gradient: 'from-yellow-400 to-orange-600' },
};
