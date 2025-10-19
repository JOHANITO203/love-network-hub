export interface StorySlide {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  mediaUrl: string;
  duration?: number;
}

export const mockStorySlides: StorySlide[] = [
  {
    id: "story-1",
    user: {
      name: "Annabelle",
      avatar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
    },
    mediaUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    duration: 5,
  },
  {
    id: "story-2",
    user: {
      name: "Grace",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
    mediaUrl: "https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?auto=format&fit=crop&w=1200&q=80",
    duration: 5,
  },
];
