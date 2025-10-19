/**
 * МойDate - MatchesFilter Component
 * Filter tabs for matches (All, New, Super Likes, Verified)
 */

import { motion } from 'framer-motion';
import { Users, Sparkles, Star, Shield } from 'lucide-react';
import { MatchFilter } from '../types';
import { cn } from '@/lib/utils';

interface MatchesFilterProps {
  activeFilter: MatchFilter;
  onFilterChange: (filter: MatchFilter) => void;
  counts: {
    all: number;
    new: number;
    superlikes: number;
    verified: number;
  };
}

export const MatchesFilter: React.FC<MatchesFilterProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const filters: Array<{
    id: MatchFilter;
    label: string;
    icon: React.ElementType;
    count: number;
  }> = [
    { id: 'all', label: 'All', icon: Users, count: counts.all },
    { id: 'new', label: 'New', icon: Sparkles, count: counts.new },
    { id: 'superlikes', label: 'Super Likes', icon: Star, count: counts.superlikes },
    { id: 'verified', label: 'Verified', icon: Shield, count: counts.verified },
  ];

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;

            return (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFilterChange(filter.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap",
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "fill-current")} />
                <span className="text-sm font-medium">{filter.label}</span>
                {filter.count > 0 && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
                    )}
                  >
                    {filter.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
