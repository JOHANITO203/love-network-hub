/**
 * МойDate - Profile Hook
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  UserProfile,
  ProfileMedia,
  ProfileEditData,
  ProfileCompletion,
} from '../types';
import {
  getUserProfile,
  updateProfile as updateProfileStore,
  addMedia as addMediaStore,
  removeMedia as removeMediaStore,
  setMainPhoto as setMainPhotoStore,
  unlockBadge as unlockBadgeStore,
  updateSettings as updateSettingsStore,
  togglePremium as togglePremiumStore,
  deleteAccount as deleteAccountStore,
  calculateProfileCompletion,
} from '../store/profileStore';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completion, setCompletion] = useState<ProfileCompletion | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  /**
   * Load profile on mount
   */
  useEffect(() => {
    try {
      const loadedProfile = getUserProfile();
      setProfile(loadedProfile);
      setCompletion(calculateProfileCompletion(loadedProfile));
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update profile data
   */
  const updateProfile = useCallback((updates: ProfileEditData) => {
    try {
      const updated = updateProfileStore(updates);
      setProfile(updated);
      setCompletion(calculateProfileCompletion(updated));
      return updated;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, []);

  /**
   * Add media (photo/video)
   */
  const addMedia = useCallback((media: Omit<ProfileMedia, 'id' | 'uploadedAt'>) => {
    try {
      const updated = addMediaStore(media);
      setProfile(updated);
      setCompletion(calculateProfileCompletion(updated));
      return updated;
    } catch (error) {
      console.error('Error adding media:', error);
      throw error;
    }
  }, []);

  /**
   * Remove media
   */
  const removeMedia = useCallback((mediaId: string) => {
    try {
      const updated = removeMediaStore(mediaId);
      setProfile(updated);
      setCompletion(calculateProfileCompletion(updated));
      return updated;
    } catch (error) {
      console.error('Error removing media:', error);
      throw error;
    }
  }, []);

  /**
   * Set main photo
   */
  const setMainPhoto = useCallback((index: number) => {
    try {
      const updated = setMainPhotoStore(index);
      setProfile(updated);
      return updated;
    } catch (error) {
      console.error('Error setting main photo:', error);
      throw error;
    }
  }, []);

  /**
   * Unlock badge
   */
  const unlockBadge = useCallback((badgeId: string) => {
    try {
      const updated = unlockBadgeStore(badgeId);
      setProfile(updated);
      return updated;
    } catch (error) {
      console.error('Error unlocking badge:', error);
      throw error;
    }
  }, []);

  /**
   * Update settings
   */
  const updateSettings = useCallback(
    (settings: Partial<UserProfile['settings']>) => {
      try {
        const updated = updateSettingsStore(settings);
        setProfile(updated);
        return updated;
      } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
      }
    },
    []
  );

  /**
   * Toggle premium
   */
  const togglePremium = useCallback(() => {
    try {
      const updated = togglePremiumStore();
      setProfile(updated);
      return updated;
    } catch (error) {
      console.error('Error toggling premium:', error);
      throw error;
    }
  }, []);

  /**
   * Delete account
   */
  const deleteAccount = useCallback(() => {
    try {
      deleteAccountStore();
      setProfile(null);
      setCompletion(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }, []);

  /**
   * Refresh profile (force reload)
   */
  const refreshProfile = useCallback(() => {
    try {
      const loadedProfile = getUserProfile();
      setProfile(loadedProfile);
      setCompletion(calculateProfileCompletion(loadedProfile));
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, []);

  return {
    profile,
    completion,
    loading,
    isEditingProfile,
    setIsEditingProfile,
    isEditingSettings,
    setIsEditingSettings,
    updateProfile,
    addMedia,
    removeMedia,
    setMainPhoto,
    unlockBadge,
    updateSettings,
    togglePremium,
    deleteAccount,
    refreshProfile,
  };
};
