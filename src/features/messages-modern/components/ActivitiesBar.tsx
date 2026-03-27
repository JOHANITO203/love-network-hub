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
    <div className="glass-surface border-b border-white/10 py-4">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white/80">Stories</h3>
          <span className="text-xs text-white/40">Moments récents</span>
        </div>
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
              <div className="relative">
                <div
                  className={cn(
                    'absolute inset-0 rounded-full blur-md transition-opacity duration-300',
                    activity.viewed ? 'opacity-20' : 'opacity-100'
                  )}
                  style={{
                    background: activity.viewed
                      ? 'rgba(255,255,255,0.2)'
                      : 'linear-gradient(135deg, #ff4d6d, #5aa9ff, #4bd4a6)',
                    padding: '3px',
                  }}
                />

                <div
                  className={cn(
                    'relative w-16 h-16 rounded-full p-0.5 transition-all duration-300',
                    activity.viewed ? 'bg-white/20' : 'bg-gradient-to-br from-[#ff4d6d] via-[#8b5cf6] to-[#5aa9ff]'
                  )}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0b0f1a] p-0.5">
                    <img
                      src={activity.avatar}
                      alt={activity.userName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {!activity.viewed && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#ff4d6d] to-[#ff8b5a] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">•</span>
                    </div>
                  )}
                </div>
              </div>

              <span className="text-xs font-medium text-white/70 max-w-[64px] truncate">
                {activity.userName}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
