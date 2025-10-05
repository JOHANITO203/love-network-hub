import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  className?: string;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  className = ''
}) => {
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotate card based on drag position
  const rotate = useTransform(x, [-200, 200], [-25, 25]);

  // Opacity for like/nope indicators
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superLikeOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 100;
    const swipeVelocityThreshold = 500;

    // Check for up swipe (super like)
    if (
      info.offset.y < -swipeThreshold ||
      info.velocity.y < -swipeVelocityThreshold
    ) {
      setExitY(-1000);
      setIsExiting(true);
      setTimeout(() => onSwipeUp?.(), 300);
      return;
    }

    // Check for right swipe (like)
    if (
      info.offset.x > swipeThreshold ||
      info.velocity.x > swipeVelocityThreshold
    ) {
      setExitX(1000);
      setIsExiting(true);
      setTimeout(() => onSwipeRight?.(), 300);
      return;
    }

    // Check for left swipe (nope)
    if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -swipeVelocityThreshold
    ) {
      setExitX(-1000);
      setIsExiting(true);
      setTimeout(() => onSwipeLeft?.(), 300);
      return;
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ x, y, rotate }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={
        isExiting
          ? { x: exitX, y: exitY, opacity: 0 }
          : { x: 0, y: 0, opacity: 1 }
      }
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {/* NOPE indicator */}
      <motion.div
        className="absolute top-8 left-8 z-10 px-4 py-2 border-4 border-red-500 text-red-500 font-bold text-2xl rotate-[-20deg] rounded-lg pointer-events-none"
        style={{ opacity: nopeOpacity }}
      >
        NOPE
      </motion.div>

      {/* LIKE indicator */}
      <motion.div
        className="absolute top-8 right-8 z-10 px-4 py-2 border-4 border-green-500 text-green-500 font-bold text-2xl rotate-[20deg] rounded-lg pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        LIKE
      </motion.div>

      {/* SUPER LIKE indicator */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 px-4 py-2 border-4 border-blue-500 text-blue-500 font-bold text-2xl rounded-lg pointer-events-none"
        style={{ opacity: superLikeOpacity }}
      >
        SUPER LIKE
      </motion.div>

      {/* Card content */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};

export default SwipeCard;
