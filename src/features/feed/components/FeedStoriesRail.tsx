import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { FeedStory } from '../data/stories';

interface FeedStoriesRailProps {
  stories: FeedStory[];
  onOpenStory: (story: FeedStory) => void;
}

export const FeedStoriesRail = ({ stories, onOpenStory }: FeedStoriesRailProps) => {
  return (
    <div className="no-scrollbar -mx-4 flex items-stretch gap-3 overflow-x-auto px-4 pb-6">
      {stories.map((story, index) => (
        <motion.button
          key={story.id}
          type="button"
          onClick={() => onOpenStory(story)}
          className={cn(
            'relative flex w-[88px] flex-col items-center gap-2 rounded-3xl bg-white/70 p-3 shadow-soft backdrop-blur transition-transform',
            'hover:-translate-y-1 hover:shadow-glow focus-visible:-translate-y-1 focus-visible:shadow-glow',
          )}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <div
            className={cn(
              'relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/60 bg-gradient-to-br p-[3px]',
              story.isNew
                ? 'from-brand-red via-brand-orange to-brand-purple'
                : 'from-border via-border to-border'
            )}
          >
            <div className="h-full w-full overflow-hidden rounded-[18px]">
              <img
                src={story.avatar}
                alt={story.username}
                className="h-full w-full object-cover"
              />
            </div>
            {story.isNew && (
              <span className="absolute -bottom-1 right-0 rounded-full bg-brand-red px-2 py-[2px] text-[11px] font-semibold text-white shadow-soft">
                {story.label}
              </span>
            )}
          </div>
          <span className="text-center text-xs font-semibold text-foreground line-clamp-2">
            {story.username}
          </span>
        </motion.button>
      ))}
    </div>
  );
};
