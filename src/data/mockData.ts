// Mock data for the dating app demo
import profile1 from "@/assets/profile1.jpg";
import profile2 from "@/assets/profile2.jpg";
import date1 from "@/assets/date1.jpg";
import date2 from "@/assets/date2.jpg";

export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  profession: string;
  images: string[];
  interests: string[];
}

export interface DatePost {
  id: string;
  user: {
    name: string;
    avatar: string;
    age: number;
  };
  partner: {
    name: string;
    avatar: string;
  };
  date: {
    title: string;
    location: string;
    date: string;
    rating: number;
    image: string;
    description: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  timeAgo: string;
}

export const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Emma",
    age: 26,
    bio: "Adventure seeker who loves hiking, photography, and trying new coffee shops. Always up for spontaneous road trips and deep conversations under the stars ✨",
    location: "San Francisco, CA",
    profession: "UX Designer",
    images: [profile1, profile1, profile1],
    interests: ["Photography", "Hiking", "Coffee", "Travel", "Art", "Yoga"]
  },
  {
    id: "2",
    name: "Alex",
    age: 29,
    bio: "Chef by day, musician by night. I believe the best dates involve good food, great music, and even better company. Let's cook something amazing together! 🍳",
    location: "San Francisco, CA",
    profession: "Chef",
    images: [profile2, profile2, profile2],
    interests: ["Cooking", "Music", "Wine", "Travel", "Film", "Fitness"]
  },
  {
    id: "3",
    name: "Sofia",
    age: 24,
    bio: "Bookworm and aspiring novelist with a passion for vintage markets and indie films. Looking for someone who appreciates the little things in life 📚",
    location: "Berkeley, CA",
    profession: "Writer",
    images: [profile1, profile1, profile1],
    interests: ["Reading", "Writing", "Vintage", "Film", "Art", "Tea"]
  },
];

export const mockDatePosts: DatePost[] = [
  {
    id: "1",
    user: {
      name: "Emma",
      avatar: profile1,
      age: 26
    },
    partner: {
      name: "Alex",
      avatar: profile2
    },
    date: {
      title: "Perfect Evening at Chez Laurent",
      location: "Chez Laurent, Downtown",
      date: "March 15, 2024",
      rating: 5,
      image: date1,
      description: "Had the most incredible dinner date tonight! The ambiance was perfect, the food was amazing, and the conversation flowed so naturally. Alex surprised me with my favorite dessert - he remembered from our first conversation! Sometimes the best dates are the ones where time just stops. ❤️"
    },
    likes: 47,
    comments: 12,
    isLiked: false,
    timeAgo: "2 hours ago"
  },
  {
    id: "2",
    user: {
      name: "Sofia",
      avatar: profile1,
      age: 24
    },
    partner: {
      name: "Marcus",
      avatar: profile2
    },
    date: {
      title: "Morning Coffee & Park Stroll",
      location: "Golden Gate Park",
      date: "March 14, 2024",
      rating: 4,
      image: date2,
      description: "Started our Sunday with coffee and a beautiful walk through the park. There's something magical about discovering the city together. We found this hidden garden and spent hours just talking and people-watching. Simple dates are often the best dates! ☕"
    },
    likes: 32,
    comments: 8,
    isLiked: true,
    timeAgo: "1 day ago"
  }
];

export interface MatchSummary {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timeAgo: string;
  isOnline: boolean;
}

export const mockMatches: MatchSummary[] = [
  {
    id: "m1",
    name: "Emma",
    avatar: profile1,
    lastMessage: "Would love to grab coffee this weekend!",
    timeAgo: "10 min ago",
    isOnline: true
  },
  {
    id: "m2",
    name: "Alex",
    avatar: profile2,
    lastMessage: "That restaurant looks amazing 😍",
    timeAgo: "1 hour ago",
    isOnline: false
  }
];
