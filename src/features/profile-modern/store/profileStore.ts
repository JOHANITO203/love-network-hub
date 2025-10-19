/**
 * МойDate - Profile Store (Mock localStorage)
 */

import type {
  UserProfile,
  ProfileMedia,
  Badge,
  ProfileCompletion,
  ProfileEditData,
} from '../types';
import { ASTRO_SIGNS } from '../types';

const STORAGE_KEY = 'moydate_user_profile';

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Calculate astro sign from date of birth
 */
export const calculateAstroSign = (dateOfBirth: string): string => {
  const date = new Date(dateOfBirth);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${month}-${day}`;

  for (const [sign, { start, end }] of Object.entries(ASTRO_SIGNS)) {
    // Handle year wrap (Capricorn)
    if (start > end) {
      if (dateStr >= start || dateStr <= end) {
        return sign;
      }
    } else {
      if (dateStr >= start && dateStr <= end) {
        return sign;
      }
    }
  }

  return '♈︎'; // Default to Aries
};

/**
 * Calculate profile completion percentage
 */
export const calculateProfileCompletion = (profile: UserProfile): ProfileCompletion => {
  const checks = {
    username: !!profile.username,
    bio: profile.bio.length >= 50,
    passions: profile.passions.length >= 3,
    media: profile.media.length >= 3,
    mainPhoto: profile.mainPhotoIndex >= 0,
    verified: profile.verified,
  };

  const completed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  const percentage = Math.round((completed / total) * 100);

  const missingItems: string[] = [];
  const suggestions: string[] = [];

  if (!checks.bio) {
    missingItems.push('bio');
    suggestions.push('Ajoute une bio captivante (min 50 caractères)');
  }
  if (!checks.passions) {
    missingItems.push('passions');
    suggestions.push('Sélectionne au moins 3 passions pour booster ta visibilité');
  }
  if (!checks.media) {
    missingItems.push('media');
    suggestions.push('Ajoute au moins 3 photos claires de toi');
  }
  if (!checks.verified) {
    missingItems.push('verification');
    suggestions.push('Vérifie ton profil pour gagner +40% de matchs');
  }

  return { percentage, missingItems, suggestions };
};

/**
 * Get default mock profile
 */
export const getDefaultProfile = (): UserProfile => {
  const dateOfBirth = '1998-09-15';
  const age = calculateAge(dateOfBirth);
  const astroSign = calculateAstroSign(dateOfBirth);

  return {
    id: 'user-123',
    username: 'Sophie_Paris',
    dateOfBirth,
    age,
    countryOfOrigin: 'France',
    countryFlag: '🇫🇷',
    currentCity: 'Paris',
    distanceKm: 0,
    sexualOrientation: 'bisexual',
    astroSign,
    relationshipStatus: 'available',
    verified: false,
    bio: 'Passionate about art, travel, and good coffee. Looking for genuine connections and fun adventures. Let\'s explore the city together!',
    passions: ['Travel', 'Art', 'Coffee', 'Photography', 'Music'],
    media: [
      {
        id: 'media-1',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'media-2',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'media-3',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
        uploadedAt: new Date().toISOString(),
      },
    ],
    mainPhotoIndex: 0,
    badges: [
      {
        id: 'badge-first-match',
        name: 'Premier Match',
        description: 'Félicitations pour ton premier match !',
        icon: '🎉',
        category: 'achievement',
        unlockedAt: new Date().toISOString(),
        rarity: 'common',
      },
      {
        id: 'badge-verified',
        name: 'Profil Vérifié',
        description: 'Identité vérifiée par МойDate',
        icon: '✅',
        category: 'verified',
        unlockedAt: undefined, // Not unlocked yet
        rarity: 'epic',
      },
      {
        id: 'badge-hot-streak',
        name: 'Hot Streak',
        description: '5 superlikes reçus en 24h',
        icon: '🔥',
        category: 'achievement',
        unlockedAt: undefined,
        rarity: 'rare',
      },
      {
        id: 'badge-diamond',
        name: 'Diamond Liker',
        description: 'Top 1% des likeurs',
        icon: '💎',
        category: 'premium',
        unlockedAt: undefined,
        rarity: 'legendary',
      },
    ],
    stats: {
      profileViews7d: 342,
      profileViewsChange: 23,
      engagementScore: 78,
      engagementVsAverage: 23,
      totalLikesReceived: 156,
      totalMatchesCount: 24,
      totalMessagesCount: 487,
      hotStreak: 7,
    },
    settings: {
      notifications: {
        push: true,
        email: true,
        sms: false,
      },
      privacy: {
        hideAge: false,
        hideDistance: false,
        onlyVerifiedUsers: false,
        showOnlineStatus: true,
      },
      security: {
        twoFactorEnabled: false,
        socialMediaDetection: true,
      },
    },
    isPremium: false,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Get user profile from localStorage
 */
export const getUserProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const profile = JSON.parse(stored);
      // Recalculate age and astro sign
      profile.age = calculateAge(profile.dateOfBirth);
      profile.astroSign = calculateAstroSign(profile.dateOfBirth);
      return profile;
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }

  const defaultProfile = getDefaultProfile();
  saveUserProfile(defaultProfile);
  return defaultProfile;
};

/**
 * Save user profile to localStorage
 */
export const saveUserProfile = (profile: UserProfile): void => {
  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

/**
 * Update profile fields
 */
export const updateProfile = (updates: ProfileEditData): UserProfile => {
  const profile = getUserProfile();

  if (updates.username !== undefined) profile.username = updates.username;
  if (updates.bio !== undefined) profile.bio = updates.bio;
  if (updates.passions !== undefined) profile.passions = updates.passions;
  if (updates.relationshipStatus !== undefined)
    profile.relationshipStatus = updates.relationshipStatus;
  if (updates.currentCity !== undefined) profile.currentCity = updates.currentCity;

  saveUserProfile(profile);
  return profile;
};

/**
 * Add media to profile
 */
export const addMedia = (media: Omit<ProfileMedia, 'id' | 'uploadedAt'>): UserProfile => {
  const profile = getUserProfile();

  if (profile.media.length >= 10) {
    throw new Error('Maximum 10 media items allowed');
  }

  const newMedia: ProfileMedia = {
    ...media,
    id: `media-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
  };

  profile.media.push(newMedia);
  saveUserProfile(profile);
  return profile;
};

/**
 * Remove media from profile
 */
export const removeMedia = (mediaId: string): UserProfile => {
  const profile = getUserProfile();
  profile.media = profile.media.filter((m) => m.id !== mediaId);

  // Reset main photo if deleted
  if (profile.mainPhotoIndex >= profile.media.length) {
    profile.mainPhotoIndex = profile.media.length > 0 ? 0 : -1;
  }

  saveUserProfile(profile);
  return profile;
};

/**
 * Set main photo
 */
export const setMainPhoto = (index: number): UserProfile => {
  const profile = getUserProfile();
  profile.mainPhotoIndex = index;
  saveUserProfile(profile);
  return profile;
};

/**
 * Unlock badge
 */
export const unlockBadge = (badgeId: string): UserProfile => {
  const profile = getUserProfile();
  const badge = profile.badges.find((b) => b.id === badgeId);

  if (badge && !badge.unlockedAt) {
    badge.unlockedAt = new Date().toISOString();
    saveUserProfile(profile);
  }

  return profile;
};

/**
 * Update settings
 */
export const updateSettings = (
  settings: Partial<UserProfile['settings']>
): UserProfile => {
  const profile = getUserProfile();

  if (settings.notifications) {
    profile.settings.notifications = {
      ...profile.settings.notifications,
      ...settings.notifications,
    };
  }

  if (settings.privacy) {
    profile.settings.privacy = {
      ...profile.settings.privacy,
      ...settings.privacy,
    };
  }

  if (settings.security) {
    profile.settings.security = {
      ...profile.settings.security,
      ...settings.security,
    };
  }

  saveUserProfile(profile);
  return profile;
};

/**
 * Toggle premium status (mock)
 */
export const togglePremium = (): UserProfile => {
  const profile = getUserProfile();
  profile.isPremium = !profile.isPremium;

  if (profile.isPremium) {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    profile.premiumExpiry = expiry.toISOString();
  } else {
    profile.premiumExpiry = undefined;
  }

  saveUserProfile(profile);
  return profile;
};

/**
 * Delete account (mock - clears localStorage)
 */
export const deleteAccount = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
