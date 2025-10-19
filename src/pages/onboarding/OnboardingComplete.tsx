import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

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
        colors: ["#FF6B9D", "#C44569", "#FFC048"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ["#FF6B9D", "#C44569", "#FFC048"],
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Animated Background Heart */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 3, opacity: 0.05 }}
        transition={{ duration: 1.5 }}
      >
        <Heart className="w-96 h-96 text-pink-500 fill-current" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-2xl"
            >
              <Check className="h-16 w-16 text-white" strokeWidth={3} />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white font-display mb-3">
                All set!
              </h1>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-pink-500" />
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Your profile looks amazing
                </p>
                <Sparkles className="w-6 h-6 text-pink-500" />
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto"
            >
              You're ready to start your journey. Let's find your perfect match!
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-800/50"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                What's next?
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Discover</strong> amazing profiles near you
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Match</strong> with people you like
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Connect</strong> and start meaningful conversations
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="max-w-md mx-auto"
            >
              <Button
                onClick={handleStart}
                className="h-16 w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white text-lg font-bold shadow-2xl transition-all hover:scale-[1.02]"
              >
                <Heart className="mr-3 h-6 w-6 fill-current" />
                Start Matching
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
