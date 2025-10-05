import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMatchMessage, type SupportedLanguage } from '@/utils/matchMessages';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserPhoto: string;
  currentUserName: string;
  matchedUserPhoto: string;
  matchedUserName: string;
  onSayHello: () => void;
  language?: SupportedLanguage;
}

export const MatchModal = ({
  isOpen,
  onClose,
  currentUserPhoto,
  currentUserName,
  matchedUserPhoto,
  matchedUserName,
  onSayHello,
  language = 'fr',
}: MatchModalProps) => {
  const [confettiParticles, setConfettiParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti particles
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setConfettiParticles(particles);
    }
  }, [isOpen]);

  const handleSayHello = () => {
    onSayHello();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Confetti Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ y: -20, opacity: 1, scale: 1 }}
                animate={{
                  y: ['0vh', '100vh'],
                  opacity: [1, 0.8, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  delay: particle.delay,
                  ease: 'linear',
                }}
                className="absolute"
                style={{
                  left: `${particle.x}%`,
                }}
              >
                <Heart
                  className="w-4 h-4"
                  style={{
                    color: ['#E94057', '#F27121', '#F5C33B'][Math.floor(Math.random() * 3)],
                    fill: 'currentColor',
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md"
          >
            {/* Glassmorphism Card */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              {/* Header Section */}
              <div className="relative pt-12 pb-8 px-6 text-center">
                {/* Animated Title */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-brand-red animate-pulse" />
                    <h2 className="text-4xl font-bold bg-gradient-moydate bg-clip-text text-transparent">
                      {getMatchMessage(language, 'title')}
                    </h2>
                    <Sparkles className="w-6 h-6 text-brand-red animate-pulse" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getMatchMessage(language, 'subtitle', matchedUserName)}
                  </p>
                </motion.div>

                {/* Profile Photos Container */}
                <div className="relative flex justify-center items-center h-48 mb-8">
                  {/* Current User Photo - Left */}
                  <motion.div
                    initial={{ x: -100, opacity: 0, rotate: -10 }}
                    animate={{ x: 0, opacity: 1, rotate: -5 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                    className="absolute left-12"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          boxShadow: [
                            '0 0 20px 5px rgba(233, 64, 87, 0.5)',
                            '0 0 30px 10px rgba(233, 64, 87, 0.3)',
                            '0 0 20px 5px rgba(233, 64, 87, 0.5)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 shadow-xl"
                      >
                        <img
                          src={currentUserPhoto}
                          alt={currentUserName}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      {/* Glow ring */}
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-2 border-[#E94057] opacity-50"
                      />
                    </div>
                  </motion.div>

                  {/* Heart Icon - Center */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    className="relative z-10"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E94057] to-[#F27121] flex items-center justify-center shadow-2xl"
                    >
                      <Heart className="w-8 h-8 text-white fill-current" />
                    </motion.div>
                  </motion.div>

                  {/* Matched User Photo - Right */}
                  <motion.div
                    initial={{ x: 100, opacity: 0, rotate: 10 }}
                    animate={{ x: 0, opacity: 1, rotate: 5 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                    className="absolute right-12"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          boxShadow: [
                            '0 0 20px 5px rgba(245, 195, 59, 0.5)',
                            '0 0 30px 10px rgba(245, 195, 59, 0.3)',
                            '0 0 20px 5px rgba(245, 195, 59, 0.5)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 shadow-xl"
                      >
                        <img
                          src={matchedUserPhoto}
                          alt={matchedUserName}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      {/* Glow ring */}
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute inset-0 rounded-full border-2 border-[#F5C33B] opacity-50"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="px-6 pb-8 space-y-3"
              >
                <Button
                  onClick={handleSayHello}
                  size="lg"
                  className="w-full bg-gradient-moydate hover:shadow-glow text-white font-semibold rounded-full shadow-love transition-smooth hover:scale-105"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {getMatchMessage(language, 'sayHello')}
                </Button>

                <button
                  onClick={onClose}
                  className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors duration-200"
                >
                  {getMatchMessage(language, 'keepSwiping')}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
