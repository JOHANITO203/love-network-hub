/**
 * МойDate - useDiscoverProfiles Hook
 * Manages profile loading and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { Profile, DiscoverFilters } from '../types';
import { getUserStats } from '../store/userStats';

// Mock profiles data (Moscow + Voronezh)
const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Anya',
    age: 27,
    profession: 'UX Designer',
    location: 'Moscow, Russia',
    distance: 4,
    bio: 'Coffee, galleries, and long city walks. I speak RU/EN and love thoughtful chats.',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    ],
    verified: true,
    interests: ['Art', 'City walks', 'Coffee'],
    gender: 'female',
    zodiacSign: 'Gemini',
    height: 165,
  },
  {
    id: '2',
    name: 'Daria',
    age: 29,
    profession: 'Product Manager',
    location: 'Moscow, Russia',
    distance: 7,
    bio: 'I plan trips, playlists, and great evenings. RU/EN, a bit of FR.',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
    ],
    verified: true,
    interests: ['Travel', 'Music', 'Food'],
    gender: 'female',
    zodiacSign: 'Libra',
    height: 168,
  },
  {
    id: '3',
    name: 'Maksim',
    age: 31,
    profession: 'Software Engineer',
    location: 'Voronezh, Russia',
    distance: 11,
    bio: 'Tech by day, musician by night. Let’s swap playlists and ideas.',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    verified: false,
    interests: ['Technology', 'Music', 'Gaming'],
    gender: 'male',
    zodiacSign: 'Leo',
    height: 182,
  },
  {
    id: '4',
    name: 'Elena',
    age: 26,
    profession: 'Photographer',
    location: 'Voronezh, Russia',
    distance: 6,
    bio: 'I capture tiny moments and big skies. RU/EN. Let’s explore together.',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800',
    ],
    verified: true,
    interests: ['Photography', 'Nature', 'Cinema'],
    gender: 'female',
    zodiacSign: 'Pisces',
    height: 170,
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
    await new Promise((resolve) => setTimeout(resolve, 500));

    const stats = getUserStats();
    const swipedIds = new Set([
      ...stats.likedProfiles,
      ...stats.skippedProfiles,
    ]);

    const filtered = MOCK_PROFILES.filter((profile) => {
      if (swipedIds.has(profile.id)) return false;

      if (currentFilters.gender !== 'all' && profile.gender !== currentFilters.gender) {
        return false;
      }

      if (profile.distance) {
        if (
          profile.distance < currentFilters.distance.min ||
          profile.distance > currentFilters.distance.max
        ) {
          return false;
        }
      }

      if (
        profile.age < currentFilters.ageRange.min ||
        profile.age > currentFilters.ageRange.max
      ) {
        return false;
      }

      if (currentFilters.verifiedOnly && !profile.verified) {
        return false;
      }

      return true;
    });

    return filtered;
  }, []);

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

  const updateFilters = useCallback((newFilters: DiscoverFilters) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      gender: 'all',
      distance: { min: 0, max: 200 },
      ageRange: { min: 18, max: 50 },
      verifiedOnly: false,
    });
  }, []);

  const nextProfile = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const currentProfile = profiles[currentIndex] || null;

  const hasMore = currentIndex < profiles.length - 1;

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
