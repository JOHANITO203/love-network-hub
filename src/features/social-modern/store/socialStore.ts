/**
 * МойDate - Social Feed Store
 * Mock localStorage-based store for social feed data
 */

import { UserPost, Narrative, FeedItem, NarrativeStory } from '../types';

const FEED_KEY = 'moydate_social_feed';
const NARRATIVES_ENABLED_KEY = 'moydate_narratives_enabled';

// Mock narratives data
const MOCK_NARRATIVES: Narrative[] = [
  {
    id: 'nar1',
    type: 'narrative',
    title: 'L\'algorithme a des choses à dire',
    content: 'Tu as liké 47 profils aujourd\'hui. Je commence à penser que tu swipes plus vite que tu ne réfléchis. Mais bon, qui suis-je pour juger? Je ne suis qu\'un algorithme qui connaît tes moindres préférences. 🎭',
    icon: '🎭',
    gradient: { from: '#667eea', to: '#764ba2' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'sarcastic',
    likes: 1234,
    dislikes: 89,
    shares: 234,
    userReaction: null,
  },
  {
    id: 'nar2',
    type: 'narrative',
    title: 'Sagesse du jour',
    content: 'Fun fact: 73% des utilisateurs disent chercher quelque chose de sérieux. Les 27% restants sont juste plus honnêtes. Toi? Tu es dans quelle catégorie? 🤔',
    icon: '🤔',
    gradient: { from: '#f093fb', to: '#f5576c' },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    category: 'funny',
    likes: 892,
    dislikes: 45,
    shares: 156,
    userReaction: null,
  },
  {
    id: 'nar3',
    type: 'narrative',
    title: 'Observation romantique',
    content: 'J\'ai remarqué que tu regardes toujours les profils avec des chiens. Spoiler: Le chien n\'est pas célibataire. Mais je respecte tes priorités! 🐕💕',
    icon: '💕',
    gradient: { from: '#fa709a', to: '#fee140' },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: 'romantic',
    likes: 2341,
    dislikes: 12,
    shares: 567,
    userReaction: 'like',
  },
  {
    id: 'nar4',
    type: 'narrative',
    title: 'Le coin philosophie',
    content: 'Statistique du jour: Tu passes 23 minutes par jour sur МойDate. C\'est exactement le temps qu\'il faut pour faire cuire des pâtes parfaites. Coïncidence? Je ne crois pas. 🍝',
    icon: '🎯',
    gradient: { from: '#4facfe', to: '#00f2fe' },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: 'wisdom',
    likes: 1567,
    dislikes: 34,
    shares: 289,
    userReaction: null,
  },
];

// Mock user posts data
const MOCK_USER_POSTS: UserPost[] = [
  {
    id: 'post1',
    type: 'user',
    userId: 'u1',
    userName: 'Sophie',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    verified: true,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    caption: 'Premier date parfait au bord de la Seine! Paris est vraiment la ville de l\'amour 🥰✨',
    images: [
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
    ],
    location: 'Paris, France',
    likes: 234,
    comments: 45,
    shares: 12,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'post2',
    type: 'user',
    userId: 'u2',
    userName: 'Lucas',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    verified: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    caption: 'Quand ton match te dit qu\'il adore la randonnée et tu réalises que tu as menti sur ton profil 😅',
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    ],
    location: 'Chamonix, France',
    likes: 567,
    comments: 89,
    shares: 34,
    isLiked: true,
    isSaved: false,
  },
  {
    id: 'post3',
    type: 'user',
    userId: 'u3',
    userName: 'Emma',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    verified: true,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    caption: 'Success story! Un an après notre premier match sur МойDate 💕 Merci l\'algorithme!',
    images: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
    ],
    location: 'Lyon, France',
    likes: 1234,
    comments: 234,
    shares: 89,
    isLiked: true,
    isSaved: true,
  },
];

/**
 * Initialize feed in localStorage
 */
const initFeed = (): FeedItem[] => {
  const stored = localStorage.getItem(FEED_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      console.error('Error parsing feed:', error);
    }
  }

  // Interleave narratives and user posts
  const feed: FeedItem[] = [];
  let narIndex = 0;
  let postIndex = 0;

  while (postIndex < MOCK_USER_POSTS.length || narIndex < MOCK_NARRATIVES.length) {
    // Add 2-3 user posts
    for (let i = 0; i < 2 && postIndex < MOCK_USER_POSTS.length; i++) {
      feed.push(MOCK_USER_POSTS[postIndex++]);
    }

    // Add 1 narrative
    if (narIndex < MOCK_NARRATIVES.length) {
      feed.push(MOCK_NARRATIVES[narIndex++]);
    }
  }

  localStorage.setItem(FEED_KEY, JSON.stringify(feed));
  return feed;
};

/**
 * Get narratives enabled state
 */
export const getNarrativesEnabled = (): boolean => {
  const stored = localStorage.getItem(NARRATIVES_ENABLED_KEY);
  return stored ? JSON.parse(stored) : true; // Enabled by default
};

/**
 * Set narratives enabled state
 */
export const setNarrativesEnabled = (enabled: boolean): void => {
  localStorage.setItem(NARRATIVES_ENABLED_KEY, JSON.stringify(enabled));

};

/**
 * Get feed items
 */
export const getFeed = (): FeedItem[] => {
  return initFeed();
};

/**
 * Get narrative stories for top bar
 */
export const getNarrativeStories = (): NarrativeStory[] => {
  const narratives = MOCK_NARRATIVES;
  return narratives.map(nar => ({
    id: `story-${nar.id}`,
    narrativeId: nar.id,
    title: nar.title,
    preview: nar.content.substring(0, 50) + '...',
    icon: nar.icon,
    gradient: nar.gradient,
    viewed: false,
  }));
};

/**
 * Like/Unlike user post
 */
export const toggleLikePost = (postId: string): void => {
  const feed = getFeed();
  const updated = feed.map(item => {
    if (item.type === 'user' && item.id === postId) {
      return {
        ...item,
        isLiked: !item.isLiked,
        likes: item.isLiked ? item.likes - 1 : item.likes + 1,
      };
    }
    return item;
  });
  localStorage.setItem(FEED_KEY, JSON.stringify(updated));
};

/**
 * Save/Unsave user post
 */
export const toggleSavePost = (postId: string): void => {
  const feed = getFeed();
  const updated = feed.map(item => {
    if (item.type === 'user' && item.id === postId) {
      return {
        ...item,
        isSaved: !item.isSaved,
      };
    }
    return item;
  });
  localStorage.setItem(FEED_KEY, JSON.stringify(updated));
};

/**
 * React to narrative (like/dislike)
 */
export const reactToNarrative = (narrativeId: string, reaction: 'like' | 'dislike'): void => {
  const feed = getFeed();
  const updated = feed.map(item => {
    if (item.type === 'narrative' && item.id === narrativeId) {
      const wasLike = item.userReaction === 'like';
      const wasDislike = item.userReaction === 'dislike';

      let newLikes = item.likes;
      let newDislikes = item.dislikes;

      // Remove previous reaction
      if (wasLike) newLikes--;
      if (wasDislike) newDislikes--;

      // Add new reaction if different
      const newReaction = item.userReaction === reaction ? null : reaction;
      if (newReaction === 'like') newLikes++;
      if (newReaction === 'dislike') newDislikes++;

      return {
        ...item,
        userReaction: newReaction,
        likes: newLikes,
        dislikes: newDislikes,
      };
    }
    return item;
  });
  localStorage.setItem(FEED_KEY, JSON.stringify(updated));
};

/**
 * Share item (narrative or post)
 */
export const shareItem = (itemId: string): void => {
  const feed = getFeed();
  const updated = feed.map(item => {
    if (item.id === itemId) {
      return {
        ...item,
        shares: item.shares + 1,
      };
    }
    return item;
  });
  localStorage.setItem(FEED_KEY, JSON.stringify(updated));

};

/**
 * Reset feed to initial state
 */
export const resetFeed = (): void => {
  localStorage.removeItem(FEED_KEY);
  localStorage.removeItem(NARRATIVES_ENABLED_KEY);

};
