/**
 * МойDate - SectionHeader Component
 * Temporal section headers for matches list
 */

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { MatchSection } from '../types';

interface SectionHeaderProps {
  section: MatchSection;
  count: number;
}

const SECTION_LABELS: Record<MatchSection, { label: string; icon: React.ElementType }> = {
  today: { label: "Aujourd'hui", icon: Clock },
  yesterday: { label: 'Hier', icon: Calendar },
  thisWeek: { label: 'Cette semaine', icon: Calendar },
  older: { label: 'Plus ancien', icon: Calendar },
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ section, count }) => {
  const { label, icon: Icon } = SECTION_LABELS[section];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-0 z-10 bg-gradient-to-b from-pink-50 via-pink-50 to-transparent dark:from-gray-950 dark:via-gray-950 py-3"
    >
      <div className="flex items-center gap-2 px-2">
        <Icon className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold text-gray-900 dark:text-white font-display uppercase tracking-wider">
          {label}
        </h2>
        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-bold">
          {count}
        </span>
      </div>
    </motion.div>
  );
};
