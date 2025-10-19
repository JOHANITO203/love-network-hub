import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Heart, Star } from "lucide-react";

interface DiscoverActionsProps {
  onPass?: () => void;
  onLike?: () => void;
  onSuperlike?: () => void;
  disabled?: boolean;
}

export const DiscoverActions = ({ onPass, onLike, onSuperlike, disabled }: DiscoverActionsProps) => {
  return (
    <div className="mt-10 flex items-center justify-center gap-6">
      <motion.div whileTap={{ scale: 0.94 }}>
        <Button
          type="button"
          disabled={disabled}
          onClick={onPass}
          className="flex h-16 w-16 items-center justify-center rounded-full border-0 bg-white text-[#FF6B6B] shadow-[0_18px_40px_rgba(255,107,107,0.25)]"
        >
          <X className="h-7 w-7" />
        </Button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.94 }}>
        <Button
          type="button"
          disabled={disabled}
          onClick={onLike}
          className="flex h-20 w-20 items-center justify-center rounded-full border-0 bg-[#E94057] text-white shadow-[0_25px_45px_rgba(233,64,87,0.4)]"
        >
          <Heart className="h-8 w-8" />
        </Button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.94 }}>
        <Button
          type="button"
          disabled={disabled}
          onClick={onSuperlike}
          className="flex h-16 w-16 items-center justify-center rounded-full border-0 bg-white text-[#8A2387] shadow-[0_18px_40px_rgba(138,35,135,0.25)]"
        >
          <Star className="h-7 w-7" />
        </Button>
      </motion.div>
    </div>
  );
};
