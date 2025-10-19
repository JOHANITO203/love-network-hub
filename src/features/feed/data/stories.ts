import type { StorySlide } from '@/features/stories';

export interface FeedStory {
  id: string;
  username: string;
  avatar: string;
  isNew: boolean;
  label: string;
  slides: StorySlide[];
}

export const feedStories: FeedStory[] = [
  {
    id: 'feed-story-1',
    username: 'Aïcha',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    isNew: true,
    label: 'Live',
    slides: [
      {
        id: 'feed-story-1-slide-1',
        user: {
          name: 'Aïcha',
          avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
        },
        mediaUrl: 'https://images.unsplash.com/photo-1520854221050-0f4caff449fb?auto=format&fit=crop&w=1200&q=80',
        duration: 5,
      },
      {
        id: 'feed-story-1-slide-2',
        user: {
          name: 'Aïcha',
          avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
        },
        mediaUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
        duration: 5,
      },
    ],
  },
  {
    id: 'feed-story-2',
    username: 'Marcus',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    isNew: false,
    label: 'Recap',
    slides: [
      {
        id: 'feed-story-2-slide-1',
        user: {
          name: 'Marcus',
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
        },
        mediaUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        duration: 5,
      },
    ],
  },
  {
    id: 'feed-story-3',
    username: 'Linh',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    isNew: true,
    label: 'Spotlight',
    slides: [
      {
        id: 'feed-story-3-slide-1',
        user: {
          name: 'Linh',
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
        },
        mediaUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1200&q=80',
        duration: 5,
      },
    ],
  },
  {
    id: 'feed-story-4',
    username: 'Sasha',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    isNew: false,
    label: 'Behind',
    slides: [
      {
        id: 'feed-story-4-slide-1',
        user: {
          name: 'Sasha',
          avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
        },
        mediaUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=80',
        duration: 5,
      },
    ],
  },
  {
    id: 'feed-story-5',
    username: 'Noa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isNew: true,
    label: 'Daily',
    slides: [
      {
        id: 'feed-story-5-slide-1',
        user: {
          name: 'Noa',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        },
        mediaUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
        duration: 5,
      },
    ],
  },
];
