/**
 * МойDate - Profile Header Component
 * Avatar, name, location, relationship status, astro sign
 */

import { motion } from 'framer-motion';
import { MapPin, Edit, Shield, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '../types';
import { RELATIONSHIP_STATUS_CONFIG } from '../types';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEdit: () => void;
}

export const ProfileHeader = ({ profile, onEdit }: ProfileHeaderProps) => {
  const statusConfig = RELATIONSHIP_STATUS_CONFIG[profile.relationshipStatus];
  const mainPhoto = profile.media[profile.mainPhotoIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 border border-border/50 dark:border-gray-800"
    >
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg"
          >
            <img
              src={mainPhoto?.url || 'https://via.placeholder.com/200'}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Verified Badge */}
          {profile.verified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900"
            >
              <Shield className="w-4 h-4 text-white" fill="currentColor" />
            </motion.div>
          )}

          {/* Premium Badge */}
          {profile.isPremium && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900"
            >
              <Crown className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          {/* Name & Age */}
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-foreground">
              {profile.username}
            </h1>
            <span className="text-xl text-muted-foreground">{profile.age}</span>
            <span className="text-2xl">{profile.astroSign}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {profile.currentCity}, {profile.countryOfOrigin} {profile.countryFlag}
            </span>
          </div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.color} text-white text-sm font-medium`}
          >
            <span>{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </motion.div>
        </div>

        {/* Edit Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-muted-foreground hover:text-foreground"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};
