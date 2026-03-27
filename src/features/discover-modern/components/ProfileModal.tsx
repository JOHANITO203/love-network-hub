/**
 * МойDate - ProfileModal Component
 * Fullscreen profile view with carousel and actions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Star,
  MessageCircle,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Flag,
  Shield,
  Ruler,
  Sparkles,
} from 'lucide-react';
import { Profile } from '../types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProfileModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onSkip: () => void;
  onSuperLike: () => void;
  onMessage: () => void;
  onReport: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onLike,
  onSkip,
  onSuperLike,
  onMessage,
  onReport,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!profile) return null;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === profile.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? profile.images.length - 1 : prev - 1));
  };

  const handleClose = () => {
    setCurrentImageIndex(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full h-full max-w-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full h-[70vh] bg-gray-900">
              <img
                src={profile.images[currentImageIndex]}
                alt={`${profile.name} ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {profile.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {profile.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all duration-300',
                          index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                        )}
                      />
                    ))}
                  </div>
                </>
              )}

              {profile.verified && (
                <div className="absolute top-4 left-4 bg-white/20 text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
                  <Shield className="w-4 h-4" />
                  Vérifié
                </div>
              )}
            </div>

            <div className="glass-surface h-[30vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-semibold text-white">
                      {profile.name}, {profile.age}
                    </h1>
                    {profile.zodiacSign && (
                      <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-medium flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        {profile.zodiacSign}
                      </span>
                    )}
                  </div>

                  {profile.profession && (
                    <div className="flex items-center gap-2 text-white/70 mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{profile.profession}</span>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-center gap-2 text-white/70 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {profile.location}
                        {profile.distance && ` • ${profile.distance} km`}
                      </span>
                    </div>
                  )}

                  {profile.height && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Ruler className="w-4 h-4" />
                      <span>{profile.height} cm</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">Bio</h3>
                    <p className="text-white/75 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3">Centres d'intérêt</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-4 py-2 bg-white/10 text-white/80 rounded-full text-xs font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button
                    onClick={onMessage}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message
                  </Button>
                  <Button
                    onClick={onSuperLike}
                    size="lg"
                    className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 flex items-center gap-2"
                  >
                    <Star className="w-5 h-5 fill-current" />
                    Super like
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      onSkip();
                      handleClose();
                    }}
                    variant="outline"
                    className="text-rose-300 border-rose-300/40 hover:bg-rose-500/10"
                  >
                    Passer
                  </Button>
                  <Button
                    onClick={() => {
                      onLike();
                      handleClose();
                    }}
                    className="bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a]"
                  >
                    <Heart className="w-5 h-5 mr-2 fill-current" />
                    Aimer
                  </Button>
                </div>

                <button
                  onClick={onReport}
                  className="w-full text-xs text-white/50 hover:text-white/70 flex items-center justify-center gap-2 py-2"
                >
                  <Flag className="w-4 h-4" />
                  Signaler ou bloquer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
