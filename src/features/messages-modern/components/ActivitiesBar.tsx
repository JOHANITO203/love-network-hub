/**
 * МойDate - ActivitiesBar Component
 * Horizontal scrolling stories/activities with colored halos
 */

import { motion } from 'framer-motion';
import { Activity } from '../types';
import { cn } from '@/lib/utils';

interface ActivitiesBarProps {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
}

export const ActivitiesBar: React.FC<ActivitiesBarProps> = ({
  activities,
  onActivityClick,
}) => {
  if (activities.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 py-4">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {activities.map((activity, index) => (
            <motion.button
              key={activity.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onActivityClick(activity)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              {/* Avatar with Halo */}
              <div className="relative">
                {/* Halo Effect - Colored ring for new content */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-full blur-sm transition-opacity duration-300",
                    activity.viewed ? "opacity-0" : "opacity-100"
                  )}
                  style={{
                    background: activity.viewed
                      ? 'transparent'
                      : 'linear-gradient(135deg, #ff6b9d, #c084fc, #60a5fa, #fbbf24)',
                    padding: '3px',
                  }}
                />

                {/* Ring Container */}
                <div
                  className={cn(
                    "relative w-16 h-16 rounded-full p-0.5 transition-all duration-300",
                    activity.viewed
                      ? "bg-gray-300 dark:bg-gray-700"
                      : "bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500"
                  )}
                >
                  {/* Avatar */}
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900 p-0.5">
                    <img
                      src={activity.avatar}
                      alt={activity.userName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* New Badge */}
                  {!activity.viewed && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">•</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name */}
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[64px] truncate">
                {activity.userName}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
