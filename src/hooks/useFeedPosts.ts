import { useCallback, useState } from 'react';
import { feedPosts, type FeedPost } from '@/features/feed';

interface UseFeedPostsState {
  posts: FeedPost[];
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export const useFeedPosts = (): UseFeedPostsState => {
  const [posts, setPosts] = useState<FeedPost[]>(feedPosts);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setPosts((prev) => [...prev, ...feedPosts]);
      setLoadingMore(false);
    }, 600);
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(feedPosts);
      setRefreshing(false);
      setError(null);
    }, 400);
  }, []);

  return {
    posts,
    loading,
    loadingMore,
    refreshing,
    error,
    hasMore: false,
    loadMore,
    refresh,
  };
};
