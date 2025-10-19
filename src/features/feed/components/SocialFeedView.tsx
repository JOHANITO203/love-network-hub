import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useIntl } from 'react-intl';
import { useToast } from '@/hooks/use-toast';
import { StoryViewer } from '@/features/stories';
import { getTemplateByType, fillTemplate } from '@/data/feedTemplates';
import { FeedStoriesRail } from './FeedStoriesRail';
import { FeedPostCard } from './FeedPostCard';
import { NarratorBanner } from './NarratorBanner';
import { feedStories, type FeedStory } from '../data/stories';
import { feedPosts } from '../data/posts';

type ReactionType = 'like' | 'comment' | 'superlike' | 'share';

export const SocialFeedView = () => {
  const intl = useIntl();
  const { toast } = useToast();
  const [activeStory, setActiveStory] = useState<FeedStory | null>(null);

  const storyById = useMemo(() => {
    const map = new Map<string, FeedStory>();
    feedStories.forEach((story) => map.set(story.id, story));
    return map;
  }, []);

  const narratorMessage = useMemo(() => {
    const template = getTemplateByType('fan_club');
    if (!template) {
      return intl.formatMessage({ id: 'feed.narrator.fallback' });
    }
    return fillTemplate(template.template, {
      username: 'Le narrateur',
      sign: 'Taureau',
      like_count: 342,
    });
  }, [intl]);

  const handleOpenStory = (storyIdOrStory: string | FeedStory) => {
    if (typeof storyIdOrStory === 'string') {
      const story = storyById.get(storyIdOrStory);
      if (story) {
        setActiveStory(story);
      }
      return;
    }
    setActiveStory(storyIdOrStory);
  };

  const handleReaction = (postId: string, reaction: ReactionType) => {
    const title = intl.formatMessage({ id: `feed.toast.${reaction}.title` });
    const description = intl.formatMessage({ id: `feed.toast.${reaction}.description` }, { postId });

    toast({ title, description });
  };

  const handleViewProfile = (userId: string) => {
    toast({
      title: intl.formatMessage({ id: 'feed.toast.profile.title' }),
      description: intl.formatMessage({ id: 'feed.toast.profile.description' }, { userId }),
    });
  };

  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-24 pt-6 md:max-w-3xl">
      <NarratorBanner message={narratorMessage} />
      <FeedStoriesRail stories={feedStories} onOpenStory={handleOpenStory} />

      <section className="flex flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {feedPosts.map((post) => (
            <FeedPostCard
              key={post.id}
              post={post}
              onOpenStory={handleOpenStory}
              onReact={handleReaction}
              onViewProfile={handleViewProfile}
            />
          ))}
        </AnimatePresence>
      </section>

      {activeStory && (
        <StoryViewer slides={activeStory.slides} onClose={() => setActiveStory(null)} />
      )}
    </div>
  );
};
