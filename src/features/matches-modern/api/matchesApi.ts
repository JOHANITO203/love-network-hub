import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { Match, MatchAction } from '../types';
import {
  getMatches as getMatchesLocal,
  markMatchAsRead,
  saveMatchAction,
} from '../store/matchesStore';

type MatchRow = Tables<'matches'>;
type ProfileRow = Tables<'profiles'>;
type InteractionRow = Tables<'user_interactions'>;

interface FetchMatchesOptions {
  userId?: string | null;
}

const FALLBACK_DELAY_MS = 250;

const createFallbackMatchList = (): Match[] => {
  return getMatchesLocal();
};

const mapProfileToMatch = (
  row: MatchRow,
  profile: ProfileRow | undefined,
  currentUserId?: string | null,
  interactions?: InteractionRow[] | null,
): Match => {
  const otherUserId =
    currentUserId && row.user1_id === currentUserId ? row.user2_id : row.user1_id;

  const interactionSet = new Set(
    (interactions ?? [])
      .filter((item) => item.interaction_type === 'superlike')
      .map((item) => item.to_user_id),
  );

  const matchedAt = row.matched_at ? new Date(row.matched_at) : new Date();
  const isNew = Date.now() - matchedAt.getTime() < 48 * 3600 * 1000;
  const isSuperLike = otherUserId ? interactionSet.has(otherUserId) : false;

  const avatar = profile?.profile_images?.[0] ?? 'https://ui-avatars.com/api/?name=MoyDate';

  return {
    id: row.id,
    name:
      [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
      profile?.first_name ||
      'MoyDate user',
    age: profile?.age ?? (profile?.date_of_birth ? calculateAge(profile.date_of_birth) : 25),
    avatar,
    images: profile?.profile_images ?? [avatar],
    bio: profile?.bio ?? undefined,
    profession: profile?.profession ?? undefined,
    location: profile?.location ?? undefined,
    interests: profile?.interests ?? undefined,
    verified: (profile as ProfileRow & { is_verified?: boolean | null })?.is_verified ?? false,
    distance: undefined,
    matchedAt,
    isNew,
    isSuperLike,
    isMutualLike: row.is_active ?? true,
    lastMessage: row.last_message_at
      ? {
          text: '',
          timestamp: new Date(row.last_message_at),
        }
      : undefined,
  };
};

const calculateAge = (date: string): number => {
  const birth = new Date(date);
  if (Number.isNaN(birth.getTime())) return 25;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
};

export const fetchMatches = async (options: FetchMatchesOptions = {}): Promise<Match[]> => {
  const { userId } = options;

  if (!userId) {
    // Sans utilisateur authentifié, on revient sur la source mockée.
    return createFallbackMatchList();
  }

  try {
    const { data: matchRows, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('matched_at', { ascending: false });

    if (matchError) {
      throw matchError;
    }

    const otherUserIds = new Set<string>();
    (matchRows ?? []).forEach((row) => {
      const otherId = row.user1_id === userId ? row.user2_id : row.user1_id;
      if (otherId) {
        otherUserIds.add(otherId);
      }
    });

    const [{ data: profileRows, error: profileError }, interactionsResult] = await Promise.all([
      otherUserIds.size
        ? supabase
            .from('profiles')
            .select(
              'id,user_id,first_name,last_name,age,date_of_birth,bio,location,profession,profile_images,interests',
            )
            .in('user_id', Array.from(otherUserIds))
        : Promise.resolve({ data: [] as ProfileRow[], error: null }),
      supabase
        .from('user_interactions')
        .select('from_user_id,to_user_id,interaction_type')
        .eq('from_user_id', userId),
    ]);

    if (profileError) {
      throw profileError;
    }

    const profileMap = new Map<string, ProfileRow>();
    (profileRows ?? []).forEach((profile) => {
      profileMap.set(profile.user_id, profile);
    });

    const matches = (matchRows ?? []).map((row) =>
      mapProfileToMatch(row, profileMap.get(row.user1_id === userId ? row.user2_id : row.user1_id), userId, interactionsResult.data),
    );

    return matches;
  } catch (error) {
    console.warn('[matchesApi] Supabase fetch failed, falling back to mock data.', error);
    await new Promise((resolve) => setTimeout(resolve, FALLBACK_DELAY_MS));
    return createFallbackMatchList();
  }
};

export interface PerformMatchActionPayload {
  userId?: string | null;
  matchId: string;
  action: MatchAction;
}

const persistInteraction = async (payload: PerformMatchActionPayload) => {
  const { userId, matchId, action } = payload;
  if (!userId) return;

  try {
    if (action === 'ignore') {
      const { error } = await supabase
        .from('matches')
        .update({ is_active: false })
        .eq('id', matchId);
      if (error) throw error;
      return;
    }

    if (action === 'message') {
      const { error } = await supabase
        .from('matches')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', matchId);
      if (error) throw error;
      return;
    }

    if (action === 'view') {
      const { error } = await supabase
        .from('matches')
        .update({ is_active: true })
        .eq('id', matchId);
      if (error) throw error;
      return;
    }

    // like / superlike : on persiste dans user_interactions
    const interactionType = action === 'superlike' ? 'superlike' : 'like';
    const { data: matchRow } = await supabase
      .from('matches')
      .select('user1_id,user2_id')
      .eq('id', matchId)
      .maybeSingle();

    if (!matchRow) return;

    const targetUserId = matchRow.user1_id === userId ? matchRow.user2_id : matchRow.user1_id;
    if (!targetUserId) return;

    const { error } = await supabase.from('user_interactions').upsert(
      {
        from_user_id: userId,
        to_user_id: targetUserId,
        interaction_type: interactionType,
      },
      { onConflict: 'from_user_id,to_user_id' },
    );
    if (error) throw error;
  } catch (error) {
    console.warn('[matchesApi] Failed to persist match action to Supabase.', error);
  }
};

export const performMatchAction = async ({
  userId,
  matchId,
  action,
}: PerformMatchActionPayload): Promise<Match[]> => {
  try {
    await persistInteraction({ userId, matchId, action });

    if (action === 'view') {
      markMatchAsRead(matchId);
    }

    if (userId) {
      return fetchMatches({ userId });
    }
  } catch (error) {
    console.warn('[matchesApi] Falling back to local store for match action.', error);
  }

  // Fallback local si Supabase n'est pas disponible
  saveMatchAction(matchId, action);
  if (action === 'view') {
    markMatchAsRead(matchId);
  }
  return getMatchesLocal();
};
