/**
 * МойDate - SocialFeedScreen Component
 * Main social feed screen with narratives and user posts
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Users, Eye, EyeOff } from 'lucide-react';
import { useSocialFeed } from '../hooks/useSocialFeed';
import { NarrativesBar } from './NarrativesBar';
import { NarrativePost } from './NarrativePost';
import { UserPost } from './UserPost';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const SocialFeedScreen: React.FC = () => {
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'following' | 'popular'>('all');

  const {
    feed,
    narrativeStories,
    showNarratives,
    toggleNarratives,
    loading,
    stats,
    handleLikePost,
    handleSavePost,
    handleReactNarrative,
    handleShare,
  } = useSocialFeed();

  const handleStoryClick = (story: any) => {
    toast({
      title: 'Narratif',
      description: `Viewing: ${story.title}`,
    });
    // TODO: Open narrative story viewer
  };

  const handleComment = (postId: string) => {
    toast({
      title: 'Commentaires',
      description: 'Fonctionnalité à venir!',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                Social Feed
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.posts} posts • {stats.narratives} narratifs
              </p>
            </div>

            {/* Narratives Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleNarratives}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                showNarratives
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
            >
              {showNarratives ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-bold">Narratifs ON</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="text-sm font-bold">Narratifs OFF</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'all' as const, label: 'All', icon: Sparkles },
              { id: 'following' as const, label: 'Following', icon: Users },
              { id: 'popular' as const, label: 'Popular', icon: TrendingUp },
            ].map((filter) => {
              const Icon = filter.icon;
              const isActive = selectedFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive && "fill-current")} />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Narratives Bar (Horizontal Stories) */}
      {showNarratives && narrativeStories.length > 0 && (
        <NarrativesBar
          stories={narrativeStories}
          onStoryClick={handleStoryClick}
        />
      )}

      {/* Feed */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {loading ? (
          // Loading State
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Chargement du feed...
              </p>
            </div>
          </div>
        ) : feed.length === 0 ? (
          // Empty State
          <div className="flex items-center justify-center py-20 px-4">
            <div className="text-center space-y-6 max-w-md">
              <div className="text-6xl">📱</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                Aucun post
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Commencez à suivre des utilisateurs pour voir leur contenu ici!
              </p>
            </div>
          </div>
        ) : (
          // Feed Items
          <AnimatePresence>
            {feed.map((item) => {
              if (item.type === 'narrative') {
                return (
                  <NarrativePost
                    key={item.id}
                    narrative={item}
                    onLike={() => handleReactNarrative(item.id, 'like')}
                    onDislike={() => handleReactNarrative(item.id, 'dislike')}
                    onShare={() => {
                      handleShare(item.id);
                      toast({
                        title: 'Partagé!',
                        description: 'Narratif partagé avec succès',
                      });
                    }}
                  />
                );
              } else {
                return (
                  <UserPost
                    key={item.id}
                    post={item}
                    onLike={() => handleLikePost(item.id)}
                    onComment={() => handleComment(item.id)}
                    onShare={() => {
                      handleShare(item.id);
                      toast({
                        title: 'Partagé!',
                        description: 'Post partagé avec succès',
                      });
                    }}
                    onSave={() => {
                      handleSavePost(item.id);
                      toast({
                        title: item.isSaved ? 'Retiré' : 'Sauvegardé',
                        description: item.isSaved
                          ? 'Post retiré de vos favoris'
                          : 'Post ajouté à vos favoris',
                      });
                    }}
                  />
                );
              }
            })}
          </AnimatePresence>
        )}
      </main>

      {/* Floating Info Card (Optional) */}
      {showNarratives && stats.narratives > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 right-4 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg text-white text-sm font-medium max-w-xs"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>
              {stats.narratives} narratif{stats.narratives > 1 ? 's' : ''} sarcastique{stats.narratives > 1 ? 's' : ''} dans votre feed
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
