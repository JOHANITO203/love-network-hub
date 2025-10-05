import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "./use-toast";

interface MatchingProfile {
  id: string;
  user_id: string;
  first_name: string;
  age: number;
  bio: string;
  location: string;
  profession: string;
  interests: string[];
  profile_images: string[];
  compatibility_score: number;
  distance?: number;
}

export interface UserPreferences {
  min_age: number;
  max_age: number;
  max_distance: number;
  interested_in: string[];
}

const MOCK_PROFILES: MatchingProfile[] = [
  {
    id: "match-1",
    user_id: "user-101",
    first_name: "Annabelle",
    age: 24,
    bio: "Lover of sunsets and city lights.",
    location: "Chicago, IL",
    profession: "Photographer",
    interests: ["travel", "photography", "yoga"],
    profile_images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"],
    compatibility_score: 78,
    distance: 2,
  },
  {
    id: "match-2",
    user_id: "user-102",
    first_name: "Reagan",
    age: 26,
    bio: "Tech nerd, coffee addict, weekend climber.",
    location: "Chicago, IL",
    profession: "Product Designer",
    interests: ["technology", "coffee", "climbing"],
    profile_images: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"],
    compatibility_score: 85,
    distance: 4,
  },
  {
    id: "match-3",
    user_id: "user-103",
    first_name: "Hadley",
    age: 25,
    bio: "Film buff with a knack for improv.",
    location: "Chicago, IL",
    profession: "Copywriter",
    interests: ["movies", "theatre", "art"],
    profile_images: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"],
    compatibility_score: 82,
    distance: 1,
  },
];

const DEFAULT_PREFERENCES: UserPreferences = {
  min_age: 21,
  max_age: 35,
  max_distance: 25,
  interested_in: ["all"],
};

const STORAGE_KEY = "moydate_preferences";
const SEEN_KEY = "moydate_seen_profiles";

export const useMatching = () => {
  const { toast } = useToast();
  const [potentialMatches, setPotentialMatches] = useState<MatchingProfile[]>(MOCK_PROFILES);
  const [currentProfile, setCurrentProfile] = useState<MatchingProfile | null>(MOCK_PROFILES[0] ?? null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      } catch (error) {
        console.warn("Failed to parse stored preferences", error);
      }
    }
    return DEFAULT_PREFERENCES;
  });
  const [loading, setLoading] = useState(false);

  const moveToNextProfile = useCallback(() => {
    setPotentialMatches((prev) => {
      if (prev.length <= 1) {
        setCurrentProfile(null);
        return prev;
      }
      const [, ...rest] = prev;
      setCurrentProfile(rest[0] ?? null);
      return rest;
    });
  }, []);

  const loadPotentialMatches = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const seenRaw = localStorage.getItem(SEEN_KEY);
      const seenIds: string[] = seenRaw ? JSON.parse(seenRaw) : [];
      const available = MOCK_PROFILES.filter((profile) => !seenIds.includes(profile.id));
      setPotentialMatches(available.length > 0 ? available : MOCK_PROFILES);
      setCurrentProfile(available[0] ?? MOCK_PROFILES[0] ?? null);
      setLoading(false);
    }, 250);
  }, []);

  useEffect(() => {
    loadPotentialMatches();
  }, [loadPotentialMatches]);

  const handleLike = useCallback(async (profileId: string) => {
    const profile = potentialMatches.find((item) => item.id === profileId);
    if (!profile) return;

    const seenRaw = localStorage.getItem(SEEN_KEY);
    const seenIds: string[] = seenRaw ? JSON.parse(seenRaw) : [];
    const nextSeen = Array.from(new Set([...seenIds, profileId]));
    localStorage.setItem(SEEN_KEY, JSON.stringify(nextSeen));

    toast({
      title: "Profil liké",
      description: `Vous avez liké ${profile.first_name}`,
    });

    moveToNextProfile();
  }, [potentialMatches, moveToNextProfile, toast]);

  const handlePass = useCallback(async (profileId: string) => {
    const seenRaw = localStorage.getItem(SEEN_KEY);
    const seenIds: string[] = seenRaw ? JSON.parse(seenRaw) : [];
    const nextSeen = Array.from(new Set([...seenIds, profileId]));
    localStorage.setItem(SEEN_KEY, JSON.stringify(nextSeen));
    moveToNextProfile();
  }, [moveToNextProfile]);

  const handleSuperlike = useCallback(async (profileId: string) => {
    const profile = potentialMatches.find((item) => item.id === profileId);
    if (!profile) return;

    toast({
      title: "Superlike envoyé",
      description: `Vous avez superliké ${profile.first_name}`,
    });

    handleLike(profileId);
  }, [potentialMatches, handleLike, toast]);

  const updatePreferences = useCallback(async (newPrefs: Partial<UserPreferences>) => {
    const merged = { ...userPreferences, ...newPrefs };
    setUserPreferences(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    toast({
      title: "Préférences mises à jour",
      description: "Vos préférences locales ont été enregistrées.",
    });
    loadPotentialMatches();
  }, [userPreferences, loadPotentialMatches, toast]);

  return {
    currentProfile,
    potentialMatches,
    userPreferences,
    loading,
    handleLike,
    handlePass,
    handleSuperlike,
    updatePreferences,
    loadPotentialMatches,
    matchModalData: null,
    showMatchModal: false,
    closeMatchModal: () => {},
  };
};
