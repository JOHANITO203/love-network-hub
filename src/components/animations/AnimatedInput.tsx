import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  helperText,
  icon,
  inputSize = 'md',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {label && (
        <motion.label
          className="absolute left-4 pointer-events-none origin-left transition-colors duration-200"
          animate={{
            y: isFocused || hasValue ? -24 : 12,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: error ? '#ef4444' : isFocused ? '#ec4899' : '#6b7280'
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
        >
          {label}
        </motion.label>
      )}

      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <motion.input
          className={`
            w-full ${sizeStyles[inputSize]} ${icon ? 'pl-10' : ''}
            border-2 rounded-lg bg-white
            transition-colors duration-200
            focus:outline-none
            ${error
              ? 'border-red-500 focus:border-red-600'
              : 'border-gray-300 focus:border-pink-500'
            }
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          animate={{
            boxShadow: isFocused
              ? error
                ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                : '0 0 0 3px rgba(236, 72, 153, 0.1)'
              : '0 0 0 0px rgba(0, 0, 0, 0)'
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          {...props}
        />

        {/* Focus indicator line */}
        <motion.div
          className={`absolute bottom-0 left-0 h-0.5 ${error ? 'bg-red-500' : 'bg-gradient-to-r from-pink-500 to-purple-600'}`}
          initial={{ width: 0 }}
          animate={{
            width: isFocused ? '100%' : 0,
            opacity: isFocused ? 1 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        />
      </div>

      {/* Error or Helper Text */}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            className="mt-1 text-sm text-red-500 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        ) : helperText ? (
          <motion.p
            key="helper"
            className="mt-1 text-sm text-gray-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {helperText}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedInput;
