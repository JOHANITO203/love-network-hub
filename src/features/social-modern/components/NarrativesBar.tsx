/**
 * МойDate - NarrativesBar Component
 * Horizontal scrolling narratives like stories
 */

import { motion } from 'framer-motion';
import { NarrativeStory } from '../types';
import { cn } from '@/lib/utils';

interface NarrativesBarProps {
  stories: NarrativeStory[];
  onStoryClick: (story: NarrativeStory) => void;
}

export const NarrativesBar: React.FC<NarrativesBarProps> = ({
  stories,
  onStoryClick,
}) => {
  if (stories.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 py-4">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white font-display uppercase tracking-wider">
            🎭 Narratifs de l'algorithme
          </h2>
          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold">
            {stories.length}
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {stories.map((story, index) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStoryClick(story)}
              className="flex-shrink-0 w-24 group"
            >
              {/* Card with Gradient */}
              <div
                className={cn(
                  "relative w-24 h-32 rounded-2xl overflow-hidden transition-all duration-300",
                  "shadow-md hover:shadow-xl",
                  story.viewed && "opacity-70"
                )}
                style={{
                  background: `linear-gradient(135deg, ${story.gradient.from}, ${story.gradient.to})`,
                }}
              >
                {/* Icon */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 text-4xl">
                  {story.icon}
                </div>

                {/* Preview Text */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/20 backdrop-blur-sm">
                  <p className="text-xs text-white font-medium line-clamp-2 leading-tight">
                    {story.preview}
                  </p>
                </div>

                {/* Viewed Indicator */}
                {story.viewed && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-lg">✓</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <p className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-2 text-center">
                {story.title}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
