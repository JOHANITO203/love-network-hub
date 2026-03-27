import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONFETTI_DURATION = 2500;

export default function OnboardingComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    const end = Date.now() + CONFETTI_DURATION;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ["#ff4d6d", "#ff8b5a", "#5aa9ff"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ["#ff4d6d", "#ff8b5a", "#5aa9ff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    return () => {
      confetti.reset?.();
    };
  }, []);

  const handleStart = () => {
    navigate("/app", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.div
        className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 3, opacity: 0.04 }}
        transition={{ duration: 1.5 }}
      >
        <Heart className="w-96 h-96 text-[#ff4d6d] fill-current" />
      </motion.div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] shadow-2xl"
            >
              <Check className="h-14 w-14 text-white" strokeWidth={3} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-5xl font-semibold text-white font-display mb-3">Tout est prêt</h1>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-[#ff4d6d]" />
                <p className="text-xl text-white/70">Votre profil est magnifique</p>
                <Sparkles className="w-6 h-6 text-[#ff4d6d]" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-white/60 max-w-md mx-auto"
            >
              Vous êtes prêt à matcher et discuter en toute simplicité.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="max-w-md mx-auto glass-panel rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-4">À suivre</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-white/70">
                    <strong>Découvrir</strong> des profils proches
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-white/70">
                    <strong>Matcher</strong> avec ceux que vous aimez
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-white/70">
                    <strong>Discuter</strong> avec traduction automatique
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="max-w-md mx-auto"
            >
              <Button
                onClick={handleStart}
                className="h-16 w-full rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] text-white text-lg font-bold shadow-2xl transition-all hover:scale-[1.02]"
              >
                <Heart className="mr-3 h-6 w-6 fill-current" />
                Commencer à matcher
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
