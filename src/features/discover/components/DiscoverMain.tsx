import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { UserPreferences } from "@/hooks/useMatching";
import { DiscoverHeader } from "./DiscoverHeader";
import { DiscoverProfileCard } from "./DiscoverProfileCard";
import { DiscoverActions } from "./DiscoverActions";
import { DiscoverMediaViewer } from "./DiscoverMediaViewer";
import { FiltersSheet } from "./FiltersSheet";

interface DiscoverProfile {
  id: string;
  first_name: string;
  age?: number;
  profession?: string;
  location?: string;
  profile_images?: string[];
  distance?: number;
}

interface DiscoverMainProps {
  profile: DiscoverProfile | null;
  loading?: boolean;
  onBack?: () => void;
  onShowFilters?: () => void;
  onPass?: () => void;
  onLike?: () => void;
  onSuperlike?: () => void;
  preferences?: UserPreferences | null;
  onUpdatePreferences?: (preferences: Partial<UserPreferences>) => void;
}

const FALLBACK_LOCATION = "Chicago, IL";
const DEFAULT_DISTANCE = 25;
const DEFAULT_AGE_RANGE: [number, number] = [21, 35];
const INTERESTED_DEFAULT = "all";
const VERIFIED_STORAGE_KEY = "moydate_filters_verified";

export const DiscoverMain = ({
  profile,
  loading,
  onBack,
  onShowFilters,
  onPass,
  onLike,
  onSuperlike,
  preferences,
  onUpdatePreferences,
}: DiscoverMainProps) => {
  const { toast } = useToast();

  const locationLabel = useMemo(() => {
    if (!profile?.location) return FALLBACK_LOCATION;
    return profile.location;
  }, [profile?.location]);

  const nameLabel = profile ? `${profile.first_name}${profile.age ? `, ${profile.age}` : ""}` : "";
  const subtitle = profile?.profession ?? "";
  const distanceLabel = profile?.distance ? `${profile.distance.toFixed(0)} km` : "1 km";

  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);

  const [showFilters, setShowFilters] = useState(false);
  const [localInterestedIn, setLocalInterestedIn] = useState(() => preferences?.interested_in?.[0] ?? INTERESTED_DEFAULT);
  const [localDistance, setLocalDistance] = useState(() => preferences?.max_distance ?? DEFAULT_DISTANCE);
  const [localAgeRange, setLocalAgeRange] = useState<[number, number]>(() => [
    preferences?.min_age ?? DEFAULT_AGE_RANGE[0],
    preferences?.max_age ?? DEFAULT_AGE_RANGE[1],
  ]);
  const [showOnlyVerified, setShowOnlyVerified] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(VERIFIED_STORAGE_KEY) === "true";
  });

  useEffect(() => {
    if (showFilters && preferences) {
      setLocalInterestedIn(preferences.interested_in?.[0] ?? INTERESTED_DEFAULT);
      setLocalDistance(preferences.max_distance ?? DEFAULT_DISTANCE);
      setLocalAgeRange([
        preferences.min_age ?? DEFAULT_AGE_RANGE[0],
        preferences.max_age ?? DEFAULT_AGE_RANGE[1],
      ]);
    }
  }, [showFilters, preferences]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(VERIFIED_STORAGE_KEY, JSON.stringify(showOnlyVerified));
  }, [showOnlyVerified]);

  const handleEmptyState = () => {
    toast({
      title: "No more profiles",
      description: "Check back later or adjust your filters.",
    });
  };

  const handleOpenFilters = () => {
    setShowFilters(true);
    onShowFilters?.();
  };

  const handleApplyFilters = () => {
    onUpdatePreferences?.({
      min_age: localAgeRange[0],
      max_age: localAgeRange[1],
      max_distance: localDistance,
      interested_in: localInterestedIn === INTERESTED_DEFAULT ? [INTERESTED_DEFAULT] : [localInterestedIn],
    });
    setShowFilters(false);
    toast({
      title: "Filtres appliqu\u00e9s",
      description: "Ton deck va se rafra\u00eechir avec les bons profils.",
    });
  };

  const handleClearFilters = () => {
    setLocalInterestedIn(INTERESTED_DEFAULT);
    setLocalDistance(DEFAULT_DISTANCE);
    setLocalAgeRange(DEFAULT_AGE_RANGE);
    setShowOnlyVerified(false);
    onUpdatePreferences?.({
      min_age: DEFAULT_AGE_RANGE[0],
      max_age: DEFAULT_AGE_RANGE[1],
      max_distance: DEFAULT_DISTANCE,
      interested_in: [INTERESTED_DEFAULT],
    });
    setShowFilters(false);
    toast({
      title: "Filtres r\u00e9initialis\u00e9s",
      description: "Retour aux param\u00e8tres classiques.",
    });
  };

  const handleOpenMedia = (index = 0) => {
    setMediaIndex(index);
    setShowMediaViewer(true);
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center bg-white">
      <div className="flex w-full max-w-[420px] flex-col px-6 pb-24 pt-12">
        <DiscoverHeader onBack={onBack} onFilter={handleOpenFilters} locationLabel={locationLabel} />

        <div className="mt-12 flex flex-col items-center">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-[420px] w-full max-w-[360px] items-center justify-center rounded-[32px] bg-gradient-to-br from-[#F8F9FF] to-[#ECEEFE]"
            >
              <motion.div
                className="h-10 w-10 rounded-full border-2 border-[#E94057] border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
            </motion.div>
          ) : profile ? (
            <DiscoverProfileCard
              image={profile.profile_images?.[0]}
              name={nameLabel}
              subtitle={subtitle}
              distanceLabel={distanceLabel}
              onOpenMedia={() => handleOpenMedia(0)}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-[420px] w-full max-w-[360px] flex-col items-center justify-center rounded-[32px] border border-dashed border-[#E5E7F2] bg-[#FAFAFD] text-center text-[#8C8D9E]"
            >
              <p className="text-lg font-semibold">You're all caught up</p>
              <p className="mt-2 text-sm">We'll let you know when new profiles arrive.</p>
            </motion.div>
          )}

          <DiscoverActions
            onPass={profile ? onPass : handleEmptyState}
            onLike={profile ? onLike : handleEmptyState}
            onSuperlike={profile ? onSuperlike : handleEmptyState}
            disabled={loading}
          />
        </div>
      </div>

      {showMediaViewer ? (
        <DiscoverMediaViewer
          media={profile?.profile_images ?? []}
          name={nameLabel}
          subtitle={subtitle}
          locationLabel={locationLabel}
          distanceLabel={distanceLabel}
          initialIndex={mediaIndex}
          onClose={() => setShowMediaViewer(false)}
          onLike={onLike}
          onSuperlike={onSuperlike}
        />
      ) : null}

      <AnimatePresence>{showFilters ? (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
          />
          <FiltersSheet
            interestedIn={localInterestedIn}
            onInterestedInChange={setLocalInterestedIn}
            distance={localDistance}
            onDistanceChange={setLocalDistance}
            ageRange={localAgeRange}
            onAgeRangeChange={(range) => setLocalAgeRange(range)}
            showOnlyVerified={showOnlyVerified}
            onShowOnlyVerifiedChange={setShowOnlyVerified}
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
          />
        </>
      ) : null}</AnimatePresence>
    </div>
  );
};
