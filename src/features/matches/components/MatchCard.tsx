import { motion } from "framer-motion";
import { X, Heart } from "lucide-react";

interface MatchCardProps {
  id: string;
  name: string;
  age?: number;
  image: string;
  onPass?: (id: string) => void;
  onLike?: (id: string) => void;
}

export const MatchCard = ({ id, name, age, image, onPass, onLike }: MatchCardProps) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.12),0_16px_48px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.16),0_24px_64px_rgba(0,0,0,0.12)]"
    >
      <img src={image} alt={name} className="h-48 w-full object-cover" />

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black via-black/60 to-transparent px-5 pb-4 pt-16">
        <div className="font-semibold text-lg">
          {name}
          {age ? <span>, {age}</span> : null}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => onPass?.(id)}
          className="flex h-14 items-center justify-center text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => onLike?.(id)}
          className="flex h-14 items-center justify-center text-white transition-all duration-300 hover:bg-white/10 active:scale-95"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};
