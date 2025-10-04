import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  MapPin,
  Briefcase,
  Star,
  Shield,
  Share2,
  X,
  Flame,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { DiscoverMediaViewer } from "@/features/discover/components/DiscoverMediaViewer";
import { mockProfiles } from "@/data/mockData";
import { cn } from "@/lib/utils";

type RouteStateProfile = Partial<{
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  bio: string;
  location: string;
  profession: string;
  interests: string[];
  profile_images: string[];
  images: string[];
  compatibility_score: number;
  distance: number;
}>;

const FALLBACK_LOCATION = "Paris, France";
const FALLBACK_PROFESSION = "Product designer";
const FALLBACK_BIO =
  "Sarcasme assumé, café serré, matches triés. Si tu as une playlist, on commence par là.";

const HIGHLIGHT_COLORS = [
  "from-[#FFE5EC] to-[#FDE2FF]",
  "from-[#E0F3FF] to-[#F1F4FF]",
  "from-[#FFF4E5] to-[#FFE5D0]",
];

const QUICK_BADGES = [
  {
    code: "spark",
    label: "Adepte du swipe intelligent",
    description: "Les profils à 70 % + reçoivent son attention. Les autres prennent un ghost poli.",
    icon: <Sparkles className="h-4 w-4 text-[#E94057]" />,
  },
  {
    code: "verified",
    label: "Profil vérifié",
    description: "Selfie validé par l'équipe МойDate. Oui, c'est bien cette personne sur les photos.",
    icon: <Shield className="h-4 w-4 text-[#4C4D70]" />,
  },
  {
    code: "story",
    label: "Active en stories",
    description: "3 stories par jour. Narrateur sarcastique en surchauffe.",
    icon: <Flame className="h-4 w-4 text-[#F27121]" />,
  },
];

const PASSIONS_LABELS: Record<string, string> = {
  travel: "Voyage",
  photography: "Photo",
  yoga: "Yoga",
  technology: "Tech",
  coffee: "Café",
  climbing: "Escalade",
  movies: "Cinéma",
  theatre: "Théâtre",
  art: "Art",
  music: "Musique",
  cooking: "Cuisine",
  fitness: "Fitness",
};

const getFallbackMedia = () => [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
];

const createCompatibilityText = (score: number) => {
  if (score >= 90) return "Niveau âme sœur (coquilles et playlists partagées).";
  if (score >= 80) return "Le narrateur dit : match prometteur. On valide.";
  if (score >= 70) return "Compatible, mais garde ton second degré affûté.";
  return "Potentiel détecté, laisse l'algo travailler.";
};

const ProfileDetailScreen = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const stateProfile = (location.state as RouteStateProfile | undefined) ?? undefined;

  const profile = useMemo(() => {
    if (stateProfile) {
      return stateProfile;
    }
    if (!profileId) {
      return mockProfiles[0];
    }
    return (
      mockProfiles.find((item) => item.id === profileId || item.id === Number(profileId)) ??
      mockProfiles[0]
    );
  }, [profileId, stateProfile]);

  const mediaAssets = useMemo(() => {
    const media =
      (profile.profile_images as string[] | undefined) ??
      (profile.images as string[] | undefined) ??
      [];
    if (media.length > 0) return media;
    return getFallbackMedia();
  }, [profile.profile_images, profile.images]);

  const displayName = useMemo(() => {
    if ('name' in profile && profile.name) return profile.name;
    const first = (profile.first_name as string | undefined) ?? '';
    const last = (profile.last_name as string | undefined) ?? '';
    if (!first && !last) return 'МойDate User';
    return `${first} ${last}`.trim();
  }, [profile]);

  const age = (profile.age as number | undefined) ?? 26;
  const profession = (profile.profession as string | undefined) ?? FALLBACK_PROFESSION;
  const locationLabel = (profile.location as string | undefined) ?? FALLBACK_LOCATION;
  const bio = (profile.bio as string | undefined) ?? FALLBACK_BIO;
  const distance = (profile.distance as number | undefined) ?? 2;
  const compatibilityScore = useMemo(() => {
    const base = (profile.compatibility_score as number | undefined) ?? 76;
    const interestsBonus = (profile.interests?.length ?? 0) * 2;
    return Math.min(95, base + interestsBonus);
  }, [profile.compatibility_score, profile.interests]);

  const compatibilityText = useMemo(
    () => createCompatibilityText(compatibilityScore),
    [compatibilityScore]
  );

  const interestsList = useMemo(
    () => (profile.interests as string[] | undefined) ?? [],
    [profile.interests]
  );

  const [showViewer, setShowViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (index = 0) => {
    setViewerIndex(index);
    setShowViewer(true);
  };

  const handlePass = () => {
    toast({
      title: 'Profil ignoré',
      description: `${displayName} ne verra jamais ce swipe. Courage.`,
    });
    navigate(-1);
  };

  const handleLike = () => {
    toast({
      title: 'Like envoyé',
      description: `Ton algorithme préféré a noté ton coup de cœur pour ${displayName}.`,
    });
  };

  const handleSuperlike = () => {
    toast({
      title: 'Superlike',
      description: `${displayName} vient de recevoir une notification dramatique.`,
    });
  };

  const shareProfile = () => {
    toast({
      title: 'Partager',
      description: `Screenshot envoyé (dans ta tête) aux BFF.`,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f9ff]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-160px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#FFE5EC] via-[#F6D7FF] to-transparent blur-[160px]" />
        <div className="absolute right-[-200px] bottom-[-180px] h-[520px] w-[520px] rounded-full bg-gradient-to-br from-[#E94057]/35 via-[#F27121]/35 to-transparent blur-[180px]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 pb-32 pt-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-12 rounded-2xl border-white/70 bg-white/90 text-[#E94057] shadow-soft"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-2xl border-white/70 bg-white/90 px-4 text-sm font-semibold text-[#6B6C85] shadow-soft hover:text-[#E94057]"
            onClick={shareProfile}
          >
            <Share2 className="mr-2 h-4 w-4" /> Partager
          </Button>
        </header>

        <section>
          <motion.button
            type="button"
            onClick={() => openViewer(0)}
            className="group relative block overflow-hidden rounded-[36px] border border-white/70 bg-black shadow-[0_40px_120px_rgba(17,17,17,0.25)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E94057]/50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <img
              src={mediaAssets[0]}
              alt={displayName}
              className="h-[480px] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute left-6 top-6 flex items-center gap-3">
              <Badge className="rounded-full bg-[#E94057] text-white shadow-soft">
                {compatibilityScore}% compatibilité
              </Badge>
              <Badge variant="secondary" className="rounded-full bg-white/20 text-white backdrop-blur">
                {distance} km
              </Badge>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-left text-white">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold">{displayName}</h1>
                <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur">
                  {age} ans
                </Badge>
              </div>
              <p className="mt-2 text-sm text-white/80">
                <Briefcase className="mr-2 inline h-4 w-4" /> {profession}
              </p>
            </div>
          </motion.button>
        </section>

        <section className="rounded-[28px] border border-white/60 bg-white/95 p-6 shadow-[0_24px_80px_rgba(17,17,17,0.12)]">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <Sparkles className="h-5 w-5 text-[#E94057]" />,
                title: "Compatibilité",
                value: `${compatibilityScore}%`,
                color: HIGHLIGHT_COLORS[0],
              },
              {
                icon: <MapPin className="h-5 w-5 text-[#4C4D70]" />,
                title: "Localisation",
                value: locationLabel,
                color: HIGHLIGHT_COLORS[1],
              },
              {
                icon: <Star className="h-5 w-5 text-[#F27121]" />,
                title: "Vibe",
                value: "Night-owl romantique",
                color: HIGHLIGHT_COLORS[2],
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "rounded-3xl border border-white/70 p-4 text-sm shadow-soft",
                  `bg-gradient-to-br ${item.color}`
                )}
              >
                <div className="flex items-center gap-2 text-[#1F1F33]">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-[#E94057]">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#75769A]">{item.title}</p>
                    <p className="text-base font-semibold text-[#1F1F33]">{item.value}</p>
                  </div>
                </div>
                {index === 0 ? (
                  <p className="mt-2 text-xs text-[#6B6C85]">{compatibilityText}</p>
                ) : null}
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#1F1F33]">Bio</h2>
            <p className="text-sm leading-relaxed text-[#6B6C85]">{bio}</p>
          </div>

          {interestsList.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#1F1F33]">Passions</h3>
                <div className="flex flex-wrap gap-2">
                  {interestsList.slice(0, 12).map((interest) => (
                    <Badge
                      key={interest}
                      variant="outline"
                      className="rounded-full border-[#E94057]/30 bg-[#E94057]/10 px-3 py-1 text-xs font-medium text-[#E94057]"
                    >
                      {PASSIONS_LABELS[interest] ?? interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator className="my-6" />

          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-[#1F1F33]">Badges</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {QUICK_BADGES.map((badge) => (
                <div
                  key={badge.code}
                  className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm shadow-soft"
                >
                  <div className="flex items-center gap-2 text-[#1F1F33]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FDECEF]">
                      {badge.icon}
                    </span>
                    <p className="font-semibold">{badge.label}</p>
                  </div>
                  <p className="mt-2 text-xs text-[#6B6C85]">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>

          {mediaAssets.length > 1 && (
            <>
              <Separator className="my-6" />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#1F1F33]">Galerie</h3>
                <div className="grid grid-cols-3 gap-3">
                  {mediaAssets.slice(1, 7).map((media, index) => (
                    <button
                      key={media}
                      type="button"
                      onClick={() => openViewer(index + 1)}
                      className="group aspect-square overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E94057]/60"
                    >
                      <img
                        src={media}
                        alt={`${displayName} photo ${index + 2}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </motion.div>

      <AnimatePresence>
        {showViewer ? (
          <DiscoverMediaViewer
            media={mediaAssets}
            name={displayName}
            subtitle={profession}
            locationLabel={locationLabel}
            distanceLabel={`${distance} km`}
            initialIndex={viewerIndex}
            onClose={() => setShowViewer(false)}
            onLike={handleLike}
            onSuperlike={handleSuperlike}
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        className="fixed inset-x-0 bottom-0 z-30 bg-white/90 backdrop-blur border-t border-white/70"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-14 w-14 rounded-full border-[#E2E3F0] text-[#E94057] shadow-soft hover:border-[#E94057] hover:text-[#E94057]"
            onClick={handlePass}
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            type="button"
            className="h-16 w-16 rounded-full bg-gradient-moydate text-white shadow-love hover:shadow-glow"
            onClick={handleLike}
          >
            <Heart className="h-7 w-7 fill-current" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-14 flex-1 rounded-full border-[#FFE5EC] bg-[#FFE5EC]/40 text-[#E94057] shadow-soft hover:border-[#E94057]"
            onClick={handleSuperlike}
          >
            <Sparkles className="mr-2 h-5 w-5" /> Superlike express
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileDetailScreen;
