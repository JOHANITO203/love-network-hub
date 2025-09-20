import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  age: number;
  date_of_birth: string;
  bio: string;
  location: string;
  profession: string;
  astrological_sign: string;
  interests: string[];
  profile_images: string[];
}

interface UserPreferences {
  min_age: number;
  max_age: number;
  max_distance: number;
  interested_in: string[];
}

interface MatchingProfile extends Profile {
  compatibility_score: number;
  distance?: number;
  common_interests: string[];
}

export const useMatching = () => {
  const [potentialMatches, setPotentialMatches] = useState<MatchingProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<MatchingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserPreferences();
      loadPotentialMatches();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUserPreferences(data);
      } else {
        // Create default preferences
        const defaultPrefs = {
          user_id: user.id,
          min_age: 18,
          max_age: 50,
          max_distance: 50,
          interested_in: ['all']
        };

        const { data: newPrefs, error: createError } = await supabase
          .from('user_preferences')
          .insert(defaultPrefs)
          .select()
          .single();

        if (createError) throw createError;
        setUserPreferences(newPrefs);
      }
    } catch (error: any) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadPotentialMatches = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get user's own profile first
      const { data: myProfile, error: myProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (myProfileError) throw myProfileError;

      // Get all profiles except the current user
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id)
        .not('profile_images', 'is', null) // Only profiles with images
        .not('first_name', 'is', null)
        .not('last_name', 'is', null);

      if (profilesError) throw profilesError;

      // Get user's interactions to filter out already seen profiles
      const { data: interactions, error: interactionsError } = await supabase
        .from('user_interactions')
        .select('to_user_id')
        .eq('from_user_id', user.id);

      if (interactionsError) throw interactionsError;

      const seenUserIds = new Set(interactions.map(i => i.to_user_id));

      // Filter and score profiles
      const scoredProfiles = (allProfiles || [])
        .filter(profile => !seenUserIds.has(profile.user_id))
        .map(profile => calculateCompatibilityScore(profile, myProfile, userPreferences))
        .filter(profile => profile.compatibility_score > 0)
        .sort((a, b) => b.compatibility_score - a.compatibility_score);

      setPotentialMatches(scoredProfiles);
      setCurrentProfile(scoredProfiles[0] || null);
    } catch (error: any) {
      console.error('Error loading matches:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les profils",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCompatibilityScore = (
    profile: Profile, 
    myProfile: Profile, 
    preferences: UserPreferences | null
  ): MatchingProfile => {
    let score = 0;
    const commonInterests: string[] = [];

    // Age compatibility (40% of score)
    if (preferences) {
      const ageInRange = profile.age >= preferences.min_age && profile.age <= preferences.max_age;
      if (ageInRange) {
        score += 40;
      } else {
        // Return early if age is not compatible
        return {
          ...profile,
          compatibility_score: 0,
          common_interests: []
        };
      }
    }

    // Common interests (30% of score)
    if (profile.interests && myProfile.interests) {
      const myInterests = new Set(myProfile.interests);
      profile.interests.forEach(interest => {
        if (myInterests.has(interest)) {
          commonInterests.push(interest);
        }
      });
      
      const interestScore = Math.min(30, (commonInterests.length / Math.max(profile.interests.length, myProfile.interests.length)) * 30);
      score += interestScore;
    }

    // Location proximity (20% of score) - simplified for now
    if (profile.location && myProfile.location) {
      const sameLocation = profile.location.toLowerCase().includes(myProfile.location.toLowerCase()) ||
                          myProfile.location.toLowerCase().includes(profile.location.toLowerCase());
      if (sameLocation) {
        score += 20;
      } else {
        score += 10; // Partial score for different locations
      }
    }

    // Profile completeness (10% of score)
    let completenessScore = 0;
    if (profile.bio && profile.bio.length > 20) completenessScore += 3;
    if (profile.profession) completenessScore += 2;
    if (profile.astrological_sign) completenessScore += 2;
    if (profile.profile_images && profile.profile_images.length > 1) completenessScore += 3;
    score += completenessScore;

    // Astrological compatibility bonus (bonus points)
    if (profile.astrological_sign && myProfile.astrological_sign) {
      const compatibleSigns = getCompatibleSigns(myProfile.astrological_sign);
      if (compatibleSigns.includes(profile.astrological_sign)) {
        score += 5;
      }
    }

    return {
      ...profile,
      compatibility_score: Math.round(score),
      common_interests: commonInterests
    };
  };

  const getCompatibleSigns = (sign: string): string[] => {
    const compatibility: Record<string, string[]> = {
      'aries': ['leo', 'sagittarius', 'gemini', 'aquarius'],
      'taurus': ['virgo', 'capricorn', 'cancer', 'pisces'],
      'gemini': ['libra', 'aquarius', 'aries', 'leo'],
      'cancer': ['scorpio', 'pisces', 'taurus', 'virgo'],
      'leo': ['aries', 'sagittarius', 'gemini', 'libra'],
      'virgo': ['taurus', 'capricorn', 'cancer', 'scorpio'],
      'libra': ['gemini', 'aquarius', 'leo', 'sagittarius'],
      'scorpio': ['cancer', 'pisces', 'virgo', 'capricorn'],
      'sagittarius': ['aries', 'leo', 'libra', 'aquarius'],
      'capricorn': ['taurus', 'virgo', 'scorpio', 'pisces'],
      'aquarius': ['gemini', 'libra', 'aries', 'sagittarius'],
      'pisces': ['cancer', 'scorpio', 'taurus', 'capricorn']
    };
    
    return compatibility[sign] || [];
  };

  const handleLike = async (profileId: string) => {
    if (!user || !currentProfile) return;

    try {
      const { error } = await supabase
        .from('user_interactions')
        .insert({
          from_user_id: user.id,
          to_user_id: currentProfile.user_id,
          interaction_type: 'like'
        });

      if (error) throw error;

      // Check if it's a match
      const { data: existingLike } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('from_user_id', currentProfile.user_id)
        .eq('to_user_id', user.id)
        .eq('interaction_type', 'like')
        .maybeSingle();

      if (existingLike) {
        toast({
          title: "🎉 C'est un match !",
          description: `Vous et ${currentProfile.first_name} vous aimez mutuellement !`,
        });
      } else {
        toast({
          title: "👍 Profil liké",
          description: `Vous avez liké ${currentProfile.first_name}`,
        });
      }

      moveToNextProfile();
    } catch (error: any) {
      console.error('Error liking profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de liker ce profil",
        variant: "destructive",
      });
    }
  };

  const handlePass = async (profileId: string) => {
    if (!user || !currentProfile) return;

    try {
      const { error } = await supabase
        .from('user_interactions')
        .insert({
          from_user_id: user.id,
          to_user_id: currentProfile.user_id,
          interaction_type: 'pass'
        });

      if (error) throw error;

      moveToNextProfile();
    } catch (error: any) {
      console.error('Error passing profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de passer ce profil",
        variant: "destructive",
      });
    }
  };

  const moveToNextProfile = () => {
    const currentIndex = potentialMatches.findIndex(p => p.id === currentProfile?.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < potentialMatches.length) {
      setCurrentProfile(potentialMatches[nextIndex]);
    } else {
      // No more profiles, try to load more
      setCurrentProfile(null);
      loadPotentialMatches();
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...userPreferences,
          ...newPreferences
        })
        .select()
        .single();

      if (error) throw error;

      setUserPreferences(data);
      // Reload matches with new preferences
      loadPotentialMatches();

      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences de matching ont été sauvegardées",
      });
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
        variant: "destructive",
      });
    }
  };

  return {
    currentProfile,
    potentialMatches,
    userPreferences,
    loading,
    handleLike,
    handlePass,
    updatePreferences,
    loadPotentialMatches
  };
};