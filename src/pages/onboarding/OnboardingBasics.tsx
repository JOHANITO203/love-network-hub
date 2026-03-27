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
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 glass-surface border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full text-white/80">
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <h1 className="text-lg font-semibold text-white font-display">Profil</h1>

            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white font-display mb-2">Quelques infos</h2>
            <p className="text-white/60">Créez un profil clair et authentique.</p>
          </div>

          <div className="space-y-6 glass-panel rounded-2xl p-6 border border-white/10">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                placeholder="Votre prénom"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                placeholder="Votre nom"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-12 text-base"
              />
            </div>

            <DatePickerModern
              value={birthDate}
              onChange={handleDateSelect}
              label="Date de naissance *"
              placeholder="Sélectionnez votre date"
            />

            {zodiacSign && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl bg-white/5 p-4 text-center border border-white/10"
              >
                <p className="text-sm text-white/60 mb-1">Signe astrologique</p>
                <p className="text-2xl font-bold text-white">{zodiacSign}</p>
              </motion.div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              disabled={!firstName.trim() || !lastName.trim() || !birthDate}
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
