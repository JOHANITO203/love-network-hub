/**
 * МойDate - useSocialFeed Hook
 * Manages social feed state and operations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FeedItem, NarrativeStory } from '../types';
import {
  getFeed,
  getNarrativeStories,
  getNarrativesEnabled,
  setNarrativesEnabled,
  toggleLikePost,
  toggleSavePost,
  reactToNarrative,
  shareItem,
} from '../store/socialStore';

export const useSocialFeed = () => {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [narrativeStories, setNarrativeStories] = useState<NarrativeStory[]>([]);
  const [showNarratives, setShowNarratives] = useState(true);
  const [loading, setLoading] = useState(true);

  /**
   * Load feed data
   */
  const loadFeed = useCallback(() => {
    setLoading(true);
    try {
      const feedData = getFeed();
      const storiesData = getNarrativeStories();
      const narrativesEnabled = getNarrativesEnabled();

      setFeed(feedData);
      setNarrativeStories(storiesData);
      setShowNarratives(narrativesEnabled);


    } catch (error) {
      console.error('Error loading social feed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Toggle narratives visibility
   */
  const toggleNarratives = useCallback(() => {
    const newValue = !showNarratives;
    setShowNarratives(newValue);
    setNarrativesEnabled(newValue);

  }, [showNarratives]);

  /**
   * Filter feed based on narratives visibility
   */
  const filteredFeed = useMemo(() => {
    if (showNarratives) {
      return feed;
    }
    return feed.filter(item => item.type === 'user');
  }, [feed, showNarratives]);

  /**
   * Like/Unlike post
   */
  const handleLikePost = useCallback((postId: string) => {
    toggleLikePost(postId);
    setFeed(prev => prev.map(item => {
      if (item.type === 'user' && item.id === postId) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1,
        };
      }
      return item;
    }));
  }, []);

  /**
   * Save/Unsave post
   */
  const handleSavePost = useCallback((postId: string) => {
    toggleSavePost(postId);
    setFeed(prev => prev.map(item => {
      if (item.type === 'user' && item.id === postId) {
        return {
          ...item,
          isSaved: !item.isSaved,
        };
      }
      return item;
    }));
  }, []);

  /**
   * React to narrative
   */
  const handleReactNarrative = useCallback((narrativeId: string, reaction: 'like' | 'dislike') => {
    reactToNarrative(narrativeId, reaction);
    setFeed(prev => prev.map(item => {
      if (item.type === 'narrative' && item.id === narrativeId) {
        const wasLike = item.userReaction === 'like';
        const wasDislike = item.userReaction === 'dislike';

        let newLikes = item.likes;
        let newDislikes = item.dislikes;

        if (wasLike) newLikes--;
        if (wasDislike) newDislikes--;

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
    }));
  }, []);

  /**
   * Share item
   */
  const handleShare = useCallback((itemId: string) => {
    shareItem(itemId);
    setFeed(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          shares: item.shares + 1,
        };
      }
      return item;
    }));
  }, []);

  /**
   * Get stats
   */
  const stats = useMemo(() => {
    const narrativeCount = feed.filter(item => item.type === 'narrative').length;
    const postCount = feed.filter(item => item.type === 'user').length;

    return {
      total: feed.length,
      narratives: narrativeCount,
      posts: postCount,
    };
  }, [feed]);

  /**
   * Load feed on mount
   */
  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  return {
    feed: filteredFeed,
    narrativeStories,
    showNarratives,
    toggleNarratives,
    loading,
    stats,
    handleLikePost,
    handleSavePost,
    handleReactNarrative,
    handleShare,
    loadFeed,
  };
};
