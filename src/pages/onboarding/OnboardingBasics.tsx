import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerModern } from "@/components/ui/date-picker-modern";
import type { OnboardingState } from "./types";

type ZodiacSign =
  | "Belier"
  | "Taureau"
  | "Gemeaux"
  | "Cancer"
  | "Lion"
  | "Vierge"
  | "Balance"
  | "Scorpion"
  | "Sagittaire"
  | "Capricorne"
  | "Verseau"
  | "Poissons";

const getZodiacSign = (date: Date): ZodiacSign => {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Belier";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taureau";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemeaux";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Lion";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Vierge";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Balance";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpion";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittaire";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorne";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Verseau";
  return "Poissons";
};

export default function OnboardingBasics() {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = (location.state as OnboardingState) ?? {};

  const [firstName, setFirstName] = useState(baseState.firstName ?? "");
  const [lastName, setLastName] = useState(baseState.lastName ?? "");
  const [birthDate, setBirthDate] = useState<Date | undefined>(() => {
    if (!baseState.birthDate) return undefined;
    const next = new Date(baseState.birthDate);
    return Number.isNaN(next.getTime()) ? undefined : next;
  });
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign | "">(() => {
    if (!baseState.birthDate) return "";
    const next = new Date(baseState.birthDate);
    if (Number.isNaN(next.getTime())) return "";
    return getZodiacSign(next);
  });

  const handleDateSelect = (date: Date) => {
    setBirthDate(date);
    if (date) {
      setZodiacSign(getZodiacSign(date));
    } else {
      setZodiacSign("");
    }
  };

  const handleContinue = () => {
    const safeFirst = firstName.trim();
    const safeLast = lastName.trim();
    if (!safeFirst || !safeLast || !birthDate) return;

    const payload: OnboardingState = {
      ...baseState,
      firstName: safeFirst,
      lastName: safeLast,
      birthDate: birthDate.toISOString(),
      profileBirthday: birthDate.toISOString(),
      zodiacSign,
    };

    navigate("/onboarding/gender", { state: payload });
  };

  const handleSkip = () => {
    const payload: OnboardingState = {
      ...baseState,
      firstName: firstName.trim() || baseState.firstName,
      lastName: lastName.trim() || baseState.lastName,
      birthDate: birthDate ? birthDate.toISOString() : baseState.birthDate,
      profileBirthday: birthDate ? birthDate.toISOString() : baseState.profileBirthday,
      zodiacSign: zodiacSign || baseState.zodiacSign,
    };

    navigate("/onboarding/gender", { state: payload });
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
              Basic Information
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
              Tell us about yourself
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We'll use this to create your profile
            </p>
          </div>

          <div className="space-y-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-800/50">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name *</Label>
              <Input
                id="firstName"
                placeholder="Your first name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last name *</Label>
              <Input
                id="lastName"
                placeholder="Your last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-12 text-base"
              />
            </div>

            <DatePickerModern
              value={birthDate}
              onChange={handleDateSelect}
              label="Date of birth *"
              placeholder="Select your birth date"
            />

            {zodiacSign && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 p-4 text-center border border-pink-200 dark:border-pink-800"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your zodiac sign</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                  {zodiacSign}
                </p>
              </motion.div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              disabled={!firstName.trim() || !lastName.trim() || !birthDate}
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
