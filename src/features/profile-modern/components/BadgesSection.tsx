/**
 * МойDate - Badges Section Component
 * Display unlocked and locked badges with tooltips
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import type { Badge } from '../types';
import { BADGE_RARITY_CONFIG } from '../types';

interface BadgesSectionProps {
  badges: Badge[];
}

export const BadgesSection = ({ badges }: BadgesSectionProps) => {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const unlockedBadges = badges.filter((b) => b.unlockedAt);
  const lockedBadges = badges.filter((b) => !b.unlockedAt);

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 border border-border/50 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Badges</h2>
        <span className="text-sm text-muted-foreground">
          {unlockedBadges.length}/{badges.length}
        </span>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Débloqués
          </h3>
          <div className="flex flex-wrap gap-3">
            {unlockedBadges.map((badge) => (
              <BadgeItem
                key={badge.id}
                badge={badge}
                isLocked={false}
                isHovered={hoveredBadge === badge.id}
                onHover={() => setHoveredBadge(badge.id)}
                onLeave={() => setHoveredBadge(null)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            À débloquer
          </h3>
          <div className="flex flex-wrap gap-3">
            {lockedBadges.map((badge) => (
              <BadgeItem
                key={badge.id}
                badge={badge}
                isLocked={true}
                isHovered={hoveredBadge === badge.id}
                onHover={() => setHoveredBadge(badge.id)}
                onLeave={() => setHoveredBadge(null)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface BadgeItemProps {
  badge: Badge;
  isLocked: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const BadgeItem = ({ badge, isLocked, isHovered, onHover, onLeave }: BadgeItemProps) => {
  const rarityConfig = BADGE_RARITY_CONFIG[badge.rarity];

  return (
    <div className="relative">
      {/* Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onHoverStart={onHover}
        onHoverEnd={onLeave}
        className={`
          relative w-20 h-20 rounded-2xl flex items-center justify-center cursor-pointer
          ${
            isLocked
              ? 'bg-gray-200 dark:bg-gray-800'
              : `bg-gradient-to-br ${rarityConfig.gradient}`
          }
          border-2 ${isLocked ? 'border-gray-300 dark:border-gray-700' : 'border-white dark:border-gray-900'}
          shadow-lg
        `}
      >
        {/* Icon */}
        <span
          className={`text-3xl ${isLocked ? 'opacity-30 grayscale' : ''}`}
        >
          {badge.icon}
        </span>

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl backdrop-blur-sm">
            <Lock className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Rarity Indicator */}
        {!isLocked && (
          <div
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${rarityConfig.color} border-2 border-white dark:border-gray-900`}
          />
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48"
          >
            <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-xl p-3 shadow-xl border border-gray-700">
              {/* Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 border-r border-b border-gray-700 rotate-45" />

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{badge.icon}</span>
                  <h4 className="font-semibold text-sm">{badge.name}</h4>
                </div>
                <p className="text-xs text-gray-300 mb-2">{badge.description}</p>

                {/* Rarity */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r ${rarityConfig.gradient} text-white`}
                  >
                    {badge.rarity}
                  </span>
                  {badge.unlockedAt && (
                    <span className="text-xs text-gray-400">
                      {new Date(badge.unlockedAt).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
