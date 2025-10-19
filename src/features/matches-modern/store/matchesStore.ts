/**
 * МойDate - Matches Store
 * Mock localStorage-based store for matches data
 */

import { Match, MatchFilter, GroupedMatches, MatchAction } from '../types';

const STORAGE_KEY = 'moydate_matches';
const ACTIONS_KEY = 'moydate_match_actions';

// Mock matches data
const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    name: 'Sophie',
    age: 28,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    ],
    bio: 'Passionate about art, coffee, and good conversations. Looking for someone to explore the city with! ☕🎨',
    profession: 'Designer',
    location: 'Paris',
    distance: 5,
    interests: ['Art', 'Travel', 'Photography'],
    verified: true,
    matchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isNew: true,
    isSuperLike: false,
    isMutualLike: true,
    lastMessage: {
      text: 'Hey! Thanks for the match 😊',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  },
  {
    id: 'm2',
    name: 'Emma',
    age: 25,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
    ],
    bio: 'Capturing moments and creating memories. Looking for my next adventure! 📸✨',
    profession: 'Photographer',
    location: 'Nice',
    distance: 8,
    interests: ['Photography', 'Travel', 'Music'],
    verified: false,
    matchedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isNew: true,
    isSuperLike: true,
    isMutualLike: false,
  },
  {
    id: 'm3',
    name: 'Lucas',
    age: 32,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    bio: 'Tech enthusiast, foodie, and adventure seeker. Let\'s grab a drink and see where it goes! 🚀',
    profession: 'Software Engineer',
    location: 'Lyon',
    distance: 12,
    interests: ['Technology', 'Hiking', 'Cooking'],
    verified: true,
    matchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isNew: false,
    isSuperLike: false,
    isMutualLike: true,
    lastMessage: {
      text: 'Coffee this weekend?',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
    },
  },
  {
    id: 'm4',
    name: 'Chloé',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    ],
    bio: 'Music lover and aspiring chef. Let\'s share our favorite recipes! 🎵👩‍🍳',
    profession: 'Chef',
    location: 'Paris',
    distance: 3,
    interests: ['Cooking', 'Music', 'Wine'],
    verified: true,
    matchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isNew: false,
    isSuperLike: false,
    isMutualLike: true,
  },
  {
    id: 'm5',
    name: 'Thomas',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800',
    ],
    bio: 'Building dreams, one design at a time. Love good wine and deep conversations. 🍷🏗️',
    profession: 'Architect',
    location: 'Marseille',
    distance: 15,
    interests: ['Architecture', 'Wine', 'Reading'],
    verified: true,
    matchedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    isNew: false,
    isSuperLike: true,
    isMutualLike: false,
  },
  {
    id: 'm6',
    name: 'Léa',
    age: 24,
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
    ],
    bio: 'Yoga instructor and nature lover. Looking for positive vibes! 🧘‍♀️🌿',
    profession: 'Yoga Instructor',
    location: 'Nice',
    distance: 7,
    interests: ['Yoga', 'Nature', 'Meditation'],
    verified: false,
    matchedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    isNew: false,
    isSuperLike: false,
    isMutualLike: true,
  },
];

/**
 * Initialize matches in localStorage if not exists
 */
const initMatches = (): Match[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((match: any) => ({
        ...match,
        matchedAt: new Date(match.matchedAt),
        lastMessage: match.lastMessage ? {
          ...match.lastMessage,
          timestamp: new Date(match.lastMessage.timestamp),
        } : undefined,
      }));
    } catch (error) {
      console.error('Error parsing matches from localStorage:', error);
    }
  }

  // Initialize with mock data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MATCHES));
  return MOCK_MATCHES;
};

/**
 * Get all matches
 */
export const getMatches = (): Match[] => {
  return initMatches();
};

/**
 * Filter matches based on filter type
 */
export const filterMatches = (matches: Match[], filter: MatchFilter): Match[] => {
  switch (filter) {
    case 'new':
      return matches.filter(m => m.isNew);
    case 'superlikes':
      return matches.filter(m => m.isSuperLike);
    case 'verified':
      return matches.filter(m => m.verified);
    case 'all':
    default:
      return matches;
  }
};

/**
 * Group matches by time sections
 */
export const groupMatchesByTime = (matches: Match[]): GroupedMatches => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const thisWeekStart = new Date(todayStart);
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);

  const grouped: GroupedMatches = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  matches.forEach(match => {
    const matchDate = new Date(match.matchedAt);

    if (matchDate >= todayStart) {
      grouped.today.push(match);
    } else if (matchDate >= yesterdayStart) {
      grouped.yesterday.push(match);
    } else if (matchDate >= thisWeekStart) {
      grouped.thisWeek.push(match);
    } else {
      grouped.older.push(match);
    }
  });

  return grouped;
};

/**
 * Save match action
 */
export const saveMatchAction = (matchId: string, action: MatchAction): void => {
  const actions = JSON.parse(localStorage.getItem(ACTIONS_KEY) || '[]');
  actions.push({
    matchId,
    action,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));



  // Update match based on action
  if (action === 'ignore') {
    const matches = getMatches();
    const updated = matches.filter(m => m.id !== matchId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};

/**
 * Mark match as read (no longer new)
 */
export const markMatchAsRead = (matchId: string): void => {
  const matches = getMatches();
  const updated = matches.map(m =>
    m.id === matchId ? { ...m, isNew: false } : m
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

/**
 * Get match by ID
 */
export const getMatchById = (matchId: string): Match | null => {
  const matches = getMatches();
  return matches.find(m => m.id === matchId) || null;
};

/**
 * Reset matches to initial state
 */
export const resetMatches = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MATCHES));
  localStorage.removeItem(ACTIONS_KEY);

};
