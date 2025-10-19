/**
 * МойDate - MatchPreviewModal Component
 * Quick preview modal with photo and actions
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Heart, MapPin, Briefcase, Shield, Star } from 'lucide-react';
import { Match } from '../types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MatchPreviewModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onMessage: () => void;
  onViewProfile: () => void;
}

export const MatchPreviewModal: React.FC<MatchPreviewModalProps> = ({
  match,
  isOpen,
  onClose,
  onMessage,
  onViewProfile,
}) => {
  if (!match) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="relative w-full h-80 bg-gray-200 dark:bg-gray-800">
              <img
                src={match.images[0] || match.avatar}
                alt={match.name}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {match.verified && (
                  <div className="px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                    <Shield className="w-3 h-3 fill-current" />
                    Verified
                  </div>
                )}
                {match.isSuperLike && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    Super Like
                  </div>
                )}
                {match.isMutualLike && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                    <Heart className="w-3 h-3 fill-current" />
                    Mutual
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-2">
                  {match.name}, {match.age}
                </h2>

                {match.profession && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{match.profession}</span>
                  </div>
                )}

                {match.location && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {match.location}
                      {match.distance && ` • ${match.distance} km away`}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {match.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                  {match.bio}
                </p>
              )}

              {/* Interests */}
              {match.interests && match.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {match.interests.slice(0, 4).map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}

              {/* Last Message */}
              {match.lastMessage && (
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    💬 {match.lastMessage.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(match.lastMessage.timestamp).toLocaleString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={onViewProfile}
                  variant="outline"
                  size="lg"
                  className="font-medium"
                >
                  View Profile
                </Button>
                <Button
                  onClick={onMessage}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 font-medium"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
