import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glowEffect?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  glowEffect = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'relative font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 focus:ring-purple-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const glowStyles = glowEffect && variant === 'primary'
    ? 'shadow-lg shadow-pink-500/50'
    : '';

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${glowStyles} ${className}`}
      disabled={disabled || isLoading}
      whileHover={{
        scale: disabled || isLoading ? 1 : 1.02,
        boxShadow: glowEffect && !disabled && !isLoading
          ? '0 10px 40px -10px rgba(236, 72, 153, 0.6)'
          : undefined
      }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <motion.span
            className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Loading...
        </span>
      ) : (
        <span className="relative z-10">{children}</span>
      )}

      {glowEffect && !disabled && !isLoading && (
        <motion.span
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 opacity-0"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default AnimatedButton;
