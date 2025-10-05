import { motion } from "framer-motion";
import { Heart, Star, X } from "lucide-react";
import { DiscoverActionButton } from "./DiscoverActionButton";

interface DiscoverActionsProps {
  onLike: () => void;
  onPass: () => void;
  onSuperlike: () => void;
  disabled?: boolean;
}

export const DiscoverActions = ({ onLike, onPass, onSuperlike, disabled }: DiscoverActionsProps) => {
  return (
    <motion.div
      className="mt-8 flex items-center justify-center gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: disabled ? 0.3 : 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <DiscoverActionButton
        variant="pass"
        label="Pass profile"
        onClick={onPass}
        size="md"
        disabled={disabled}
        icon={<X className="h-7 w-7" />}
      />

      <DiscoverActionButton
        variant="like"
        label="Like profile"
        onClick={onLike}
        size="lg"
        disabled={disabled}
        icon={<Heart className="h-8 w-8 fill-current" />}
      />

      <DiscoverActionButton
        variant="superlike"
        label="Super like profile"
        onClick={onSuperlike}
        size="md"
        disabled={disabled}
        icon={<Star className="h-7 w-7" />}
      />
    </motion.div>
  );
};
