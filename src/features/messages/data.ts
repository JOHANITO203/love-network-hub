export interface StoryItem {
  id: string;
  name: string;
  image: string;
  isActive?: boolean;
  isUser?: boolean;
}

export interface MessageListItem {
  id: string;
  name: string;
  preview: string;
  time: string;
  avatar: string;
  unreadCount?: number;
  status?: "online" | "offline" | "typing";
}

export const mockStories: StoryItem[] = [
  {
    id: "story-0",
    name: "You",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isUser: true,
  },
  {
    id: "story-1",
    name: "Emma",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
    isActive: true,
  },
  {
    id: "story-2",
    name: "Ava",
    image: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "story-3",
    name: "Sophia",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "story-4",
    name: "Grace",
    image: "https://images.unsplash.com/photo-1491349174775-f64c6f66d38d?auto=format&fit=crop&w=200&q=80",
  },
];

export const mockMessages: MessageListItem[] = [
  {
    id: "msg-1",
    name: "Emelie",
    preview: "Sticker ??",
    time: "23 min",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    unreadCount: 1,
    status: "online",
  },
  {
    id: "msg-2",
    name: "Abigail",
    preview: "Typing...",
    time: "27 min",
    avatar: "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=200&q=80",
    status: "typing",
  },
  {
    id: "msg-3",
    name: "Elizabeth",
    preview: "Ok, see you then.",
    time: "33 min",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "msg-4",
    name: "Penelope",
    preview: "You: Hey! What’s up, long time..",
    time: "50 min",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "msg-5",
    name: "Chloe",
    preview: "You: Hello how are you?",
    time: "55 min",
    avatar: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "msg-6",
    name: "Grace",
    preview: "Great! I will write later the exact time and place.",
    time: "1 hour",
    avatar: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=200&q=80",
  },
];
