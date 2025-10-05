/**
 * МойDate - useMessages Hook
 * Manages messages state and operations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Conversation, Activity, ConversationFilter, Message } from '../types';
import {
  getConversations,
  getActivities,
  filterConversations,
  sendMessage as sendMessageToStore,
  markAsRead,
  togglePin,
  toggleFavorite,
  deleteConversation,
  addReaction as addReactionToStore,
  markActivityViewed,
  searchMessages as searchMessagesInStore,
} from '../store/messagesStore';

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load conversations and activities
   */
  const loadData = useCallback(() => {
    setLoading(true);
    try {
      const convs = getConversations();
      const acts = getActivities();

      // Sort by pinned, then by last message time
      const sorted = convs.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
      });

      setConversations(sorted);
      setActivities(acts);

    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filter conversations
   */
  const filteredConversations = useMemo(() => {
    return filterConversations(conversations, filter);
  }, [conversations, filter]);

  /**
   * Send message
   */
  const sendMessage = useCallback((conversationId: string, content: string, type: Message['type'] = 'text') => {
    const newMessage = sendMessageToStore(conversationId, {
      conversationId,
      sender: 'me',
      type,
      content,
    });

    // Update local state
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: newMessage,
        };
      }
      return conv;
    }));

    // Update selected conversation
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: newMessage,
      } : null);
    }

    return newMessage;
  }, [selectedConversation]);

  /**
   * Select conversation
   */
  const selectConversation = useCallback((conversation: Conversation | null) => {
    if (conversation) {
      markAsRead(conversation.id);
      setConversations(prev => prev.map(conv =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      ));
    }
    setSelectedConversation(conversation);
  }, []);

  /**
   * Toggle pin
   */
  const handleTogglePin = useCallback((conversationId: string) => {
    togglePin(conversationId);
    loadData();
  }, [loadData]);

  /**
   * Toggle favorite
   */
  const handleToggleFavorite = useCallback((conversationId: string) => {
    toggleFavorite(conversationId);
    loadData();
  }, [loadData]);

  /**
   * Delete conversation
   */
  const handleDelete = useCallback((conversationId: string) => {
    deleteConversation(conversationId);
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
    }
    loadData();
  }, [selectedConversation, loadData]);

  /**
   * Add reaction
   */
  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!selectedConversation) return;

    addReactionToStore(selectedConversation.id, messageId, emoji);

    // Update local state
    setSelectedConversation(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: prev.messages.map(msg => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || [];
            const filtered = reactions.filter(r => r.userId !== 'me');
            return {
              ...msg,
              reactions: [...filtered, { emoji, userId: 'me', timestamp: new Date() }],
            };
          }
          return msg;
        }),
      };
    });
  }, [selectedConversation]);

  /**
   * View activity
   */
  const viewActivity = useCallback((activityId: string) => {
    markActivityViewed(activityId);
    setActivities(prev => prev.map(act =>
      act.id === activityId ? { ...act, viewed: true } : act
    ));
  }, []);

  /**
   * Search
   */
  const search = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchMessagesInStore(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, []);

  /**
   * Get unread count
   */
  const unreadCount = useMemo(() => {
    return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  }, [conversations]);

  /**
   * Get new activities count
   */
  const newActivitiesCount = useMemo(() => {
    return activities.filter(act => !act.viewed).length;
  }, [activities]);

  /**
   * Load data on mount
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    conversations: filteredConversations,
    activities,
    filter,
    setFilter,
    searchQuery,
    searchResults,
    search,
    selectedConversation,
    selectConversation,
    sendMessage,
    togglePin: handleTogglePin,
    toggleFavorite: handleToggleFavorite,
    deleteConversation: handleDelete,
    addReaction,
    viewActivity,
    loading,
    unreadCount,
    newActivitiesCount,
    loadData,
  };
};
