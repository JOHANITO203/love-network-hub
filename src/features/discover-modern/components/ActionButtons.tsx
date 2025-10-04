/**
 * МойDate - Action Buttons Component
 * Like, Skip, and Super Like buttons
 */

import { motion } from 'framer-motion';
import { X, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonsProps {
  onSkip: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSkip,
  onLike,
  onSuperLike,
  disabled = false,
}) => {
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex items-center justify-center gap-6">
      {/* Skip Button */}
      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={onSkip}
        disabled={disabled}
        className={cn(
          "w-16 h-16 rounded-full bg-white shadow-lg border-2 border-gray-200",
          "flex items-center justify-center transition-all duration-300",
          "hover:border-red-400 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
          "dark:bg-gray-800 dark:border-gray-700 dark:hover:border-red-400"
        )}
        aria-label="Skip"
      >
        <X className="w-7 h-7 text-red-500" />
      </motion.button>

      {/* Super Like Button */}
      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={onSuperLike}
        disabled={disabled}
        className={cn(
          "w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg",
          "flex items-center justify-center transition-all duration-300",
          "hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed",
          "relative overflow-hidden"
        )}
        aria-label="Super Like"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-300 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.5 }}
        />
        <Star className="w-6 h-6 text-white fill-current relative z-10" />
      </motion.button>

      {/* Like Button */}
      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={onLike}
        disabled={disabled}
        className={cn(
          "w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-red-500 shadow-lg",
          "flex items-center justify-center transition-all duration-300",
          "hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] disabled:opacity-50 disabled:cursor-not-allowed",
          "relative overflow-hidden"
        )}
        aria-label="Like"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-pink-300 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.5 }}
        />
        <Heart className="w-7 h-7 text-white fill-current relative z-10" />
      </motion.button>
    </div>
  );
};

/**
 * Keyboard hints component
 */
export const KeyboardHints: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-8 mt-6 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-2">
        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs font-mono">
          ←
        </kbd>
        <span>Skip</span>
      </div>
      <div className="flex items-center gap-2">
        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs font-mono">
          ↑
        </kbd>
        <span>Super Like</span>
      </div>
      <div className="flex items-center gap-2">
        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs font-mono">
          →
        </kbd>
        <span>Like</span>
      </div>
    </div>
  );
};
