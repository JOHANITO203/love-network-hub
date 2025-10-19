import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, SlidersHorizontal } from "lucide-react";

interface DiscoverHeaderProps {
  cityLabel?: string;
  onBack?: () => void;
  onOpenFilters: () => void;
}

export const DiscoverHeader = ({ cityLabel = "Nearby", onBack, onOpenFilters }: DiscoverHeaderProps) => {
  return (
    <motion.header
      className="mb-6 flex items-center justify-between text-text-dark dark:text-white"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onBack}
        aria-label="Go back"
        disabled={!onBack}
        className="h-12 w-12 rounded-[20px] border border-white/60 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-text-dark dark:text-white shadow-soft transition-transform duration-200 hover:scale-95 hover:border-brand-red/40 hover:text-brand-red"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="text-center">
        <h1 className="text-[28px] font-semibold tracking-tight text-text-dark dark:text-white">Discover</h1>
        <div className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-text-secondary dark:text-gray-400">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span>{cityLabel}</span>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onOpenFilters}
        aria-label="Open filters"
        className="h-12 w-12 rounded-[20px] border border-white/60 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-text-dark dark:text-white shadow-soft transition-transform duration-200 hover:scale-95 hover:border-brand-red/40 hover:text-brand-red"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </Button>
    </motion.header>
  );
};
