/**
 * МойDate - SwipeCard Component
 * Interactive swipeable profile card with animations
 */

import { motion, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, MapPin, Briefcase, Shield } from 'lucide-react';
import { Profile } from '../types';
import { cn } from '@/lib/utils';

interface SwipeCardProps {
  profile: Profile;
  motionValues: {
    x: any;
    y: any;
    rotation: any;
    opacity: any;
  };
  onDrag: (deltaX: number, deltaY: number) => void;
  onDragEnd: (deltaX: number, velocityX: number) => void;
  onOpenProfile: () => void;
  swipeDirection: 'left' | 'right' | null;
  isDragging: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  motionValues,
  onDrag,
  onDragEnd,
  onOpenProfile,
  swipeDirection,
  isDragging,
}) => {
  const { x, y, rotation, opacity } = motionValues;

  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

  const handleDragHandler = (_: any, info: PanInfo) => {
    onDrag(info.offset.x, info.offset.y);
  };

  const handleDragEndHandler = (_: any, info: PanInfo) => {
    onDragEnd(info.offset.x, info.velocity.x);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDrag={handleDragHandler}
      onDragEnd={handleDragEndHandler}
      style={{ x, y, rotate: rotation, opacity }}
      className={cn(
        'absolute w-full max-w-sm h-[70vh] min-h-[520px] cursor-grab active:cursor-grabbing',
        isDragging && 'cursor-grabbing'
      )}
    >
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="relative w-full h-full">
          <img
            src={profile.images[0]}
            alt={profile.name}
            className="w-full h-full object-cover"
            draggable={false}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <motion.div style={{ opacity: likeOpacity }} className="absolute top-6 right-6 pointer-events-none">
            <div className="bg-emerald-500 text-white px-5 py-2 rounded-2xl font-bold text-xl rotate-12 shadow-xl border border-white/30">
              <Heart className="w-6 h-6 fill-current inline mr-2" />
              OUI
            </div>
          </motion.div>

          <motion.div style={{ opacity: nopeOpacity }} className="absolute top-6 left-6 pointer-events-none">
            <div className="bg-rose-500 text-white px-5 py-2 rounded-2xl font-bold text-xl -rotate-12 shadow-xl border border-white/30">
              <X className="w-6 h-6 inline mr-2" />
              NON
            </div>
          </motion.div>

          {profile.verified && (
            <div className="absolute top-4 left-4 bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              Vérifié
            </div>
          )}

          <div
            className="absolute bottom-0 left-0 right-0 p-6 text-white cursor-pointer"
            onClick={onOpenProfile}
          >
            <div className="glass-panel rounded-3xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-3xl font-semibold">
                    {profile.name}, {profile.age}
                  </h2>
                  {profile.profession && (
                    <div className="flex items-center gap-2 text-white/80 mt-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{profile.profession}</span>
                    </div>
                  )}
                </div>
              </div>

              {profile.location && (
                <div className="flex items-center gap-2 text-white/80 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {profile.location}
                    {profile.distance && ` • ${profile.distance} km`}
                  </span>
                </div>
              )}

              {profile.bio && (
                <p className="text-white/85 text-sm line-clamp-2 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {profile.interests && profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.interests.slice(0, 3).map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 text-center">
                <span className="text-xs text-white/60">Touchez pour voir le profil complet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
