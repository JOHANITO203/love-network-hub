/**
 * МойDate - Messages Store
 * Mock localStorage-based store for messages data
 */

import { Conversation, Message, Activity, ConversationFilter } from '../types';

const CONVERSATIONS_KEY = 'moydate_conversations';
const ACTIVITIES_KEY = 'moydate_activities';

// Mock conversations data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    matchId: 'm1',
    matchName: 'Sophie',
    matchAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    lastMessage: {
      id: 'msg1',
      conversationId: 'conv1',
      sender: 'them',
      type: 'text',
      content: 'Hey! Comment ça va? On se voit ce weekend? 😊',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: 'seen',
    },
    unreadCount: 2,
    isPinned: true,
    isFavorite: true,
    isOnline: true,
    isTyping: false,
    messages: [
      {
        id: 'msg1-1',
        conversationId: 'conv1',
        sender: 'me',
        type: 'text',
        content: 'Salut! Oui carrément, ça me dit bien 😊',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'seen',
      },
      {
        id: 'msg1',
        conversationId: 'conv1',
        sender: 'them',
        type: 'text',
        content: 'Hey! Comment ça va? On se voit ce weekend? 😊',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: 'seen',
        reactions: [
          { emoji: '❤️', userId: 'me', timestamp: new Date() },
        ],
      },
    ],
  },
  {
    id: 'conv2',
    matchId: 'm2',
    matchName: 'Lucas',
    matchAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    lastMessage: {
      id: 'msg2',
      conversationId: 'conv2',
      sender: 'me',
      type: 'text',
      content: 'Super! À bientôt alors 👋',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'seen',
    },
    unreadCount: 0,
    isPinned: false,
    isFavorite: false,
    isOnline: false,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    isTyping: false,
    messages: [
      {
        id: 'msg2',
        conversationId: 'conv2',
        sender: 'me',
        type: 'text',
        content: 'Super! À bientôt alors 👋',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'seen',
      },
    ],
  },
  {
    id: 'conv3',
    matchId: 'm3',
    matchName: 'Emma',
    matchAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    lastMessage: {
      id: 'msg3',
      conversationId: 'conv3',
      sender: 'them',
      type: 'text',
      content: 'J\'adore cette photo! Tu as un super style 📸',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'delivered',
    },
    unreadCount: 1,
    isPinned: false,
    isFavorite: true,
    isOnline: false,
    lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isTyping: false,
    messages: [
      {
        id: 'msg3',
        conversationId: 'conv3',
        sender: 'them',
        type: 'text',
        content: 'J\'adore cette photo! Tu as un super style 📸',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'delivered',
      },
    ],
  },
];

// Mock activities data
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act1',
    userId: 'm1',
    userName: 'Sophie',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    type: 'story',
    content: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    viewed: false,
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
  },
  {
    id: 'act2',
    userId: 'm2',
    userName: 'Lucas',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    type: 'story',
    content: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    viewed: true,
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000),
  },
  {
    id: 'act3',
    userId: 'm3',
    userName: 'Emma',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    type: 'status',
    content: {
      type: 'text',
      text: 'À la recherche de nouvelles aventures! 🌍✨',
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    viewed: false,
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
  },
];

/**
 * Initialize conversations in localStorage
 */
const initConversations = (): Conversation[] => {
  const stored = localStorage.getItem(CONVERSATIONS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((conv: any) => ({
        ...conv,
        lastMessage: {
          ...conv.lastMessage,
          timestamp: new Date(conv.lastMessage.timestamp),
        },
        lastSeen: conv.lastSeen ? new Date(conv.lastSeen) : undefined,
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          reactions: msg.reactions?.map((r: any) => ({
            ...r,
            timestamp: new Date(r.timestamp),
          })),
        })),
      }));
    } catch (error) {
      console.error('Error parsing conversations:', error);
    }
  }

  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(MOCK_CONVERSATIONS));
  return MOCK_CONVERSATIONS;
};

/**
 * Initialize activities in localStorage
 */
const initActivities = (): Activity[] => {
  const stored = localStorage.getItem(ACTIVITIES_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((act: any) => ({
        ...act,
        timestamp: new Date(act.timestamp),
        expiresAt: new Date(act.expiresAt),
      }));
    } catch (error) {
      console.error('Error parsing activities:', error);
    }
  }

  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(MOCK_ACTIVITIES));
  return MOCK_ACTIVITIES;
};

/**
 * Get all conversations
 */
export const getConversations = (): Conversation[] => {
  return initConversations();
};

/**
 * Get all activities
 */
export const getActivities = (): Activity[] => {
  return initActivities();
};

/**
 * Filter conversations
 */
export const filterConversations = (
  conversations: Conversation[],
  filter: ConversationFilter
): Conversation[] => {
  switch (filter) {
    case 'unread':
      return conversations.filter(c => c.unreadCount > 0);
    case 'favorites':
      return conversations.filter(c => c.isFavorite);
    case 'recent':
      return conversations
        .filter(c => {
          const hoursSince = (Date.now() - c.lastMessage.timestamp.getTime()) / (1000 * 60 * 60);
          return hoursSince < 24;
        });
    case 'all':
    default:
      return conversations;
  }
};

/**
 * Send message
 */
export const sendMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp' | 'status'>): Message => {
  const conversations = getConversations();
  const newMessage: Message = {
    ...message,
    id: `msg-${Date.now()}`,
    timestamp: new Date(),
    status: 'sent',
  };

  const updatedConversations = conversations.map(conv => {
    if (conv.id === conversationId) {
      return {
        ...conv,
        messages: [...conv.messages, newMessage],
        lastMessage: newMessage,
      };
    }
    return conv;
  });

  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));


  return newMessage;
};

/**
 * Mark conversation as read
 */
export const markAsRead = (conversationId: string): void => {
  const conversations = getConversations();
  const updated = conversations.map(conv =>
    conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
  );
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
};

/**
 * Toggle pin conversation
 */
export const togglePin = (conversationId: string): void => {
  const conversations = getConversations();
  const updated = conversations.map(conv =>
    conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
  );
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
};

/**
 * Toggle favorite conversation
 */
export const toggleFavorite = (conversationId: string): void => {
  const conversations = getConversations();
  const updated = conversations.map(conv =>
    conv.id === conversationId ? { ...conv, isFavorite: !conv.isFavorite } : conv
  );
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
};

/**
 * Delete conversation
 */
export const deleteConversation = (conversationId: string): void => {
  const conversations = getConversations();
  const updated = conversations.filter(conv => conv.id !== conversationId);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
};

/**
 * Add reaction to message
 */
export const addReaction = (conversationId: string, messageId: string, emoji: string): void => {
  const conversations = getConversations();
  const updated = conversations.map(conv => {
    if (conv.id === conversationId) {
      const messages = conv.messages.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          // Remove existing reaction from this user if any
          const filtered = reactions.filter(r => r.userId !== 'me');
          return {
            ...msg,
            reactions: [...filtered, { emoji, userId: 'me', timestamp: new Date() }],
          };
        }
        return msg;
      });
      return { ...conv, messages };
    }
    return conv;
  });

  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
};

/**
 * Mark activity as viewed
 */
export const markActivityViewed = (activityId: string): void => {
  const activities = getActivities();
  const updated = activities.map(act =>
    act.id === activityId ? { ...act, viewed: true } : act
  );
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
};

/**
 * Search in conversations and messages
 */
export const searchMessages = (query: string): any[] => {
  if (!query.trim()) return [];

  const conversations = getConversations();
  const results: any[] = [];
  const lowerQuery = query.toLowerCase();

  conversations.forEach(conv => {
    // Search in match name
    if (conv.matchName.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'conversation',
        conversationId: conv.id,
        matchName: conv.matchName,
      });
    }

    // Search in messages
    conv.messages.forEach(msg => {
      if (msg.content.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'message',
          conversationId: conv.id,
          matchName: conv.matchName,
          message: msg,
          highlight: query,
        });
      }
    });
  });

  return results;
};
