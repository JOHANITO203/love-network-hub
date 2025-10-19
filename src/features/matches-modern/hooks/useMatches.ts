/**
 * МойDate - useMatches Hook
 * Manages matches state, filtering, and grouping
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Match, MatchFilter, GroupedMatches, MatchAction } from '../types';
import {
  getMatches,
  filterMatches,
  groupMatchesByTime,
  saveMatchAction,
  markMatchAsRead,
} from '../store/matchesStore';

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  /**
   * Load matches from store
   */
  const loadMatches = useCallback(() => {
    setLoading(true);
    try {
      const allMatches = getMatches();
      setMatches(allMatches);

    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filter and group matches
   */
  const { filteredMatches, groupedMatches } = useMemo(() => {
    const filtered = filterMatches(matches, filter);
    const grouped = groupMatchesByTime(filtered);

    return {
      filteredMatches: filtered,
      groupedMatches: grouped,
    };
  }, [matches, filter]);

  /**
   * Handle match action
   */
  const handleMatchAction = useCallback((matchId: string, action: MatchAction) => {
    saveMatchAction(matchId, action);

    // If ignoring, remove from list
    if (action === 'ignore') {
      setMatches(prev => prev.filter(m => m.id !== matchId));
    }

    // If viewing, mark as read
    if (action === 'view') {
      markMatchAsRead(matchId);
      setMatches(prev => prev.map(m =>
        m.id === matchId ? { ...m, isNew: false } : m
      ));
    }
  }, []);

  /**
   * Select match for preview
   */
  const selectMatch = useCallback((match: Match | null) => {
    if (match) {
      handleMatchAction(match.id, 'view');
    }
    setSelectedMatch(match);
  }, [handleMatchAction]);

  /**
   * Get new matches count
   */
  const newMatchesCount = useMemo(() => {
    return matches.filter(m => m.isNew).length;
  }, [matches]);

  /**
   * Get section counts
   */
  const sectionCounts = useMemo(() => {
    return {
      today: groupedMatches.today.length,
      yesterday: groupedMatches.yesterday.length,
      thisWeek: groupedMatches.thisWeek.length,
      older: groupedMatches.older.length,
    };
  }, [groupedMatches]);

  /**
   * Load matches on mount
   */
  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  return {
    matches: filteredMatches,
    groupedMatches,
    filter,
    setFilter,
    loading,
    selectedMatch,
    selectMatch,
    handleMatchAction,
    newMatchesCount,
    sectionCounts,
    loadMatches,
  };
};
