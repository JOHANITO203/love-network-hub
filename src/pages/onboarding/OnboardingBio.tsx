import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { interests } from "@/data/profileOptions";
import { cn } from "@/lib/utils";
import type { OnboardingState } from "./types";

const MAX_INTERESTS = 5;

export default function OnboardingBio() {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = (location.state as OnboardingState) ?? {};

  const [bio, setBio] = useState(baseState.bio ?? "");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    Array.isArray(baseState.interests) ? baseState.interests : []
  );

  const toggleInterest = (value: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      if (prev.length >= MAX_INTERESTS) {
        return prev;
      }
      return [...prev, value];
    });
  };

  const handleContinue = () => {
    const payload: OnboardingState = {
      ...baseState,
      bio,
      interests: selectedInterests,
    };

    navigate("/onboarding/location", { state: payload });
  };

  const handleSkip = () => {
    navigate("/onboarding/location", { state: baseState });
  };

  const isMaxReached = selectedInterests.length >= MAX_INTERESTS;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 glass-surface border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full text-white/80">
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <h1 className="text-lg font-semibold text-white font-display">À propos</h1>

            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white font-display mb-2">Racontez-vous</h2>
            <p className="text-white/60">Quelques phrases pour donner envie.</p>
          </div>

          <div className="space-y-6 glass-panel rounded-2xl p-6 border border-white/10">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Qui êtes-vous ? Qu'aimez-vous ?"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="min-h-32 resize-none text-base"
                maxLength={500}
              />
              <p className="text-right text-xs text-white/50">{bio.length}/500</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Centres d'intérêt</Label>
                <p className="text-sm text-white/60 mt-1">
                  Choisissez jusqu'à {MAX_INTERESTS} options •{' '}
                  <span className={cn("font-medium", isMaxReached && "text-[#ff4d6d]")}>
                    {selectedInterests.length} / {MAX_INTERESTS}
                  </span>
                  {isMaxReached && " (limite atteinte)"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {interests.map((item, index) => {
                  const isSelected = selectedInterests.includes(item.value);
                  const isDisabled = !isSelected && isMaxReached;

                  return (
                    <motion.button
                      key={item.value}
                      type="button"
                      onClick={() => !isDisabled && toggleInterest(item.value)}
                      disabled={isDisabled}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={!isDisabled ? { scale: 1.05 } : {}}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 border",
                        isSelected && "border-transparent bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] text-white shadow-md",
                        !isSelected && !isDisabled && "border-white/10 bg-white/5 hover:border-white/30",
                        isDisabled && "cursor-not-allowed border-white/10 bg-white/5 opacity-40"
                      )}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] text-white text-base font-semibold shadow-lg transition-all hover:scale-[1.02]"
            >
              Continuer
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
