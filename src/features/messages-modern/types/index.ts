/**
 * МойDate - Messages Types
 * Type definitions for the modern Messages feature
 */

export type MessageSender = 'me' | 'them';
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'sticker' | 'gif';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'seen';
export type ConversationFilter = 'all' | 'unread' | 'favorites' | 'recent';

export interface MessageReaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  type: MessageType;
  content: string; // text, URL for media, base64 for stickers
  timestamp: Date;
  status?: MessageStatus;
  reactions?: MessageReaction[];
  translated?: {
    language: string;
    text: string;
  };
  // For audio messages
  duration?: number; // in seconds
  // For media
  thumbnail?: string;
  mediaUrl?: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  type: 'story' | 'status';
  content: {
    type: 'image' | 'video' | 'text';
    url?: string;
    text?: string;
  };
  timestamp: Date;
  viewed: boolean;
  expiresAt: Date;
}

export interface Conversation {
  id: string;
  matchId: string;
  matchName: string;
  matchAvatar: string;
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isFavorite: boolean;
  isOnline: boolean;
  lastSeen?: Date;
  isTyping: boolean;
  messages: Message[];
}

export interface SearchResult {
  type: 'conversation' | 'message';
  conversationId: string;
  matchName?: string;
  message?: Message;
  highlight?: string;
}

export interface MessagesState {
  conversations: Conversation[];
  activities: Activity[];
  selectedConversation: Conversation | null;
  filter: ConversationFilter;
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
}

export interface VoiceRecording {
  id: string;
  blob: Blob;
  duration: number;
  url: string;
}

export type PlaybackSpeed = 1 | 1.5 | 2;
