/**
 * МойDate - Discover Screen
 * Main discovery interface with swipe cards, filters, and modals
 */

import { useState } from 'react';
import { SlidersHorizontal, MapPin } from 'lucide-react';
import { useDiscoverProfiles } from '../hooks/useDiscoverProfiles';
import { useSwipe } from '../hooks/useSwipe';
import { SwipeCard } from './SwipeCard';
import { ActionButtons, KeyboardHints } from './ActionButtons';
import { ProfileModal } from './ProfileModal';
import { FiltersSidebar } from './FiltersSidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Discover: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'swipe' | 'map'>('swipe');

  const {
    profiles,
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-surface border-b border-white/10 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white font-display">Découvrir</h1>
            <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
              <MapPin className="w-3 h-3" />
              Moscou • Voronej
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/10 rounded-full p-1">
              <button
                onClick={() => setViewMode('swipe')}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition',
                  viewMode === 'swipe' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                )}
              >
                Swipe
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition',
                  viewMode === 'map' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                )}
              >
                Carte
              </button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFilterOpen(true)}
              className="rounded-full text-white/80 hover:text-white"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-white/60 font-medium">Recherche de profils...</p>
            </div>
          </div>
        ) : !currentProfile || !hasMore ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center space-y-6 max-w-md">
              <div className="text-6xl">💫</div>
              <h2 className="text-2xl font-semibold text-white font-display">
                Plus de profils
              </h2>
              <p className="text-white/60">
                Ajustez vos filtres ou revenez un peu plus tard pour découvrir de nouvelles personnes.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    resetFilters();
                    loadProfiles();
                  }}
                  className="bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a]"
                  size="lg"
                >
                  Réinitialiser les filtres
                </Button>
                <Button onClick={() => setIsFilterOpen(true)} variant="outline" size="lg" className="border-white/20 text-white">
                  Ajuster les filtres
                </Button>
              </div>
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="space-y-6">
            <div className="relative h-[60vh] rounded-[2rem] overflow-hidden glass-panel">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,77,109,0.25),transparent_55%),radial-gradient(circle_at_70%_40%,rgba(90,169,255,0.25),transparent_60%),linear-gradient(120deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

              <div className="absolute top-10 left-10 glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs text-white/60">Zones actives</p>
                <p className="text-sm text-white font-semibold">Moscou, Voronej</p>
              </div>

              <div className="absolute left-[25%] top-[30%]">
                <div className="w-4 h-4 bg-[#ff4d6d] rounded-full shadow-[0_0_18px_rgba(255,77,109,0.7)]" />
                <div className="mt-2 text-xs text-white/70">Moscou</div>
              </div>
              <div className="absolute right-[30%] bottom-[25%]">
                <div className="w-4 h-4 bg-[#5aa9ff] rounded-full shadow-[0_0_18px_rgba(90,169,255,0.7)]" />
                <div className="mt-2 text-xs text-white/70">Voronej</div>
              </div>

              <div className="absolute right-6 top-6 glass-panel rounded-2xl px-4 py-3">
                <p className="text-xs text-white/60">Suggestions proches</p>
                <p className="text-sm text-white font-semibold">{profiles.length} profils en ligne</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/80">À proximité</h3>
              <div className="grid gap-3">
                {profiles.slice(0, 3).map((profile) => (
                  <div key={profile.id} className="glass-panel rounded-2xl p-4 flex items-center gap-3">
                    <img src={profile.images[0]} alt={profile.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {profile.name}, {profile.age}
                      </p>
                      <p className="text-xs text-white/60 truncate">{profile.location}</p>
                    </div>
                    <button
                      onClick={() => setViewMode('swipe')}
                      className="text-xs text-white/70 hover:text-white"
                    >
                      Voir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="relative flex items-center justify-center h-[70vh] mb-8">
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

            <div className="space-y-4">
              <ActionButtons
                onSkip={handleSkip}
                onLike={handleLike}
                onSuperLike={handleSuperLike}
                disabled={!currentProfile}
              />
              <KeyboardHints />
            </div>
          </div>
        )}
      </main>

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
