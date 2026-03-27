/**
 * МойDate - Profile Progress Component
 * Shows profile completion percentage with suggestions
 */

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { ProfileCompletion } from '../types';

interface ProfileProgressProps {
  completion: ProfileCompletion;
}

export const ProfileProgress = ({ completion }: ProfileProgressProps) => {
  const { percentage, suggestions } = completion;

  const isComplete = percentage === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bento-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400" />
          )}
          <h3 className="font-semibold text-foreground">
            Profil {isComplete ? 'complet' : `à ${percentage}%`}
          </h3>
        </div>
        <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {percentage}%
        </span>
      </div>

      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-love-primary to-love-secondary rounded-full"
        />
      </div>

      {!isComplete && suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="text-love-primary">•</span>
              <span>{suggestion}</span>
            </motion.div>
          ))}
        </div>
      )}

      {isComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-emerald-300 text-center"
        >
          🎉 Profil optimisé ! Tu reçois +40% de visibilité.
        </motion.p>
      )}
    </motion.div>
  );
};
