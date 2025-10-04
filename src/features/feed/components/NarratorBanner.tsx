import { Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface NarratorBannerProps {
  message: string;
}

export const NarratorBanner = ({ message }: NarratorBannerProps) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-brand-red via-brand-orange to-brand-purple p-[1px]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative flex items-center gap-3 rounded-[31px] bg-white/95 px-5 py-4 shadow-soft">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
          <Megaphone className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-foreground/90">
          {message}
        </p>
      </div>
    </motion.div>
  );
};
