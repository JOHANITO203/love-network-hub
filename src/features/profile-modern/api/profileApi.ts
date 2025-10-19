import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { ProfileEditData, ProfileMedia, UserProfile } from '../types';
import {
  addMedia as addMediaLocal,
  getDefaultProfile,
  getUserProfile as getUserProfileLocal,
  removeMedia as removeMediaLocal,
  saveUserProfile as saveUserProfileLocal,
  setMainPhoto as setMainPhotoLocal,
  togglePremium as togglePremiumLocal,
  unlockBadge as unlockBadgeLocal,
  updateProfile as updateProfileLocal,
  updateSettings as updateSettingsLocal,
  calculateAge,
  calculateAstroSign,
} from '../store/profileStore';

type ProfileRow = Tables<'profiles'> & {
  is_verified?: boolean | null;
  username?: string | null;
  relationship_status?: string | null;
  passions?: string[] | null;
};

const FALLBACK_DELAY_MS = 200;

const fetchProfileRow = async (userId: string): Promise<ProfileRow | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id,user_id,first_name,last_name,bio,age,date_of_birth,location,profession,profile_images,interests,astrological_sign,is_verified,relationship_status',
    )
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as ProfileRow | null) ?? null;
};

const mapRowToUserProfile = (row: ProfileRow | null, fallback: UserProfile): UserProfile => {
  if (!row) {
    return fallback;
  }

  const dateOfBirth = row.date_of_birth ?? fallback.dateOfBirth;
  const age = row.age ?? calculateAge(dateOfBirth);
  const astroSign = row.astrological_sign ?? calculateAstroSign(dateOfBirth);
  const passions = row.interests ?? fallback.passions;

  const images = row.profile_images ?? fallback.media.map((item) => item.url);
  const media: ProfileMedia[] = images.map((url, index) => ({
    id: `media-${index}`,
    type: 'photo',
    url,
    uploadedAt: fallback.media[index]?.uploadedAt ?? new Date().toISOString(),
  }));

  const composedUsername =
    row.first_name && row.last_name
      ? `${row.first_name}_${row.last_name}`.replace(/\s+/g, '')
      : row.first_name ?? row.username ?? fallback.username;

  return {
    ...fallback,
    id: row.user_id ?? fallback.id,
    username: composedUsername ?? fallback.username,
    dateOfBirth,
    age,
    astroSign,
    currentCity: row.location ?? fallback.currentCity,
    bio: row.bio ?? fallback.bio,
    passions,
    media,
    mainPhotoIndex: Math.min(fallback.mainPhotoIndex, Math.max(media.length - 1, 0)),
    verified: row.is_verified ?? fallback.verified,
    relationshipStatus:
      (row.relationship_status as UserProfile['relationshipStatus'] | undefined) ??
      fallback.relationshipStatus,
    createdAt: row.created_at ?? fallback.createdAt,
    updatedAt: row.updated_at ?? fallback.updatedAt,
  };
};

const ensureUserId = (userId?: string | null) => {
  if (!userId) {
    throw new Error('User ID is required to perform this action.');
  }
};

export const fetchProfile = async (userId?: string | null): Promise<UserProfile | null> => {
  if (!userId) {
    return getUserProfileLocal();
  }

  try {
    const fallback = getDefaultProfile();
    const row = await fetchProfileRow(userId);
    const profile = mapRowToUserProfile(row, fallback);
    saveUserProfileLocal(profile);
    return profile;
  } catch (error) {
    console.warn('[profileApi] Supabase fetch failed, returning local profile.', error);
    await new Promise((resolve) => setTimeout(resolve, FALLBACK_DELAY_MS));
    return getUserProfileLocal();
  }
};

const splitUsername = (username?: string) => {
  if (!username) return { first_name: undefined, last_name: undefined };
  const parts = username.replace(/[_]+/g, ' ').split(' ').filter(Boolean);
  if (parts.length === 0) {
    return { first_name: username, last_name: undefined };
  }
  if (parts.length === 1) {
    return { first_name: parts[0], last_name: undefined };
  }
  const [first_name, ...rest] = parts;
  return { first_name, last_name: rest.join(' ') };
};

export const updateProfile = async (
  userId: string | null | undefined,
  updates: ProfileEditData,
): Promise<UserProfile> => {
  if (!userId) {
    return updateProfileLocal(updates);
  }

  try {
    const existingRow = await fetchProfileRow(userId);
    const fallback = existingRow ? mapRowToUserProfile(existingRow, getDefaultProfile()) : getDefaultProfile();
    const { first_name, last_name } = splitUsername(updates.username ?? fallback.username);

    const payload: Partial<ProfileRow> = {
      first_name: first_name ?? existingRow?.first_name ?? null,
      last_name: last_name ?? existingRow?.last_name ?? null,
      bio: updates.bio ?? existingRow?.bio ?? null,
      location: updates.currentCity ?? existingRow?.location ?? null,
      interests: updates.passions ?? existingRow?.interests ?? null,
      relationship_status: updates.relationshipStatus ?? existingRow?.relationship_status ?? null,
      updated_at: new Date().toISOString(),
      user_id: userId,
    };

    if (existingRow?.id) {
      payload.id = existingRow.id;
    }

    const { error } = await supabase.from('profiles').upsert(payload);
    if (error) {
      throw error;
    }

    return fetchProfile(userId) ?? fallback;
  } catch (error) {
    console.warn('[profileApi] Supabase update failed, falling back to local storage.', error);
    return updateProfileLocal(updates);
  }
};

export const addMedia = async (
  userId: string | null | undefined,
  media: Omit<ProfileMedia, 'id' | 'uploadedAt'>,
): Promise<UserProfile> => {
  if (!userId) {
    return addMediaLocal(media);
  }

  try {
    const row = await fetchProfileRow(userId);
    const existingImages = row?.profile_images ?? [];
    if (existingImages.length >= 10) {
      throw new Error('Maximum 10 media items allowed');
    }

    const updatedImages = [...existingImages, media.url];
    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, id: row?.id, profile_images: updatedImages, updated_at: new Date().toISOString() });

    if (error) {
      throw error;
    }

    return fetchProfile(userId) ?? getUserProfileLocal();
  } catch (error) {
    console.warn('[profileApi] Unable to add media via Supabase, falling back to local.', error);
    return addMediaLocal(media);
  }
};

export const removeMedia = async (
  userId: string | null | undefined,
  mediaId: string,
): Promise<UserProfile> => {
  if (!userId) {
    return removeMediaLocal(mediaId);
  }

  try {
    const row = await fetchProfileRow(userId);
    const images = row?.profile_images ?? [];
    const filtered = images.filter((url) => !url.includes(mediaId));

    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, id: row?.id, profile_images: filtered, updated_at: new Date().toISOString() });

    if (error) {
      throw error;
    }

    return fetchProfile(userId) ?? getUserProfileLocal();
  } catch (error) {
    console.warn('[profileApi] Unable to remove media via Supabase, using local fallback.', error);
    return removeMediaLocal(mediaId);
  }
};

export const setMainPhoto = async (
  userId: string | null | undefined,
  index: number,
): Promise<UserProfile> => {
  if (!userId) {
    return setMainPhotoLocal(index);
  }

  try {
    const row = await fetchProfileRow(userId);
    const images = row?.profile_images ?? [];
    if (index < 0 || index >= images.length) {
      return fetchProfile(userId) ?? getUserProfileLocal();
    }

    const reordered = [images[index], ...images.filter((_, idx) => idx !== index)];
    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, id: row?.id, profile_images: reordered, updated_at: new Date().toISOString() });

    if (error) throw error;

    return fetchProfile(userId) ?? getUserProfileLocal();
  } catch (error) {
    console.warn('[profileApi] Unable to set main photo via Supabase, using local fallback.', error);
    return setMainPhotoLocal(index);
  }
};

export const unlockBadge = async (badgeId: string): Promise<UserProfile> => {
  // Pas encore d'API backend pour les badges : fallback local.
  return unlockBadgeLocal(badgeId);
};

export const updateSettings = async (
  settings: Partial<UserProfile['settings']>,
): Promise<UserProfile> => {
  // En attendant un service dédié, on conserve le fallback local.
  return updateSettingsLocal(settings);
};

export const togglePremium = async (): Promise<UserProfile> => {
  return togglePremiumLocal();
};

export const deleteAccount = async (userId?: string | null): Promise<void> => {
  try {
    if (userId) {
      const row = await fetchProfileRow(userId);
      if (row?.id) {
        const { error } = await supabase.from('profiles').delete().eq('id', row.id);
        if (error) throw error;
      }
    }
  } catch (error) {
    console.warn('[profileApi] Unable to delete Supabase profile, proceeding to clear local data.', error);
  } finally {
    localStorage.removeItem('moydate_user_profile');
  }
};
