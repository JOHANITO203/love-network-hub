/**
 * МойDate - useDiscoverProfiles Hook
 * Manages profile loading and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { Profile, DiscoverFilters } from '../types';
import { getUserStats } from '../store/userStats';

// Mock profiles data
const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Sophie',
    age: 28,
    profession: 'Designer',
    location: 'Paris, France',
    distance: 5,
    bio: 'Passionate about art, coffee, and good conversations. Looking for someone to explore the city with! ☕🎨',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    ],
    verified: true,
    interests: ['Art', 'Travel', 'Photography'],
    gender: 'female',
    zodiacSign: 'Gemini',
    height: 165,
  },
  {
    id: '2',
    name: 'Lucas',
    age: 32,
    profession: 'Software Engineer',
    location: 'Lyon, France',
    distance: 12,
    bio: 'Tech enthusiast, foodie, and adventure seeker. Let\'s grab a drink and see where it goes! 🚀',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    verified: true,
    interests: ['Technology', 'Hiking', 'Cooking'],
    gender: 'male',
    zodiacSign: 'Leo',
    height: 180,
  },
  {
    id: '3',
    name: 'Emma',
    age: 25,
    profession: 'Photographer',
    location: 'Nice, France',
    distance: 8,
    bio: 'Capturing moments and creating memories. Looking for my next adventure! 📸✨',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
    ],
    verified: false,
    interests: ['Photography', 'Travel', 'Music'],
    gender: 'female',
    zodiacSign: 'Pisces',
    height: 168,
  },
  {
    id: '4',
    name: 'Thomas',
    age: 29,
    profession: 'Architect',
    location: 'Marseille, France',
    distance: 15,
    bio: 'Building dreams, one design at a time. Love good wine and deep conversations. 🍷🏗️',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800',
    ],
    verified: true,
    interests: ['Architecture', 'Wine', 'Reading'],
    gender: 'male',
    zodiacSign: 'Virgo',
    height: 175,
  },
];

interface UseDiscoverProfilesOptions {
  initialFilters?: DiscoverFilters;
}

export const useDiscoverProfiles = (options: UseDiscoverProfilesOptions = {}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<DiscoverFilters>(
    options.initialFilters || {
      gender: 'all',
      distance: { min: 0, max: 200 },
      ageRange: { min: 18, max: 50 },
      verifiedOnly: false,
    }
  );

  /**
   * Mock API call to get profiles
   * TODO: Replace with real API call
   */
  const getProfiles = useCallback(async (currentFilters: DiscoverFilters): Promise<Profile[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get user stats to filter out already swiped profiles
    const stats = getUserStats();
    const swipedIds = new Set([
      ...stats.likedProfiles,
      ...stats.skippedProfiles,
    ]);

    // Filter profiles based on criteria
    let filtered = MOCK_PROFILES.filter(profile => {
      // Exclude already swiped
      if (swipedIds.has(profile.id)) return false;

      // Gender filter
      if (currentFilters.gender !== 'all' && profile.gender !== currentFilters.gender) {
        return false;
      }

      // Distance filter
      if (profile.distance) {
        if (
          profile.distance < currentFilters.distance.min ||
          profile.distance > currentFilters.distance.max
        ) {
          return false;
        }
      }

      // Age filter
      if (
        profile.age < currentFilters.ageRange.min ||
        profile.age > currentFilters.ageRange.max
      ) {
        return false;
      }

      // Verified filter
      if (currentFilters.verifiedOnly && !profile.verified) {
        return false;
      }

      return true;
    });

    return filtered;
  }, []);

  /**
   * Load profiles with current filters
   */
  const loadProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const newProfiles = await getProfiles(filters);
      setProfiles(newProfiles);
      setCurrentIndex(0);

    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, getProfiles]);

  /**
   * Update filters and reload
   */
  const updateFilters = useCallback((newFilters: DiscoverFilters) => {
    setFilters(newFilters);
  }, []);

  /**
   * Reset filters to default
   */
  const resetFilters = useCallback(() => {
    setFilters({
      gender: 'all',
      distance: { min: 0, max: 200 },
      ageRange: { min: 18, max: 50 },
      verifiedOnly: false,
    });
  }, []);

  /**
   * Move to next profile
   */
  const nextProfile = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  /**
   * Get current profile
   */
  const currentProfile = profiles[currentIndex] || null;

  /**
   * Check if more profiles available
   */
  const hasMore = currentIndex < profiles.length - 1;

  /**
   * Load profiles on mount and when filters change
   */
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  return {
    profiles,
    currentProfile,
    currentIndex,
    loading,
    hasMore,
    filters,
    updateFilters,
    resetFilters,
    nextProfile,
    loadProfiles,
  };
};
