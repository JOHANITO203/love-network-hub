import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: 'fade' | 'slide' | 'scale' | 'slideUp';
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variant = 'fade'
}) => {
  const location = useLocation();

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slide: {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 },
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
    scale: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    slideUp: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 },
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const selectedVariant = variants[variant];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        exit={selectedVariant.exit}
        transition={selectedVariant.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
