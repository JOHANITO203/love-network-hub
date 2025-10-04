/**
 * МойDate - MatchCard Component
 * Modern match card with quick actions and glassmorphism
 */

import { motion } from 'framer-motion';
import { Heart, X, Star, MessageCircle, MapPin, Shield, Sparkles } from 'lucide-react';
import { Match } from '../types';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  onClick: () => void;
  onMessage: () => void;
  onLike: () => void;
  onIgnore: () => void;
  onSuperLike: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onClick,
  onMessage,
  onLike,
  onIgnore,
  onSuperLike,
}) => {
  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
        "rounded-3xl overflow-hidden",
        "border border-gray-200/50 dark:border-gray-700/50",
        "shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]",
        "transition-all duration-300"
      )}
    >
      {/* Card Content */}
      <div className="flex items-center gap-4 p-4">
        {/* Avatar with Glow Effect */}
        <div className="relative flex-shrink-0">
          <div className={cn(
            "absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500",
            match.isSuperLike ? "bg-blue-400" : "bg-pink-400"
          )} />
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white dark:ring-gray-800">
            <img
              src={match.avatar}
              alt={match.name}
              className="w-full h-full object-cover"
            />
            {match.verified && (
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Shield className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </div>

          {/* New Badge */}
          {match.isNew && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-3 h-3 text-white fill-current" />
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display truncate">
              {match.name}, {match.age}
            </h3>
            {match.isSuperLike && (
              <Star className="w-4 h-4 text-blue-500 fill-current flex-shrink-0" />
            )}
            {match.isMutualLike && (
              <Heart className="w-4 h-4 text-pink-500 fill-current flex-shrink-0" />
            )}
          </div>

          {match.profession && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
              {match.profession}
            </p>
          )}

          {match.location && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>{match.location}</span>
              {match.distance && <span>• {match.distance} km</span>}
            </div>
          )}

          {match.lastMessage && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-1">
              💬 {match.lastMessage.text}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleAction(e, onIgnore)}
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Ignore"
          >
            <X className="w-5 h-5 text-red-500" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleAction(e, onSuperLike)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
            aria-label="Super Like"
          >
            <Star className="w-5 h-5 text-white fill-current" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleAction(e, onLike)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
            aria-label="Like"
          >
            <Heart className="w-5 h-5 text-white fill-current" />
          </motion.button>
        </div>
      </div>

      {/* Message Button */}
      <motion.button
        whileHover={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => handleAction(e, onMessage)}
        className="w-full px-4 py-3 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Send a message</span>
      </motion.button>
    </motion.div>
  );
};
