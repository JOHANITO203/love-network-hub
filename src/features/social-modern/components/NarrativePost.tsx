/**
 * МойDate - NarrativePost Component
 * Distinct narrative post with gradient background
 */

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Share2, Sparkles } from 'lucide-react';
import { Narrative } from '../types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NarrativePostProps {
  narrative: Narrative;
  onLike: () => void;
  onDislike: () => void;
  onShare: () => void;
}

const CATEGORY_LABELS: Record<Narrative['category'], string> = {
  sarcastic: 'Sarcastique',
  funny: 'Drôle',
  romantic: 'Romantique',
  wisdom: 'Sagesse',
};

export const NarrativePost: React.FC<NarrativePostProps> = ({
  narrative,
  onLike,
  onDislike,
  onShare,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div
        className={cn(
          "relative rounded-3xl overflow-hidden",
          "shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]",
          "transition-shadow duration-300"
        )}
        style={{
          background: `linear-gradient(135deg, ${narrative.gradient.from}, ${narrative.gradient.to})`,
        }}
      >
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
                {narrative.icon}
              </div>

              <div>
                {/* Algorithm Badge */}
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">
                    L'algorithme МойDate
                  </span>
                </div>

                {/* Category & Time */}
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full">
                    {CATEGORY_LABELS[narrative.category]}
                  </span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(narrative.timestamp, {
                      locale: fr,
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* 3D Theater Mask */}
            <div className="text-4xl opacity-80">
              🎭
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 font-display">
            {narrative.title}
          </h3>

          {/* Content */}
          <p className="text-white/95 leading-relaxed text-base mb-6">
            {narrative.content}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            {/* Like/Dislike */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLike}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  narrative.userReaction === 'like'
                    ? "bg-white text-gray-900 shadow-md"
                    : "bg-white/20 hover:bg-white/30 text-white"
                )}
              >
                <ThumbsUp className={cn(
                  "w-4 h-4",
                  narrative.userReaction === 'like' && "fill-current"
                )} />
                <span className="text-sm font-bold">{narrative.likes}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDislike}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  narrative.userReaction === 'dislike'
                    ? "bg-white text-gray-900 shadow-md"
                    : "bg-white/20 hover:bg-white/30 text-white"
                )}
              >
                <ThumbsDown className={cn(
                  "w-4 h-4",
                  narrative.userReaction === 'dislike' && "fill-current"
                )} />
                <span className="text-sm font-bold">{narrative.dislikes}</span>
              </motion.button>
            </div>

            {/* Share */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-bold">{narrative.shares}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
