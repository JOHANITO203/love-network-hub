import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Crown,
  Flame,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { interests, orientationOptions, personaSymbols, pronounOptions } from '@/data/profileOptions';
import { useAuth } from '@/hooks/useAuth';
import { useProfilePhotos } from '@/hooks/useProfilePhotos';
import { calculateAge, calculateZodiacSign, getZodiacLabel } from '@/utils/zodiacCalculator';
import { cn } from '@/lib/utils';

const PROFILE_STORAGE_KEY = 'moydate_profile';
const MAX_DISPLAY_ASSETS = 10;

interface StoredProfile {
  firstName?: string;
  lastName?: string;
  bio?: string;
  dateOfBirth?: string;
  pronouns?: string;
  orientation?: string;
  interests?: string[];
  personaSymbols?: string[];
  notificationsEnabled?: boolean;
  contactAccessGranted?: boolean;
  photos?: string[];
  aboutYou?: string;
  locationLabel?: string;
}

interface ProfileHubProps {
  onEditProfile?: () => void;
  onOpenSettings?: () => void;
  onUpgrade?: () => void;
}

const FALLBACK_MEDIA = [
  'https://images.unsplash.com/photo-1478029038552-886ff55b9b37?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
];

const BADGES = [
  {
    id: 'spark-first-match',
    icon: <Sparkles className="h-4 w-4" />,
    title: 'Premier match',
    description: 'Tu as brisé la glace. Encore 9 et on ouvre le champagne.',
    unlocked: true,
  },
  {
    id: 'flame-hot-streak',
    icon: <Flame className="h-4 w-4" />,
    title: 'Hot streak',
    description: '5 superlikes en 24 h. Les DM brûlent.',
    unlocked: true,
  },
  {
    id: 'heart-verified',
    icon: <Heart className="h-4 w-4" />,
    title: 'Profil vérifié',
    description: 'En attente. On veut juste confirmer que tu es trop beau pour être vrai.',
    unlocked: false,
  },
];

const STATS = [
  {
    id: 'views',
    label: 'Vues du profil',
    value: '142',
    changeLabel: '+18% cette semaine',
  },
  {
    id: 'matches',
    label: 'Matches créés',
    value: '12',
    changeLabel: '+3 nouvelles conversations',
  },
  {
    id: 'messages',
    label: 'Messages envoyés',
    value: '87',
    changeLabel: '5 réponses en attente',
  },
];

const toTitleCase = (value?: string) => {
  if (!value) return '';
  return value
    .split(' ')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
};

export const ProfileHub = ({ onEditProfile, onOpenSettings, onUpgrade }: ProfileHubProps) => {
  const { user } = useAuth();
  const { photos, loadPhotos } = useProfilePhotos();
  const [storedProfile, setStoredProfile] = useState<StoredProfile | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        setStoredProfile(JSON.parse(stored) as StoredProfile);
      }
    } catch (error) {
      console.warn('Impossible de charger le profil stocké', error);
    }
  }, []);

  useEffect(() => {
    loadPhotos().catch((error) => {
      console.warn('Impossible de charger les photos', error);
    });
  }, [loadPhotos]);

  const birthDate = storedProfile?.dateOfBirth ? new Date(storedProfile.dateOfBirth) : undefined;
  const age = useMemo(() => (birthDate ? calculateAge(birthDate) : null), [birthDate]);
  const zodiac = useMemo(() => {
    if (!birthDate) return null;
    const sign = calculateZodiacSign(birthDate);
    return {
      id: sign,
      label: getZodiacLabel(sign),
    };
  }, [birthDate]);

  const fullName = useMemo(() => {
    const first = storedProfile?.firstName?.trim();
    const last = storedProfile?.lastName?.trim();
    if (first && last) return `${toTitleCase(first)} ${toTitleCase(last)}`;
    if (first) return toTitleCase(first);
    if (user?.email) return user.email.split('@')[0];
    return 'Ton profil';
  }, [storedProfile?.firstName, storedProfile?.lastName, user?.email]);

  const pronounLabel = useMemo(() => {
    if (!storedProfile?.pronouns) return null;
    const match = pronounOptions.find((option) => option.value === storedProfile.pronouns);
    return match?.label ?? storedProfile.pronouns;
  }, [storedProfile?.pronouns]);

  const orientationLabel = useMemo(() => {
    if (!storedProfile?.orientation) return null;
    const match = orientationOptions.find((option) => option.value === storedProfile.orientation);
    return match?.label ?? storedProfile.orientation;
  }, [storedProfile?.orientation]);

  const interestLabels = useMemo(() => {
    if (!storedProfile?.interests?.length) return [] as string[];
    return storedProfile.interests
      .map((value) => interests.find((item) => item.value === value)?.label ?? toTitleCase(value))
      .slice(0, 12);
  }, [storedProfile?.interests]);

  const personaBadges = useMemo(() => {
    if (!storedProfile?.personaSymbols?.length) return [] as { emoji: string; label: string }[];
    return storedProfile.personaSymbols
      .map((value) => {
        const symbol = personaSymbols.find((item) => item.value === value);
        if (!symbol) return null;
        return { emoji: symbol.emoji, label: symbol.label };
      })
      .filter((item): item is { emoji: string; label: string } => item !== null);
  }, [storedProfile?.personaSymbols]);

  const mediaAssets = useMemo(() => {
    const orderedPhotos = photos
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((photo) => photo.file_path);

    const storedPhotos = storedProfile?.photos ?? [];
    const merged = [...orderedPhotos, ...storedPhotos, ...FALLBACK_MEDIA];
    return merged.slice(0, MAX_DISPLAY_ASSETS);
  }, [photos, storedProfile?.photos]);

  const primaryPhoto = useMemo(() => {
    const primary = photos.find((item) => item.is_primary);
    if (primary) return primary.file_path;
    if (mediaAssets.length) return mediaAssets[0];
    return 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80';
  }, [mediaAssets, photos]);

  const locationLabel = storedProfile?.locationLabel ?? 'Paris, France';
  const aboutYou = storedProfile?.aboutYou ?? storedProfile?.bio ?? "Ajoute une bio pour que ton narrateur puisse te roast.";

  const handleAction = (callback?: () => void) => () => {
    if (callback) callback();
  };

  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-24 pt-6 md:max-w-4xl">
      <motion.div
        className="relative overflow-hidden rounded-[32px] border border-border/60 bg-gradient-to-b from-white via-white/90 to-white/70 p-[1px] shadow-soft"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative rounded-[31px] bg-white/90 p-6 backdrop-blur">
          <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-red/15 blur-3xl" />
          <div className="relative flex flex-col items-center gap-4 text-center">
            <Avatar className="h-28 w-28 border-4 border-white shadow-love">
              <AvatarImage src={primaryPhoto} alt={fullName} />
              <AvatarFallback className="bg-gradient-moydate text-3xl text-white">
                {fullName.charAt(0)?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-[#1F1F33]">{fullName}</h1>
              <p className="text-sm text-muted-foreground">
                {age ? `${age} ans` : 'Age non indiqué'}
                {orientationLabel ? ` • ${orientationLabel}` : ''}
                {pronounLabel ? ` • ${pronounLabel}` : ''}
              </p>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-[#E94057]">
                <MapPin className="h-4 w-4" />
                {locationLabel}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button size="sm" className="bg-gradient-moydate px-6 shadow-love" onClick={handleAction(onEditProfile)}>
                Modifier mon profil
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="borderer-brand-purple/40 text-brand-purple hover:border-brand-purple hover:text-brand-purple"
                onClick={handleAction(onOpenSettings)}
              >
                Paramètres & confidentialité
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-400 text-yellow-500 hover:border-yellow-500 hover:text-yellow-600"
                onClick={handleAction(onUpgrade)}
              >
                <Crown className="mr-2 h-4 w-4" /> Passer Premium
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-red">Statistiques</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STATS.map((stat) => (
            <Card key={stat.id} className="borderer border-border/60 shadow-soft">
              <CardContent className="space-y-2 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold text-[#1F1F33]">{stat.value}</p>
                <p className="text-xs text-brand-red">{stat.changeLabel}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-red">Galerie</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Camera className="h-4 w-4" /> {mediaAssets.length}/{MAX_DISPLAY_ASSETS}
          </div>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {mediaAssets.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative h-48 w-40 flex-shrink-0 overflow-hidden rounded-3xl border border-border/50 shadow-soft"
            >
              <img src={url} alt={`Profil média ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-red">Badges</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {BADGES.map((badge) => (
            <Card
              key={badge.id}
              className={cn(
                'border border-border/60 shadow-soft transition hover:-translate-y-1 hover:shadow-glow',
                !badge.unlocked && 'opacity-60'
              )}
            >
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-brand-red">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                    {badge.icon}
                  </span>
                  <p className="text-sm font-semibold text-[#1F1F33]">{badge.title}</p>
                </div>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                <Badge variant={badge.unlocked ? 'default' : 'outline'}>{badge.unlocked ? 'Débloqué' : 'À venir'}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card className="borderer border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">À propos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-[#1F1F33]">{aboutYou}</p>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Date de naissance" value={birthDate ? birthDate.toLocaleDateString() : 'Non indiquée'} />
              <InfoRow label="Âge" value={age ? `${age} ans` : '—'} />
              <InfoRow label="Signe astro" value={zodiac?.label ?? '—'} />
              <InfoRow label="Orientation" value={orientationLabel ?? '—'} />
              <InfoRow label="Pronoms" value={pronounLabel ?? '—'} />
              <InfoRow label="Notifications" value={storedProfile?.notificationsEnabled ? 'Activées' : 'Désactivées'} />
            </div>

            {personaBadges.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">Persona</p>
                <div className="flex flex-wrap gap-2">
                  {personaBadges.map((symbol) => (
                    <Badge key={symbol.label} variant="secondary" className="gap-1">
                      <span>{symbol.emoji}</span>
                      <span>{symbol.label}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {interestLabels.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">Centres d'intérêt</p>
                <div className="flex flex-wrap gap-2">
                  {interestLabels.map((label) => (
                    <Badge key={label} variant="outline" className="borderer-brand-red/20 text-brand-red">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="borderer border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-4 w-4 text-brand-red" />
              Conseils
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Ajoute une courte vidéo pour booster ton taux de matchs de 23%.</p>
            <p>• Les profils avec 5 passions renseignées reçoivent 2× plus de messages.</p>
            <p>• Un selfie récent et une bio concrète = 34% de superlikes en plus.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
    <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-[#1F1F33]">{value}</span>
  </div>
);
