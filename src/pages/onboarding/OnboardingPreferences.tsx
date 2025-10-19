import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, User, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OnboardingState } from "./types";

interface PreferenceOption {
  value: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
  description: string;
}

const preferenceOptions: PreferenceOption[] = [
  {
    value: "women",
    label: "Women",
    icon: Heart,
    gradient: "from-pink-500 to-red-500",
    description: "Interested in women"
  },
  {
    value: "men",
    label: "Men",
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
    description: "Interested in men"
  },
  {
    value: "everyone",
    label: "Everyone",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    description: "Open to everyone"
  },
];

export default function OnboardingPreferences() {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = (location.state as OnboardingState) ?? {};

  const [interestedIn, setInterestedIn] = useState(baseState.interestedIn ?? "");

  const handleContinue = () => {
    if (!interestedIn) return;

    const payload: OnboardingState = {
      ...baseState,
      interestedIn,
    };

    navigate("/onboarding/complete", { state: payload });
  };

  const handleSkip = () => {
    navigate("/onboarding/complete", { state: baseState });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">
              Your Preferences
            </h1>

            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-display mb-2">
              Who are you looking for?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select what matches your preferences
            </p>
          </div>

          <div className="space-y-4">
            {preferenceOptions.map((option, index) => {
              const Icon = option.icon;
              const isSelected = interestedIn === option.value;

              return (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInterestedIn(option.value)}
                  className={cn(
                    "w-full rounded-2xl border-2 transition-all duration-200 shadow-md",
                    "p-6 flex items-center gap-4",
                    isSelected
                      ? `border-transparent bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                      : "border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg hover:border-pink-300 dark:hover:border-pink-700"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center",
                    isSelected
                      ? "bg-white/20"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}>
                    <Icon className={cn(
                      "w-8 h-8",
                      isSelected && "fill-current"
                    )} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold mb-1">
                      {option.label}
                    </h3>
                    <p className={cn(
                      "text-sm",
                      isSelected
                        ? "text-white/80"
                        : "text-gray-600 dark:text-gray-400"
                    )}>
                      {option.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={handleContinue}
              disabled={!interestedIn}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white text-base font-semibold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Finish Setup
            </Button>

            <button
              onClick={handleSkip}
              className="w-full py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
