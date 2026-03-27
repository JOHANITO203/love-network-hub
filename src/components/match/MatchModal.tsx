import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
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
      const particles = Array.from({ length: 24 }, (_, i) => ({
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiParticles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ y: -20, opacity: 1, scale: 1 }}
                animate={{ y: ['0vh', '100vh'], opacity: [1, 0.8, 0], rotate: [0, 360] }}
                transition={{ duration: 3, delay: particle.delay, ease: 'linear' }}
                className="absolute"
                style={{ left: `${particle.x}%` }}
              >
                <Heart className="w-4 h-4 text-[#ff4d6d] fill-current" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md"
          >
            <div className="bento-card p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff4d6d]/10 via-[#5aa9ff]/10 to-[#4bd4a6]/10" />

              <div className="relative">
                <p className="text-xs text-white/60 uppercase tracking-wide">Nouveau match</p>
                <h2 className="text-3xl font-semibold text-white mt-2">
                  {getMatchMessage(language, 'title')}
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  {getMatchMessage(language, 'subtitle', matchedUserName)}
                </p>

                <div className="flex items-center justify-center gap-4 mt-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                      <img src={currentUserPhoto} alt={currentUserName} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff4d6d] to-[#ff8b5a] flex items-center justify-center shadow-[0_12px_24px_rgba(255,77,109,0.35)]">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                      <img src={matchedUserPhoto} alt={matchedUserName} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Button
                    onClick={handleSayHello}
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] hover:opacity-90 text-white font-semibold rounded-full"
                  >
                    {getMatchMessage(language, 'sayHello')}
                  </Button>

                  <button
                    onClick={onClose}
                    className="w-full py-3 text-white/60 hover:text-white font-medium transition-colors duration-200"
                  >
                    {getMatchMessage(language, 'keepSwiping')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
