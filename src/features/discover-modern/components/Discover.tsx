/**
 * МойDate - Discover Screen
 * Main discovery interface with swipe cards, filters, and modals
 */

import { useState } from 'react';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDiscoverProfiles } from '../hooks/useDiscoverProfiles';
import { useSwipe } from '../hooks/useSwipe';
import { SwipeCard } from './SwipeCard';
import { ActionButtons, KeyboardHints } from './ActionButtons';
import { ProfileModal } from './ProfileModal';
import { FiltersSidebar } from './FiltersSidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Discover: React.FC = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const {
    currentProfile,
    loading,
    hasMore,
    filters,
    updateFilters,
    resetFilters,
    nextProfile,
    loadProfiles,
  } = useDiscoverProfiles();

  const {
    motionValues,
    swipeDirection,
    isDragging,
    handleDrag,
    handleDragEnd,
    handleLike,
    handleSkip,
    handleSuperLike,
  } = useSwipe(currentProfile, {
    onSwipeComplete: () => {
      nextProfile();
    },
  });

  const handleOpenProfile = () => {
    if (currentProfile) {
      setIsProfileModalOpen(true);
    }
  };

  const handleMessage = () => {

    // TODO: Navigate to messages or open chat
  };

  const handleReport = () => {

    // TODO: Open report/block modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">
            Discover
          </h1>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFilterOpen(true)}
            className="rounded-full"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {loading ? (
          // Loading State
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Finding matches for you...
              </p>
            </div>
          </div>
        ) : !currentProfile || !hasMore ? (
          // Empty State
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center space-y-6 max-w-md">
              <div className="text-6xl">💫</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                No More Profiles
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You've seen everyone in your area! Try adjusting your filters or check back later for new matches.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    resetFilters();
                    loadProfiles();
                  }}
                  className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                  size="lg"
                >
                  Reset Filters
                </Button>
                <Button
                  onClick={() => setIsFilterOpen(true)}
                  variant="outline"
                  size="lg"
                >
                  Adjust Filters
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Swipe Card Stack
          <div className="relative">
            {/* Card Container */}
            <div className="relative flex items-center justify-center h-[600px] mb-8">
              <SwipeCard
                profile={currentProfile}
                motionValues={motionValues}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                onOpenProfile={handleOpenProfile}
                swipeDirection={swipeDirection}
                isDragging={isDragging}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <ActionButtons
                onSkip={handleSkip}
                onLike={handleLike}
                onSuperLike={handleSuperLike}
                disabled={!currentProfile}
              />
              <KeyboardHints />
            </div>

            {/* Stats Display (Dev Mode) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs text-gray-600 dark:text-gray-400 font-mono">
                <div className="font-semibold mb-2">Dev Stats:</div>
                <div>Profile: {currentProfile?.id} ({currentProfile?.name})</div>
                <div>Has More: {hasMore ? 'Yes' : 'No'}</div>
                <div>Active Filters: {JSON.stringify(filters)}</div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Profile Modal */}
      <ProfileModal
        profile={currentProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLike={() => {
          handleLike();
          setIsProfileModalOpen(false);
        }}
        onSkip={() => {
          handleSkip();
          setIsProfileModalOpen(false);
        }}
        onSuperLike={() => {
          handleSuperLike();
          setIsProfileModalOpen(false);
        }}
        onMessage={handleMessage}
        onReport={handleReport}
      />

      {/* Filters Sidebar */}
      <FiltersSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={() => {
          resetFilters();
          setIsFilterOpen(false);
        }}
      />
    </div>
  );
};
