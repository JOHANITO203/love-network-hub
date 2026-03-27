/**
 * МойDate - Profile Screen
 * Main profile screen component
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProfile } from '../hooks/useProfile';
import { useVerification } from '@/hooks/useVerification';
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
  const navigate = useNavigate();
  const {
    record: verificationRecord,
    startVerification,
    markComplete,
    loading: verificationLoading,
  } = useVerification();

  const verificationStatus = verificationRecord?.status ?? 'not_started';
  const verificationUrl = verificationRecord?.url ?? undefined;
  const statusLabelMap: Record<typeof verificationStatus, string> = {
    not_started: 'Non démarrée',
    pending: 'En attente',
    approved: 'Vérifiée',
    rejected: 'Refusée',
  };
  const statusLabel = statusLabelMap[verificationStatus];

  if (loading || !profile || !completion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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

  const algorithmTips = [
    'Ajoute une photo claire de ton visage → +34% de superlikes garantis',
    'Complète ta bio avec au moins 3 passions → +23% de matchs',
    profile.media.length < 5 && 'Ajoute au moins 5 photos pour maximiser ta visibilité',
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <div className="bento-grid">
          <div className="col-span-6 lg:col-span-4">
            <ProfileHeader profile={profile} onEdit={handleEditProfile} />
          </div>
          <div className="col-span-6 lg:col-span-2">
            <ProfileProgress completion={completion} />
          </div>

          <div className="col-span-6 lg:col-span-3">
            <div className="bento-card p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Vérification d'identité (18+)</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Statut : <span className="font-medium">{statusLabel}</span>
                </p>
              </div>

              {verificationStatus === 'approved' ? (
                <p className="text-sm text-emerald-300">
                  Merci ! Votre identité a été confirmée. Les autres membres voient un badge vérifié.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Étape requise pour activer les badges vérifiés. Données traitées par Sumsub et purgées sous 30 jours.
                </p>
              )}

              {verificationStatus === 'pending' && verificationUrl ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => window.open(verificationUrl, '_blank', 'noopener')}
                    disabled={verificationLoading}
                  >
                    Ouvrir Sumsub
                  </Button>
                  <Button variant="outline" onClick={markComplete} disabled={verificationLoading}>
                    J'ai terminé
                  </Button>
                </div>
              ) : verificationStatus === 'approved' ? null : (
                <Button onClick={startVerification} disabled={verificationLoading}>
                  Démarrer la vérification
                </Button>
              )}
            </div>
          </div>

          <div className="col-span-6 lg:col-span-3">
            <StatsCard stats={profile.stats} />
          </div>

          <div className="col-span-6">
            <MediaGallery
              media={profile.media}
              mainPhotoIndex={profile.mainPhotoIndex}
              onAdd={handleAddMedia}
              onRemove={handleRemoveMedia}
              onSetMain={handleSetMainPhoto}
            />
          </div>

          <div className="col-span-6 lg:col-span-3">
            <AboutSection bio={profile.bio} passions={profile.passions} tips={algorithmTips} />
          </div>

          <div className="col-span-6 lg:col-span-3">
            <BadgesSection badges={profile.badges} />
          </div>

          <div className="col-span-6 lg:col-span-4">
            <PremiumCard
              isPremium={profile.isPremium}
              premiumExpiry={profile.premiumExpiry}
              onUpgrade={handleUpgradePremium}
            />
          </div>

          <div className="col-span-6 lg:col-span-2">
            <div className="bento-card p-6 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-base font-semibold text-foreground">Consentements</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Gérez vos données et préférences de confidentialité.
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/consents')} className="mt-4">
                Gérer mes consentements
              </Button>
            </div>
          </div>

          <div className="col-span-6">
            <SettingsSection settings={profile.settings} onUpdateSettings={handleUpdateSettings} onDeleteAccount={handleDeleteAccount} />
          </div>
        </div>
      </div>

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
