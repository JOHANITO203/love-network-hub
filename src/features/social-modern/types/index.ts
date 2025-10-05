/**
 * МойDate - Social Feed Types
 * Type definitions for the modern Social Feed feature
 */

export type PostType = 'user' | 'narrative';

export interface UserPost {
  id: string;
  type: 'user';
  userId: string;
  userName: string;
  userAvatar: string;
  verified: boolean;
  timestamp: Date;
  caption?: string;
  images?: string[];
  location?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Narrative {
  id: string;
  type: 'narrative';
  title: string;
  content: string;
  icon: string; // emoji
  gradient: {
    from: string;
    to: string;
  };
  timestamp: Date;
  category: 'sarcastic' | 'funny' | 'romantic' | 'wisdom';
  likes: number;
  dislikes: number;
  shares: number;
  userReaction?: 'like' | 'dislike' | null;
}

export type FeedItem = UserPost | Narrative;

export interface NarrativeStory {
  id: string;
  narrativeId: string;
  title: string;
  preview: string;
  icon: string;
  gradient: {
    from: string;
    to: string;
  };
  viewed: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
}

export interface SocialState {
  feed: FeedItem[];
  narrativeStories: NarrativeStory[];
  showNarratives: boolean;
  filter: 'all' | 'following' | 'popular';
  loading: boolean;
}
