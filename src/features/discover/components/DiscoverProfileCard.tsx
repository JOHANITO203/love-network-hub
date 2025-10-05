import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import fallbackImage from "@/assets/profile1.jpg";

interface DiscoverProfileCardProps {
  image?: string;
  name: string;
  subtitle?: string;
  distanceLabel?: string;
}

export const DiscoverProfileCard = ({ image, name, subtitle, distanceLabel = "1 km" }: DiscoverProfileCardProps) => {
  const photo = useMemo(() => image || fallbackImage, [image]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative w-full max-w-[360px] overflow-hidden rounded-3xl bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.16),0_24px_64px_rgba(0,0,0,0.12)] transition-all duration-300"
    >
      <img src={photo} alt={name} className="h-[420px] w-full object-cover" />

      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-4 py-2 text-sm font-medium shadow-lg border border-white/20">
        <MapPin className="h-4 w-4" aria-hidden="true" />
        <span>{distanceLabel}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-gradient-to-t from-black via-black/70 to-transparent px-8 pb-10 pt-28">
        <h2 className="text-2xl font-bold mb-1" aria-label={name}>{name}</h2>
        {subtitle ? <p className="mt-2 text-sm text-white/90 leading-relaxed">{subtitle}</p> : null}
      </div>
    </motion.div>
  );
};
