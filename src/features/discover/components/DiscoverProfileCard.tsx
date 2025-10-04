import { motion } from "framer-motion";
import { useMemo } from "react";
import fallbackImage from "@/assets/profile1.jpg";

interface DiscoverProfileCardProps {
  image?: string;
  name: string;
  subtitle?: string;
  distanceLabel?: string;
  onOpenMedia?: () => void;
}

export const DiscoverProfileCard = ({ image, name, subtitle, distanceLabel = "1 km", onOpenMedia }: DiscoverProfileCardProps) => {
  const photo = useMemo(() => image || fallbackImage, [image]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative w-full max-w-[360px] overflow-hidden rounded-3xl bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.16),0_24px_64px_rgba(0,0,0,0.12)] transition-all duration-300"
    >
      <img
        src={photo}
        alt={name}
        className="h-full w-full object-cover"
        style={{ aspectRatio: "3 / 4" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-3xl font-bold">{name}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-white/90">{subtitle}</p>
        )}
        <p className="mt-2 text-xs text-white/70">{distanceLabel}</p>
      </div>
    </motion.div>
  );
};
