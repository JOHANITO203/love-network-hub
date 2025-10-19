/**
 * МойDate - SwipeCard Component
 * Interactive swipeable profile card with animations
 */

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, MapPin, Briefcase, Star, Shield } from 'lucide-react';
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

  // Transform for indicators opacity based on drag
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
      style={{
        x,
        y,
        rotate: rotation,
        opacity,
      }}
      className={cn(
        "absolute w-full max-w-sm h-[600px] cursor-grab active:cursor-grabbing",
        isDragging && "cursor-grabbing"
      )}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
        {/* Main Image */}
        <div className="relative w-full h-full">
          <img
            src={profile.images[0]}
            alt={profile.name}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* LIKE Indicator */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 right-8 pointer-events-none"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold text-2xl rotate-12 shadow-xl border-4 border-white">
              <Heart className="w-8 h-8 fill-current inline mr-2" />
              LIKE
            </div>
          </motion.div>

          {/* NOPE Indicator */}
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 left-8 pointer-events-none"
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-2xl -rotate-12 shadow-xl border-4 border-white">
              <X className="w-8 h-8 inline mr-2" />
              NOPE
            </div>
          </motion.div>

          {/* Verified Badge */}
          {profile.verified && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <Shield className="w-4 h-4 fill-current" />
              Verified
            </div>
          )}

          {/* Profile Info - Bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 p-6 text-white cursor-pointer"
            onClick={onOpenProfile}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-3xl font-bold mb-1">
                  {profile.name}, {profile.age}
                </h2>
                {profile.profession && (
                  <div className="flex items-center gap-2 text-white/90">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{profile.profession}</span>
                  </div>
                )}
              </div>
            </div>

            {profile.location && (
              <div className="flex items-center gap-2 text-white/90 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {profile.location}
                  {profile.distance && ` • ${profile.distance} km away`}
                </span>
              </div>
            )}

            {profile.bio && (
              <p className="text-white/90 text-sm line-clamp-2 leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.interests.slice(0, 3).map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}

            {/* Tap to view indicator */}
            <div className="mt-4 text-center">
              <span className="text-xs text-white/60">Tap to view full profile</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
