import { useEffect, useMemo, useState } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import fallbackImage from "@/assets/profile1.jpg";

export interface DiscoverProfile {
  id: string;
  first_name: string;
  age?: number;
  profession?: string;
  location?: string;
  distance?: number;
  profile_images?: string[];
  compatibility_score?: number;
}

interface DiscoverProfileCardProps {
  profile: DiscoverProfile;
  onLike: () => void;
  onPass: () => void;
  onSuperlike: () => void;
}

const SWIPE_THRESHOLD = 120;
const SUPERLIKE_THRESHOLD = 130;

export const DiscoverProfileCard = ({ profile, onLike, onPass, onSuperlike }: DiscoverProfileCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-12, 0, 12]);
  const scale = useTransform(x, [-240, 0, 240], [0.96, 1, 0.96]);
  const [exit, setExit] = useState({ x: 0, y: 0 });

  const imageUrl = useMemo(() => {
    const first = profile.profile_images?.[0];
    if (first && first.length > 0) {
      return first;
    }
    return fallbackImage;
  }, [profile.profile_images]);

  const distanceLabel = profile.distance ? `${profile.distance.toFixed(0)} km` : "1 km";
  const locationLabel = profile.location ?? "Nearby";

  useEffect(() => {
    setExit({ x: 0, y: 0 });
    x.set(0);
  }, [profile.id, x]);

  const triggerAction = (action: "pass" | "like" | "superlike") => {
    switch (action) {
      case "like":
        setExit({ x: 420, y: 0 });
        onLike();
        break;
      case "pass":
        setExit({ x: -420, y: 0 });
        onPass();
        break;
      case "superlike":
        setExit({ x: 0, y: -420 });
        onSuperlike();
        break;
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      triggerAction("like");
      return;
    }
    if (info.offset.x < -SWIPE_THRESHOLD) {
      triggerAction("pass");
      return;
    }
    if (info.offset.y < -SUPERLIKE_THRESHOLD) {
      triggerAction("superlike");
      return;
    }
    // Reset position when swipe is not enough
    x.set(0);
  };

  return (
    <motion.article
      className="relative w-full max-w-[400px] overflow-hidden rounded-3xl bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(0,0,0,0.08)] outline-none"
      whileHover={{ scale: 1.01 }}
      role="group"
      aria-label={`${profile.first_name}${profile.age ? `, ${profile.age}` : ""}`}
      style={{ x, rotate, scale }}
      animate={{ x: exit.x, y: exit.y, opacity: exit.x !== 0 || exit.y !== 0 ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.22}
      onDragEnd={handleDragEnd}
    >
      <motion.img
        key={imageUrl}
        src={imageUrl}
        alt={`${profile.first_name} portrait`}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" aria-hidden="true" />

      <motion.div
        className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-lg border border-white/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{distanceLabel}</span>
      </motion.div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2" aria-hidden="true">
        <div className="flex flex-col items-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((dot) => (
            <span
              key={dot}
              className={`h-2 w-2 rounded-full ${dot === 0 ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 px-8 pb-8 pt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">{locationLabel}</p>
          <h2 className="text-3xl font-bold leading-tight">
            {profile.first_name}
            {profile.age ? <span>, {profile.age}</span> : null}
          </h2>
          {profile.profession ? (
            <p className="text-base text-white/80 leading-relaxed">{profile.profession}</p>
          ) : null}
        </div>
      </motion.div>
    </motion.article>
  );
};
