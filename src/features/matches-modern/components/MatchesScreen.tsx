/**
 * МойDate - MatchesScreen Component
 * Modern matches screen with temporal sections and filters
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { MatchCard } from './MatchCard';
import { MatchPreviewModal } from './MatchPreviewModal';
import { MatchesFilter } from './MatchesFilter';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const MatchesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  const {
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
  } = useMatches();

  const handleMessage = (matchId: string) => {
    handleMatchAction(matchId, 'message');
    toast({
      title: 'Message envoyé',
      description: 'Votre message a été envoyé avec succès!',
    });
    // TODO: Navigate to messages
  };

  const handleLike = (matchId: string) => {
    handleMatchAction(matchId, 'like');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    toast({
      title: '💕 Like réciproque!',
      description: 'Vous vous aimez tous les deux!',
    });
  };

  const handleIgnore = (matchId: string) => {
    handleMatchAction(matchId, 'ignore');
    toast({
      title: 'Profil ignoré',
      description: 'Ce profil a été retiré de vos matchs.',
    });
  };

  const handleSuperLike = (matchId: string) => {
    handleMatchAction(matchId, 'superlike');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    toast({
      title: '⭐ Super Like!',
      description: 'Vous avez envoyé un Super Like!',
    });
  };

  const handleViewProfile = () => {
    if (selectedMatch) {
      toast({
        title: 'Profil complet',
        description: 'Ouverture du profil complet...',
      });
      // TODO: Navigate to full profile
    }
  };

  // Calculate filter counts
  const allMatches = [
    ...groupedMatches.today,
    ...groupedMatches.yesterday,
    ...groupedMatches.thisWeek,
    ...groupedMatches.older,
  ];

  const filterCounts = {
    all: allMatches.length,
    new: allMatches.filter(m => m.isNew).length,
    superlikes: allMatches.filter(m => m.isSuperLike).length,
    verified: allMatches.filter(m => m.verified).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: 'linear',
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#ff6b9d', '#c084fc', '#60a5fa', '#fbbf24'][
                    Math.floor(Math.random() * 4)
                  ],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                  Matches
                </h1>
                {newMatchesCount > 0 && (
                  <p className="text-xs text-primary font-medium">
                    {newMatchesCount} nouveau{newMatchesCount > 1 ? 'x' : ''}
                  </p>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={loadMatches}
              className="rounded-full"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <MatchesFilter
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={filterCounts}
      />

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {loading ? (
          // Loading State
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Loading matches...
              </p>
            </div>
          </div>
        ) : allMatches.length === 0 ? (
          // Empty State
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-6 max-w-md">
              <div className="text-6xl">💫</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                No Matches Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Start swiping to find your perfect match!
              </p>
              <Button
                onClick={() => navigate('/discover')}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                size="lg"
              >
                Start Discovering
              </Button>
            </div>
          </div>
        ) : (
          // Matches List with Temporal Sections
          <div className="space-y-6">
            {/* Today Section */}
            {sectionCounts.today > 0 && (
              <div>
                <SectionHeader section="today" count={sectionCounts.today} />
                <div className="space-y-3 mt-3">
                  {groupedMatches.today.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => selectMatch(match)}
                      onMessage={() => handleMessage(match.id)}
                      onLike={() => handleLike(match.id)}
                      onIgnore={() => handleIgnore(match.id)}
                      onSuperLike={() => handleSuperLike(match.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday Section */}
            {sectionCounts.yesterday > 0 && (
              <div>
                <SectionHeader section="yesterday" count={sectionCounts.yesterday} />
                <div className="space-y-3 mt-3">
                  {groupedMatches.yesterday.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => selectMatch(match)}
                      onMessage={() => handleMessage(match.id)}
                      onLike={() => handleLike(match.id)}
                      onIgnore={() => handleIgnore(match.id)}
                      onSuperLike={() => handleSuperLike(match.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* This Week Section */}
            {sectionCounts.thisWeek > 0 && (
              <div>
                <SectionHeader section="thisWeek" count={sectionCounts.thisWeek} />
                <div className="space-y-3 mt-3">
                  {groupedMatches.thisWeek.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => selectMatch(match)}
                      onMessage={() => handleMessage(match.id)}
                      onLike={() => handleLike(match.id)}
                      onIgnore={() => handleIgnore(match.id)}
                      onSuperLike={() => handleSuperLike(match.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Older Section */}
            {sectionCounts.older > 0 && (
              <div>
                <SectionHeader section="older" count={sectionCounts.older} />
                <div className="space-y-3 mt-3">
                  {groupedMatches.older.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => selectMatch(match)}
                      onMessage={() => handleMessage(match.id)}
                      onLike={() => handleLike(match.id)}
                      onIgnore={() => handleIgnore(match.id)}
                      onSuperLike={() => handleSuperLike(match.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      <MatchPreviewModal
        match={selectedMatch}
        isOpen={!!selectedMatch}
        onClose={() => selectMatch(null)}
        onMessage={() => {
          if (selectedMatch) {
            handleMessage(selectedMatch.id);
            selectMatch(null);
          }
        }}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
};
