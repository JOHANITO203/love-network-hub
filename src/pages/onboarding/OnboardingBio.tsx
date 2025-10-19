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
              About You
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
              Share your story
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Let people know what makes you unique
            </p>
          </div>

          <div className="space-y-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-800/50">
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Describe yourself in a few sentences... What do you love? What are you looking for?"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="min-h-32 resize-none text-base"
                maxLength={500}
              />
              <p className="text-right text-xs text-gray-500 dark:text-gray-400">
                {bio.length}/500 characters
              </p>
            </div>

            {/* Interests */}
            <div className="space-y-4">
              <div>
                <Label>Interests</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select up to {MAX_INTERESTS} interests •{" "}
                  <span className={cn(
                    "font-medium",
                    isMaxReached && "text-pink-600 dark:text-pink-400"
                  )}>
                    {selectedInterests.length} / {MAX_INTERESTS} selected
                  </span>
                  {isMaxReached && " (limit reached)"}
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
                        "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 border-2",
                        isSelected && "border-transparent bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md",
                        !isSelected && !isDisabled && "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-pink-300 dark:hover:border-pink-700",
                        isDisabled && "cursor-not-allowed border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 opacity-40"
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
              className="h-14 w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white text-base font-semibold shadow-lg transition-all hover:scale-[1.02]"
            >
              Continue
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
