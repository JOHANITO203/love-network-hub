/**
 * МойDate - Messages Store
 * Mock localStorage-based store for messages data
 */

import { Conversation, Message, Activity, ConversationFilter } from '../types';

const CONVERSATIONS_KEY = 'moydate_conversations';
const ACTIVITIES_KEY = 'moydate_activities';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    matchId: 'm1',
    matchName: 'Anna',
    matchAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    lastMessage: {
      id: 'msg1',
      conversationId: 'conv1',
      sender: 'them',
      type: 'text',
      content: 'Hey, how was your day? 🙂',
      translated: { language: 'ru', text: 'Привет, как прошел твой день? 🙂' },
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
        id: 'msg1-0',
        conversationId: 'conv1',
        sender: 'them',
        type: 'text',
        content: 'Hey, how was your day? 🙂',
        translated: { language: 'ru', text: 'Привет, как прошел твой день? 🙂' },
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        status: 'seen',
      },
      {
        id: 'msg1-1',
        conversationId: 'conv1',
        sender: 'me',
        type: 'text',
        content: 'It was great! I went to Red Square today.',
        translated: { language: 'ru', text: 'Было отлично! Сегодня я была на Красной площади.' },
        timestamp: new Date(Date.now() - 17 * 60 * 1000),
        status: 'seen',
      },
      {
        id: 'msg1-2',
        conversationId: 'conv1',
        sender: 'them',
        type: 'text',
        content: 'Wow, I would love to go there! Send me some photos 📸',
        translated: { language: 'ru', text: 'Ого, я бы хотела там побывать! Пришли фото 📸' },
        timestamp: new Date(Date.now() - 14 * 60 * 1000),
        status: 'seen',
      },
      {
        id: 'msg1-3',
        conversationId: 'conv1',
        sender: 'me',
        type: 'image',
        content: 'photos',
        mediaUrls: [
          'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600',
          'https://images.unsplash.com/photo-1486026757060-7abf9fb9a9b5?w=600',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600',
        ],
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        status: 'seen',
      },
    ],
  },
  {
    id: 'conv2',
    matchId: 'm2',
    matchName: 'Alexei',
    matchAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    lastMessage: {
      id: 'msg2',
      conversationId: 'conv2',
      sender: 'me',
      type: 'text',
      content: 'Looking forward to our date!',
      translated: { language: 'ru', text: 'Жду нашего свидания!' },
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
        content: 'Looking forward to our date!',
        translated: { language: 'ru', text: 'Жду нашего свидания!' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'seen',
      },
    ],
  },
  {
    id: 'conv3',
    matchId: 'm3',
    matchName: 'Diana',
    matchAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    lastMessage: {
      id: 'msg3',
      conversationId: 'conv3',
      sender: 'them',
      type: 'text',
      content: 'Good morning ☀️',
      translated: { language: 'ru', text: 'Доброе утро ☀️' },
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
        content: 'Good morning ☀️',
        translated: { language: 'ru', text: 'Доброе утро ☀️' },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'delivered',
      },
    ],
  },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act1',
    userId: 'm1',
    userName: 'Olga',
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
    userName: 'Nikita',
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
    userName: 'Elena',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    type: 'status',
    content: {
      type: 'text',
      text: 'À la recherche de nouvelles aventures! ✨',
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    viewed: false,
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
  },
];

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

export const getConversations = (): Conversation[] => {
  return initConversations();
};

export const getActivities = (): Activity[] => {
  return initActivities();
};

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

export const markAsRead = (conversationId: string): void => {
  const conversations = getConversations();
  const updated = conversations.map(conv =>
    conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
  );
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
};

export const togglePin = (conversationId: string): void => {
  const conversations = getConversations();
  const updated = conversations.map(conv =>
    conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
  );
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
};

export const toggleFavorite = (conversationId: string): void => {
  const conversations = getConversations();
  const updated = conversations.map(conv =>
    conv.id === conversationId ? { ...conv, isFavorite: !conv.isFavorite } : conv
  );
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
};

export const deleteConversation = (conversationId: string): void => {
  const conversations = getConversations();
  const updated = conversations.filter(conv => conv.id !== conversationId);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
};

export const addReaction = (conversationId: string, messageId: string, emoji: string): void => {
  const conversations = getConversations();
  const updated = conversations.map(conv => {
    if (conv.id === conversationId) {
      const messages = conv.messages.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
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

export const markActivityViewed = (activityId: string): void => {
  const activities = getActivities();
  const updated = activities.map(act =>
    act.id === activityId ? { ...act, viewed: true } : act
  );
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
};

export const searchMessages = (query: string): any[] => {
  if (!query.trim()) return [];

  const conversations = getConversations();
  const results: any[] = [];
  const lowerQuery = query.toLowerCase();

  conversations.forEach(conv => {
    if (conv.matchName.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'conversation',
        conversationId: conv.id,
        matchName: conv.matchName,
      });
    }

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
