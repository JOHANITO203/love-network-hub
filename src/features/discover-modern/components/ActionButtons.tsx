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
    hover: { scale: 1.08 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex items-center justify-center gap-5">
      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={onSkip}
        disabled={disabled}
        className={cn(
          'w-14 h-14 rounded-full bg-white/10 border border-white/10',
          'flex items-center justify-center transition-all duration-300',
          'hover:border-rose-400/70 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Passer"
      >
        <X className="w-6 h-6 text-rose-400" />
      </motion.button>

      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={onSuperLike}
        disabled={disabled}
        className={cn(
          'w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg',
          'flex items-center justify-center transition-all duration-300',
          'hover:shadow-[0_0_24px_rgba(56,189,248,0.5)] disabled:opacity-50 disabled:cursor-not-allowed',
          'relative overflow-hidden'
        )}
        aria-label="Super like"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.5 }}
        />
        <Star className="w-5 h-5 text-white fill-current relative z-10" />
      </motion.button>

      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={onLike}
        disabled={disabled}
        className={cn(
          'w-16 h-16 rounded-full bg-gradient-to-br from-[#ff4d6d] to-[#ff8b5a] shadow-lg',
          'flex items-center justify-center transition-all duration-300',
          'hover:shadow-[0_0_28px_rgba(255,77,109,0.5)] disabled:opacity-50 disabled:cursor-not-allowed',
          'relative overflow-hidden'
        )}
        aria-label="Aimer"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.5 }}
        />
        <Heart className="w-7 h-7 text-white fill-current relative z-10" />
      </motion.button>
    </div>
  );
};

export const KeyboardHints: React.FC = () => {
  return (
    <div className="hidden md:flex items-center justify-center gap-8 mt-6 text-xs text-white/40">
      <div className="flex items-center gap-2">
        <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-xs font-mono">←</kbd>
        <span>Passer</span>
      </div>
      <div className="flex items-center gap-2">
        <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-xs font-mono">↑</kbd>
        <span>Super like</span>
      </div>
      <div className="flex items-center gap-2">
        <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-xs font-mono">→</kbd>
        <span>Aimer</span>
      </div>
    </div>
  );
};
