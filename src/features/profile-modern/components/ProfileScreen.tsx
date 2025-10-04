/**
 * МойDate - Profile Screen
 * Main profile screen component
 */

import { motion } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';
import { ProfileProgress } from './ProfileProgress';
import { ProfileHeader } from './ProfileHeader';
import { BadgesSection } from './BadgesSection';
import { StatsCard } from './StatsCard';
import { MediaGallery } from './MediaGallery';
import { AboutSection } from './AboutSection';
import { SettingsSection } from './SettingsSection';
import { PremiumCard } from './PremiumCard';
import { ProfileEditModal } from './ProfileEditModal';
import { useToast } from '@/hooks/use-toast';
import type { ProfileEditData, UserProfile } from '../types';

export const ProfileScreen = () => {
  const {
    profile,
    completion,
    loading,
    isEditingProfile,
    setIsEditingProfile,
    updateProfile,
    addMedia,
    removeMedia,
    setMainPhoto,
    updateSettings,
    togglePremium,
    deleteAccount,
  } = useProfile();

  const { toast } = useToast();

  if (loading || !profile || !completion) {
    return (
      <div className="min-h-screen bg-gradient-subtle dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-love-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (updates: ProfileEditData) => {
    try {
      updateProfile(updates);
      toast({
        title: 'Profil mis à jour',
        description: 'Tes modifications ont été sauvegardées.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le profil.',
        variant: 'destructive',
      });
    }
  };

  const handleAddMedia = () => {
    // Mock: In real app, open file picker
    toast({
      title: 'Ajouter des médias',
      description: 'Fonctionnalité disponible prochainement.',
    });
  };

  const handleRemoveMedia = (mediaId: string) => {
    try {
      removeMedia(mediaId);
      toast({
        title: 'Média supprimé',
        description: 'Le média a été retiré de ton profil.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le média.',
        variant: 'destructive',
      });
    }
  };

  const handleSetMainPhoto = (index: number) => {
    try {
      setMainPhoto(index);
      toast({
        title: 'Photo principale mise à jour',
        description: 'Cette photo est maintenant ta photo de profil.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de définir la photo principale.',
        variant: 'destructive',
      });
    }
  };

  const handleUpgradePremium = () => {
    try {
      togglePremium();
      if (!profile.isPremium) {
        toast({
          title: 'Bienvenue Premium ! 👑',
          description: 'Profite de tous les avantages premium.',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut premium.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.'
    );

    if (confirmed) {
      try {
        deleteAccount();
        toast({
          title: 'Compte supprimé',
          description: 'Ton compte a été supprimé avec succès.',
        });
        // In real app: redirect to login
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer le compte.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleUpdateSettings = (settings: Partial<UserProfile['settings']>) => {
    try {
      updateSettings(settings);
      toast({
        title: 'Paramètres mis à jour',
        description: 'Tes préférences ont été sauvegardées.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres.',
        variant: 'destructive',
      });
    }
  };

  // Dynamic tips from algorithm
  const algorithmTips = [
    'Ajoute une photo claire de ton visage → +34% de superlikes garantis',
    'Complète ta bio avec au moins 3 passions → +23% de matchs',
    profile.media.length < 5 && 'Ajoute au moins 5 photos pour maximiser ta visibilité',
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gradient-subtle dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black pb-24">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Progress Bar */}
        <ProfileProgress completion={completion} />

        {/* Profile Header */}
        <ProfileHeader profile={profile} onEdit={handleEditProfile} />

        {/* Badges Section */}
        <BadgesSection badges={profile.badges} />

        {/* Stats */}
        <StatsCard stats={profile.stats} />

        {/* Media Gallery */}
        <MediaGallery
          media={profile.media}
          mainPhotoIndex={profile.mainPhotoIndex}
          onAdd={handleAddMedia}
          onRemove={handleRemoveMedia}
          onSetMain={handleSetMainPhoto}
        />

        {/* About Section */}
        <AboutSection
          bio={profile.bio}
          passions={profile.passions}
          tips={algorithmTips}
        />

        {/* Premium Card */}
        <PremiumCard
          isPremium={profile.isPremium}
          premiumExpiry={profile.premiumExpiry}
          onUpgrade={handleUpgradePremium}
        />

        {/* Settings */}
        <SettingsSection
          settings={profile.settings}
          onUpdateSettings={handleUpdateSettings}
          onDeleteAccount={handleDeleteAccount}
        />
      </div>

      {/* Edit Modal */}
      <ProfileEditModal
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        initialData={{
          username: profile.username,
          bio: profile.bio,
          passions: profile.passions,
          relationshipStatus: profile.relationshipStatus,
          currentCity: profile.currentCity,
        }}
        onSave={handleSaveProfile}
      />
    </div>
  );
};
