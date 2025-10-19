import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { DiscoverFilters, Profile, SwipeAction } from '../types';
import {
  getUserStats,
  saveUserAction as saveUserActionLocal,
} from '../store/userStats';

type ProfileRow = Tables<'profiles'> & {
  gender?: string | null;
  is_verified?: boolean | null;
  height_cm?: number | null;
  distance_km?: number | null;
};

type InteractionRow = Tables<'user_interactions'>;

const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Sophie Paris',
    age: 28,
    profession: 'Designer',
    location: 'Paris, France',
    distance: 5,
    bio: 'Passionate about art, coffee, and genuine conversations. Always ready to explore hidden cafés and galleries across the city.',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    ],
    verified: true,
    interests: ['Art', 'Travel', 'Photography'],
    gender: 'female',
    zodiacSign: 'Gemini',
    height: 165,
  },
  {
    id: '2',
    name: 'Lucas',
    age: 32,
    profession: 'Software Engineer',
    location: 'Lyon, France',
    distance: 12,
    bio: 'Tech enthusiast, foodie, and outdoor runner. Down for rooftop drinks, live music, and good debate over the latest sci-fi show.',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    verified: true,
    interests: ['Technology', 'Hiking', 'Cooking'],
    gender: 'male',
    zodiacSign: 'Leo',
    height: 180,
  },
  {
    id: '3',
    name: 'Emma',
    age: 25,
    profession: 'Photographer',
    location: 'Nice, France',
    distance: 8,
    bio: 'Capturing sunlight, sea breeze, and candid smiles. Looking for someone who loves road trips and spontaneous sessions at the beach.',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
    ],
    verified: false,
    interests: ['Photography', 'Travel', 'Music'],
    gender: 'female',
    zodiacSign: 'Pisces',
    height: 168,
  },
  {
    id: '4',
    name: 'Thomas',
    age: 29,
    profession: 'Architect',
    location: 'Marseille, France',
    distance: 15,
    bio: 'Designing meaningful spaces by day, tasting wine and sketching cityscapes by night. Partners in crime welcome for sunset escapes.',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800',
    ],
    verified: true,
    interests: ['Architecture', 'Wine', 'Reading'],
    gender: 'male',
    zodiacSign: 'Virgo',
    height: 175,
  },
];

const FALLBACK_DELAY_MS = 350;
const PROFILES_LIMIT = 40;

const calculateAge = (date: string | null): number | undefined => {
  if (!date) return undefined;
  const birthDate = new Date(date);
  if (Number.isNaN(birthDate.getTime())) return undefined;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

const mapProfileRowToProfile = (row: ProfileRow): Profile => {
  const primaryImage = row.profile_images?.[0];
  const ageFromRow = row.age ?? calculateAge(row.date_of_birth);
  const nameParts = [row.first_name, row.last_name].filter(Boolean);

  return {
    id: row.user_id ?? row.id,
    name: nameParts.length > 0 ? nameParts.join(' ') : row.first_name ?? 'MoyDate user',
    age: ageFromRow ?? 25,
    profession: row.profession ?? undefined,
    location: row.location ?? undefined,
    distance: (row as ProfileRow).distance_km ?? undefined,
    bio: row.bio ?? undefined,
    images: row.profile_images ?? (primaryImage ? [primaryImage] : []),
    verified: row.is_verified ?? false,
    interests: row.interests ?? undefined,
    gender: (row as ProfileRow).gender ?? undefined,
    zodiacSign: row.astrological_sign ?? undefined,
    height: (row as ProfileRow).height_cm ?? undefined,
  };
};

const buildExcludedIds = (interactions: InteractionRow[] | null): Set<string> => {
  if (!interactions) return new Set();
  return new Set(
    interactions
      .filter((interaction) => interaction.to_user_id)
      .map((interaction) => interaction.to_user_id),
  );
};

const applyFilters = (
  profiles: Profile[],
  filters: DiscoverFilters,
  excludedIds: Set<string>,
): Profile[] => {
  return profiles.filter((profile) => {
    if (excludedIds.has(profile.id)) {
      return false;
    }

    if (filters.gender !== 'all' && profile.gender && profile.gender !== filters.gender) {
      return false;
    }

    if (typeof profile.distance === 'number') {
      const { min, max } = filters.distance;
      if (profile.distance < min || profile.distance > max) {
        return false;
      }
    }

    const { min: minAge, max: maxAge } = filters.ageRange;
    if (profile.age < minAge || profile.age > maxAge) {
      return false;
    }

    if (filters.verifiedOnly && profile.verified === false) {
      return false;
    }

    return true;
  });
};

interface FetchProfilesOptions {
  userId?: string | null;
}

export const fetchProfiles = async (
  filters: DiscoverFilters,
  options: FetchProfilesOptions = {},
): Promise<Profile[]> => {
  const { userId } = options;

  try {
    let query = supabase
      .from('profiles')
      .select(
        'id,user_id,first_name,last_name,age,date_of_birth,bio,location,profession,profile_images,interests,astrological_sign',
      )
      .limit(PROFILES_LIMIT);

    if (userId) {
      query = query.neq('user_id', userId);
    }

    const [{ data: profileRows, error: profilesError }, interactionsResult] = await Promise.all([
      query,
      userId
        ? supabase
            .from('user_interactions')
            .select('to_user_id,interaction_type')
            .eq('from_user_id', userId)
        : Promise.resolve({ data: null, error: null }),
    ]);

    if (profilesError) {
      throw profilesError;
    }

    const excludedIds =
      interactionsResult?.error || !userId
        ? buildExcludedIds(null)
        : buildExcludedIds(interactionsResult.data);

    const mappedProfiles = (profileRows ?? []).map(mapProfileRowToProfile);
    return applyFilters(mappedProfiles, filters, excludedIds);
  } catch (error) {
    console.warn('[discoverApi] Supabase fetch failed, falling back to mock data.', error);
    await new Promise((resolve) => setTimeout(resolve, FALLBACK_DELAY_MS));
    const stats = getUserStats();
    const excluded = new Set([...stats.likedProfiles, ...stats.skippedProfiles]);
    return applyFilters(MOCK_PROFILES, filters, excluded);
  }
};

interface RecordSwipeOptions {
  userId?: string | null;
  targetUserId: string;
  action: SwipeAction;
}

const mapSwipeActionToInteraction = (action: SwipeAction): InteractionRow['interaction_type'] => {
  switch (action) {
    case 'like':
      return 'like';
    case 'skip':
      return 'skip';
    case 'superlike':
      return 'superlike';
    default:
      return action;
  }
};

export const recordSwipeAction = async ({
  userId,
  targetUserId,
  action,
}: RecordSwipeOptions) => {
  if (!userId) {
    // Pas d'utilisateur authentifié : on utilise le fallback local.
    saveUserActionLocal(targetUserId, action);
    return;
  }

  try {
    const { error } = await supabase.from('user_interactions').upsert(
      {
        from_user_id: userId,
        to_user_id: targetUserId,
        interaction_type: mapSwipeActionToInteraction(action),
      },
      { onConflict: 'from_user_id,to_user_id' },
    );

    if (error) {
      throw error;
    }
  } catch (error) {
    console.warn('[discoverApi] Unable to persist swipe action to Supabase, using local fallback.', error);
    saveUserActionLocal(targetUserId, action);
  }
};
