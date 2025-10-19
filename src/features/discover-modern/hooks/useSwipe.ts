/**
 * МойDate - useSwipe Hook
 * Handles all swipe logic and animations
 */

import { useState, useCallback, useEffect } from 'react';
import { useSpring } from 'framer-motion';
import { Profile, SwipeAction } from '../types';
import { saveUserAction } from '../store/userStats';

interface UseSwipeOptions {
  onSwipeLeft?: (profile: Profile) => void;
  onSwipeRight?: (profile: Profile) => void;
  onSuperLike?: (profile: Profile) => void;
  threshold?: number; // Swipe threshold in px
}

interface SwipeState {
  x: number;
  y: number;
  rotation: number;
  opacity: number;
}

export const useSwipe = (
  currentProfile: Profile | null,
  options: UseSwipeOptions = {}
) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSuperLike,
    threshold = 150,
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Motion values
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const rotation = useSpring(0, { stiffness: 300, damping: 30 });
  const opacity = useSpring(1, { stiffness: 300, damping: 30 });

  /**
   * Handle swipe action
   */
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (!currentProfile || isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    const targetX = direction === 'left' ? -1000 : 1000;
    const targetRotation = direction === 'left' ? -45 : 45;

    // Animate out
    x.set(targetX);
    rotation.set(targetRotation);
    opacity.set(0);

    // Save action
    const action: SwipeAction = direction === 'left' ? 'skip' : 'like';
    saveUserAction(currentProfile.id, action);

    // Trigger callback
    setTimeout(() => {
      if (direction === 'left') {
        onSwipeLeft?.(currentProfile);
      } else {
        onSwipeRight?.(currentProfile);
      }

      // Reset for next card
      x.set(0);
      y.set(0);
      rotation.set(0);
      opacity.set(1);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  }, [currentProfile, isAnimating, onSwipeLeft, onSwipeRight, x, y, rotation, opacity]);

  /**
   * Handle super like
   */
  const handleSuperLike = useCallback(() => {
    if (!currentProfile || isAnimating) return;

    setIsAnimating(true);

    // Animate up
    y.set(-1000);
    opacity.set(0);

    // Save super like
    saveUserAction(currentProfile.id, 'superlike');

    setTimeout(() => {
      onSuperLike?.(currentProfile);

      // Reset
      x.set(0);
      y.set(0);
      rotation.set(0);
      opacity.set(1);
      setIsAnimating(false);
    }, 300);
  }, [currentProfile, isAnimating, onSuperLike, x, y, rotation, opacity]);

  /**
   * Handle drag
   */
  const handleDrag = useCallback((deltaX: number, deltaY: number) => {
    if (isAnimating) return;

    setIsDragging(true);
    x.set(deltaX);
    y.set(deltaY);

    // Calculate rotation based on drag
    const newRotation = (deltaX / window.innerWidth) * 25; // Max 25 degrees
    rotation.set(newRotation);

    // Show direction indicator
    if (Math.abs(deltaX) > threshold / 2) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(null);
    }
  }, [isAnimating, x, y, rotation, threshold]);

  /**
   * Handle drag end
   */
  const handleDragEnd = useCallback((deltaX: number, velocityX: number) => {
    setIsDragging(false);

    // Determine if swipe should complete
    const shouldSwipe = Math.abs(deltaX) > threshold || Math.abs(velocityX) > 500;

    if (shouldSwipe) {
      const direction = deltaX > 0 ? 'right' : 'left';
      handleSwipe(direction);
    } else {
      // Return to center
      x.set(0);
      y.set(0);
      rotation.set(0);
      setSwipeDirection(null);
    }
  }, [threshold, handleSwipe, x, y, rotation]);

  /**
   * Keyboard support
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleSwipe('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSwipe('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleSuperLike();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe, handleSuperLike, isAnimating]);

  return {
    // State
    isDragging,
    swipeDirection,
    isAnimating,

    // Motion values
    motionValues: { x, y, rotation, opacity },

    // Actions
    handleSwipe,
    handleSuperLike,
    handleDrag,
    handleDragEnd,
  };
};
