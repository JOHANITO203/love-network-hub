import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, User, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConsent } from "@/hooks/useConsent";
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
    label: "Femmes",
    icon: Heart,
    gradient: "from-[#ff4d6d] to-[#ff8b5a]",
    description: "Intéressé par les femmes",
  },
  {
    value: "men",
    label: "Hommes",
    icon: User,
    gradient: "from-sky-500 to-cyan-500",
    description: "Intéressé par les hommes",
  },
  {
    value: "everyone",
    label: "Tout le monde",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    description: "Ouvert à tous",
  },
];

export default function OnboardingPreferences() {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = (location.state as OnboardingState) ?? {};
  const { updateConsent } = useConsent();

  const [interestedIn, setInterestedIn] = useState(baseState.interestedIn ?? "");

  const handleContinue = () => {
    if (!interestedIn) return;

    const payload: OnboardingState = {
      ...baseState,
      interestedIn,
    };

    void updateConsent("sensitiveData", true);
    navigate("/onboarding/complete", { state: payload });
  };

  const handleSkip = () => {
    void updateConsent("sensitiveData", false);
    navigate("/onboarding/complete", { state: baseState });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 glass-surface border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full text-white/80">
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <h1 className="text-lg font-semibold text-white font-display">Préférences</h1>

            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white font-display mb-2">Qui cherchez-vous ?</h2>
            <p className="text-white/60">Choisissez ce qui vous correspond.</p>
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
                    "w-full rounded-2xl border transition-all duration-200",
                    "p-6 flex items-center gap-4",
                    isSelected
                      ? `border-transparent bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center",
                    isSelected ? "bg-white/20" : "bg-white/10"
                  )}>
                    <Icon className={cn("w-8 h-8", isSelected && "fill-current")} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold mb-1">{option.label}</h3>
                    <p className={cn("text-sm", isSelected ? "text-white/80" : "text-white/60")}>
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
              className="h-14 w-full rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] text-white text-base font-semibold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Finaliser
            </Button>

            <button
              onClick={handleSkip}
              className="w-full py-3 text-sm font-semibold text-white/60 hover:text-white transition-colors"
            >
              Passer pour l'instant
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
