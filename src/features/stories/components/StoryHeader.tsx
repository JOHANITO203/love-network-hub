import { motion } from "framer-motion";
import { X } from "lucide-react";

interface StoryHeaderProps {
  name: string;
  avatar: string;
  progress: number;
  onClose: () => void;
}

export const StoryHeader = ({ name, avatar, progress, onClose }: StoryHeaderProps) => {
  return (
    <div className="absolute inset-x-0 top-0 px-6 pt-6">
      <div className="relative h-1 rounded-full bg-white/30">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-[#E94057]"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      <div className="mt-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
          <div>
            <p className="text-lg font-semibold">{name}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/25 text-white"
          aria-label="Close story"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
