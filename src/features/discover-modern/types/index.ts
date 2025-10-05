/**
 * МойDate Discover Feature - Types & Interfaces
 * Modern dating app discover screen types
 */

export interface Profile {
  id: string;
  name: string;
  age: number;
  profession?: string;
  location?: string;
  distance?: number; // in km
  bio?: string;
  images: string[];
  verified?: boolean;
  interests?: string[];
  gender?: 'male' | 'female' | 'non-binary' | 'other';
  zodiacSign?: string;
  height?: number; // in cm
}

export interface UserStats {
  likedProfiles: string[];
  skippedProfiles: string[];
  superLikes: string[];
  matches: string[];
  timestamp: string;
}

export interface DiscoverFilters {
  gender: 'all' | 'male' | 'female' | 'non-binary';
  distance: {
    min: number;
    max: number;
  };
  ageRange: {
    min: number;
    max: number;
  };
  verifiedOnly: boolean;
}

export type SwipeAction = 'like' | 'skip' | 'superlike';

export interface SwipeResult {
  profileId: string;
  action: SwipeAction;
  timestamp: string;
  isMatch?: boolean;
}

export interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  onSuperLike: () => void;
  onOpenProfile: () => void;
}

export interface ProfileModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onSkip: () => void;
  onSuperLike: () => void;
  onMessage: () => void;
  onReport: () => void;
}

export interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DiscoverFilters;
  onFiltersChange: (filters: DiscoverFilters) => void;
  onReset: () => void;
}
