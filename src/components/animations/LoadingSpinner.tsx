import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'dots' | 'pulse' | 'heart';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'circle',
  color = 'text-pink-500',
  className = ''
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4.5 h-4.5'
  };

  if (variant === 'circle') {
    return (
      <div className={`inline-block ${className}`}>
        <motion.div
          className={`${sizes[size]} border-3 border-current rounded-full ${color}`}
          style={{
            borderTopColor: 'transparent',
            borderRightColor: 'transparent'
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center space-x-1.5 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${dotSizes[size]} ${color} bg-current rounded-full`}
            animate={{
              y: [-5, 5, -5],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`inline-block ${className}`}>
        <motion.div
          className={`${sizes[size]} ${color} bg-current rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    );
  }

  if (variant === 'heart') {
    return (
      <div className={`inline-block ${className}`}>
        <motion.svg
          className={sizes[size]}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            className={color}
            fill="currentColor"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.svg>
      </div>
    );
  }

  return null;
};

export default LoadingSpinner;
