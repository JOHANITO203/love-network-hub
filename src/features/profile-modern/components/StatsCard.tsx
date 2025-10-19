/**
 * МойDate - Stats Card Component
 * Profile views, engagement score, and other metrics
 */

import { motion } from 'framer-motion';
import { Eye, TrendingUp, TrendingDown, Heart, MessageCircle, Users } from 'lucide-react';
import type { ProfileStats } from '../types';

interface StatsCardProps {
  stats: ProfileStats;
}

export const StatsCard = ({ stats }: StatsCardProps) => {
  const isEngagementAboveAverage = stats.engagementVsAverage > 0;

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 border border-border/50 dark:border-gray-800">
      {/* Header */}
      <h2 className="text-xl font-bold text-foreground mb-6">Statistiques</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Profile Views */}
        <StatItem
          icon={<Eye className="w-5 h-5" />}
          label="Vues (7j)"
          value={stats.profileViews7d}
          change={stats.profileViewsChange}
          color="text-blue-500"
        />

        {/* Total Likes */}
        <StatItem
          icon={<Heart className="w-5 h-5" />}
          label="Likes reçus"
          value={stats.totalLikesReceived}
          color="text-red-500"
        />

        {/* Total Matches */}
        <StatItem
          icon={<Users className="w-5 h-5" />}
          label="Matchs"
          value={stats.totalMatchesCount}
          color="text-purple-500"
        />

        {/* Total Messages */}
        <StatItem
          icon={<MessageCircle className="w-5 h-5" />}
          label="Messages"
          value={stats.totalMessagesCount}
          color="text-green-500"
        />
      </div>

      {/* Engagement Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-love-primary/10 to-love-secondary/10 dark:from-love-primary/5 dark:to-love-secondary/5 rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Score d'engagement</span>
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {stats.engagementScore}/100
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.engagementScore}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-love-primary to-love-secondary rounded-full"
          />
        </div>

        {/* Vs Average */}
        <div className="flex items-center gap-1 text-sm">
          {isEngagementAboveAverage ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                +{stats.engagementVsAverage}% vs moyenne
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 dark:text-orange-400">
                {stats.engagementVsAverage}% vs moyenne
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Hot Streak */}
      {stats.hotStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-3 text-white text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bold">Hot Streak: {stats.hotStreak} jours</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  change?: number;
  color?: string;
}

const StatItem = ({ icon, label, value, change, color = 'text-gray-500' }: StatItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4"
    >
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-2xl font-bold text-foreground mb-1">
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>

      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {change > 0 ? (
            <>
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400">+{change}%</span>
            </>
          ) : change < 0 ? (
            <>
              <TrendingDown className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-600 dark:text-red-400">{change}%</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      )}
    </motion.div>
  );
};
