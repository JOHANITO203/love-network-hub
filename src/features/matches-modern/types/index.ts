/**
 * МойDate - Matches Types
 * Type definitions for the modern Matches feature
 */

export interface Match {
  id: string;
  name: string;
  age: number;
  avatar: string;
  images: string[];
  bio?: string;
  profession?: string;
  location?: string;
  distance?: number;
  interests?: string[];
  verified?: boolean;
  matchedAt: Date;
  isNew: boolean;
  isSuperLike: boolean;
  isMutualLike: boolean;
  lastMessage?: {
    text: string;
    timestamp: Date;
  };
}

export type MatchFilter = 'all' | 'new' | 'superlikes' | 'verified';

export type MatchSection = 'today' | 'yesterday' | 'thisWeek' | 'older';

export interface GroupedMatches {
  today: Match[];
  yesterday: Match[];
  thisWeek: Match[];
  older: Match[];
}

export interface MatchesState {
  matches: Match[];
  groupedMatches: GroupedMatches;
  filter: MatchFilter;
  loading: boolean;
  selectedMatch: Match | null;
}

export type MatchAction = 'message' | 'like' | 'ignore' | 'superlike' | 'view';

export interface MatchActionEvent {
  matchId: string;
  action: MatchAction;
  timestamp: Date;
}
