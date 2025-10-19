import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  initialLiked?: boolean;
  onLike?: (liked: boolean) => void;
  size?: number;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  initialLiked = false,
  onLike,
  size = 24,
  className = ''
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    if (newLikedState) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }

    onLike?.(newLikedState);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.button
        className="relative focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full p-2"
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          animate={isLiked ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{
            duration: 0.3,
            times: [0, 0.5, 1]
          }}
        >
          <Heart
            size={size}
            className={`transition-colors duration-200 ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </motion.div>

        {/* Pulsing ring effect when liked */}
        <AnimatePresence>
          {isLiked && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-500"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Particle explosion effect */}
      <AnimatePresence>
        {showParticles && (
          <>
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const distance = 30;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;

              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-400 rounded-full"
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x,
                    y,
                    scale: 0,
                    opacity: 0
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                />
              );
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LikeButton;
