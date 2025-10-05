/**
 * МойDate - Local Mock Store for User Stats
 * Simulates backend persistence using localStorage
 */

import { UserStats, SwipeAction, SwipeResult } from '../types';

const STORAGE_KEY = 'moydate_user_stats';
const STATS_FILE_KEY = 'moydate_stats_json'; // Mock pour userStats.json

// Default empty stats
const DEFAULT_STATS: UserStats = {
  likedProfiles: [],
  skippedProfiles: [],
  superLikes: [],
  matches: [],
  timestamp: new Date().toISOString(),
};

/**
 * Get user stats from localStorage
 */
export const getUserStats = (): UserStats => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...DEFAULT_STATS };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading user stats:', error);
    return { ...DEFAULT_STATS };
  }
};

/**
 * Save user stats to localStorage
 */
export const saveUserStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    // Also save to mock JSON file key
    localStorage.setItem(STATS_FILE_KEY, JSON.stringify(stats, null, 2));

  } catch (error) {
    console.error('Error saving user stats:', error);
  }
};

/**
 * Record a swipe action
 */
export const saveUserAction = (profileId: string, action: SwipeAction): SwipeResult => {
  const stats = getUserStats();
  const result: SwipeResult = {
    profileId,
    action,
    timestamp: new Date().toISOString(),
  };

  // Update stats based on action
  switch (action) {
    case 'like':
      if (!stats.likedProfiles.includes(profileId)) {
        stats.likedProfiles.push(profileId);
      }
      // Remove from skipped if previously skipped
      stats.skippedProfiles = stats.skippedProfiles.filter(id => id !== profileId);
      break;

    case 'skip':
      if (!stats.skippedProfiles.includes(profileId)) {
        stats.skippedProfiles.push(profileId);
      }
      // Remove from liked if previously liked
      stats.likedProfiles = stats.likedProfiles.filter(id => id !== profileId);
      break;

    case 'superlike':
      if (!stats.superLikes.includes(profileId)) {
        stats.superLikes.push(profileId);
      }
      if (!stats.likedProfiles.includes(profileId)) {
        stats.likedProfiles.push(profileId);
      }
      break;
  }

  stats.timestamp = new Date().toISOString();
  saveUserStats(stats);

  // Log for development



  return result;
};

/**
 * Save a super like
 */
export const saveSuperLike = (profileId: string): SwipeResult => {
  return saveUserAction(profileId, 'superlike');
};

/**
 * Check if profile was already liked
 */
export const isProfileLiked = (profileId: string): boolean => {
  const stats = getUserStats();
  return stats.likedProfiles.includes(profileId);
};

/**
 * Check if profile was already skipped
 */
export const isProfileSkipped = (profileId: string): boolean => {
  const stats = getUserStats();
  return stats.skippedProfiles.includes(profileId);
};

/**
 * Check if profile was super liked
 */
export const isProfileSuperLiked = (profileId: string): boolean => {
  const stats = getUserStats();
  return stats.superLikes.includes(profileId);
};

/**
 * Reset all user stats
 */
export const resetUserStats = (): void => {
  saveUserStats({ ...DEFAULT_STATS });

};

/**
 * Export stats as JSON (for download/debugging)
 */
export const exportStatsAsJSON = (): string => {
  const stats = getUserStats();
  return JSON.stringify(stats, null, 2);
};

/**
 * Get stats summary for console
 */
export const getStatsSummary = () => {
  const stats = getUserStats();
  return {
    totalLikes: stats.likedProfiles.length,
    totalSkips: stats.skippedProfiles.length,
    totalSuperLikes: stats.superLikes.length,
    totalMatches: stats.matches.length,
    lastUpdated: stats.timestamp,
  };
};
