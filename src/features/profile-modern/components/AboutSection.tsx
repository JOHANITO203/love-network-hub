/**
 * МойDate - About Section Component
 * Bio, passions, and dynamic tips
 */

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AboutSectionProps {
  bio: string;
  passions: string[];
  tips?: string[];
}

export const AboutSection = ({ bio, passions, tips }: AboutSectionProps) => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 border border-border/50 dark:border-gray-800">
      {/* Header */}
      <h2 className="text-xl font-bold text-foreground mb-6">À propos</h2>

      {/* Bio */}
      {bio && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Bio
          </h3>
          <p className="text-foreground leading-relaxed">{bio}</p>
        </motion.div>
      )}

      {/* Passions */}
      {passions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Passions
          </h3>
          <div className="flex flex-wrap gap-2">
            {passions.map((passion, index) => (
              <motion.div
                key={passion}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 bg-gradient-to-r from-love-primary/10 to-love-secondary/10 dark:from-love-primary/5 dark:to-love-secondary/5 rounded-full border border-love-primary/20 dark:border-love-primary/10"
              >
                <span className="text-sm font-medium bg-gradient-primary bg-clip-text text-transparent">
                  {passion}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Dynamic Tips from Algorithm */}
      {tips && tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-2xl p-4 border border-purple-500/20 dark:border-purple-500/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              Conseils МойDate
            </h3>
          </div>

          <div className="space-y-2">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <span className="text-purple-500 mt-0.5">•</span>
                <span>{tip}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
