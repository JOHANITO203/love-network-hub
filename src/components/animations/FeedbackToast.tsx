import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface FeedbackToastProps {
  type: ToastType;
  message: string;
  description?: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

const FeedbackToast: React.FC<FeedbackToastProps> = ({
  type,
  message,
  description,
  isVisible,
  onClose,
  duration = 5000,
  position = 'top-right'
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    warning: <AlertCircle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />
  };

  const colors = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      icon: 'text-green-500',
      text: 'text-green-900',
      progress: 'bg-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      icon: 'text-red-500',
      text: 'text-red-900',
      progress: 'bg-red-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      icon: 'text-yellow-500',
      text: 'text-yellow-900',
      progress: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      icon: 'text-blue-500',
      text: 'text-blue-900',
      progress: 'bg-blue-500'
    }
  };

  const positions = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  const slideVariants = {
    'top-right': {
      initial: { x: 400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 400, opacity: 0 }
    },
    'top-center': {
      initial: { y: -100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -100, opacity: 0 }
    },
    'bottom-right': {
      initial: { x: 400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 400, opacity: 0 }
    },
    'bottom-center': {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 100, opacity: 0 }
    }
  };

  const colorScheme = colors[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${positions[position]} z-50 max-w-md w-full pointer-events-auto`}
          initial={slideVariants[position].initial}
          animate={slideVariants[position].animate}
          exit={slideVariants[position].exit}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <motion.div
            className={`${colorScheme.bg} ${colorScheme.border} border-l-4 rounded-lg shadow-lg overflow-hidden`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className={`flex-shrink-0 ${colorScheme.icon}`}>
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1
                    }}
                  >
                    {icons[type]}
                  </motion.div>
                </div>
                <div className="ml-3 flex-1">
                  <motion.p
                    className={`text-sm font-medium ${colorScheme.text}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {message}
                  </motion.p>
                  {description && (
                    <motion.p
                      className={`mt-1 text-sm ${colorScheme.text} opacity-75`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 0.75, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {description}
                    </motion.p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <motion.button
                    className={`inline-flex rounded-md ${colorScheme.icon} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-500`}
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                className={`h-1 ${colorScheme.progress}`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{
                  duration: duration / 1000,
                  ease: "linear"
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackToast;
