import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { interests, orientationOptions, pronounOptions, personaSymbols } from "@/data/profileOptions";
import { calculateAge, calculateZodiacSign } from "@/utils/zodiacCalculator";
import { ImageUpload } from "./ImageUpload";
import { cn } from "@/lib/utils";

interface ProfileSetupProps {
  onProfileComplete: (payload: { profile_images: string[] | null }) => void;
  onExit: () => void;
}

interface ProfileFormState {
  firstName: string;
  lastName: string;
  bio: string;
  dateOfBirth: string;
  pronouns: string;
  orientation: string;
  interests: string[];
  personaSymbols: string[];
  notificationsEnabled: boolean;
  contactAccessGranted: boolean;
  photos: string[];
}

const STORAGE_KEY = "moydate_profile";

const DEFAULT_STATE: ProfileFormState = {
  firstName: "",
  lastName: "",
  bio: "",
  dateOfBirth: "",
  pronouns: pronounOptions[0]?.value ?? "",
  orientation: orientationOptions[0]?.value ?? "",
  interests: [],
  personaSymbols: [],
  notificationsEnabled: true,
  contactAccessGranted: false,
  photos: [],
};

const STEPS = ["Informations", "Centre d’intérêt", "Préférences", "Résumé"] as const;

type Step = typeof STEPS[number];

const MAX_INTERESTS = 6;

export const ProfileSetup = ({ onProfileComplete, onExit }: ProfileSetupProps) => {
  const [form, setForm] = useState<ProfileFormState>(DEFAULT_STATE);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<ProfileFormState>;
        setForm({ ...DEFAULT_STATE, ...parsed });
      } catch (error) {
        console.warn("Failed to restore profile", error);
      }
    }
  }, []);

  const step = STEPS[currentStepIndex];

  const zodiacLabel = useMemo(() => {
    if (!form.dateOfBirth) return "";
    return calculateZodiacSign(new Date(form.dateOfBirth));
  }, [form.dateOfBirth]);

  const age = useMemo(() => {
    if (!form.dateOfBirth) return null;
    return calculateAge(new Date(form.dateOfBirth));
  }, [form.dateOfBirth]);

  const toggleInterest = (value: string) => {
    setForm((prev) => {
      const exists = prev.interests.includes(value);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((item) => item !== value) };
      }
      if (prev.interests.length >= MAX_INTERESTS) {
        toast({
          title: "Limite atteinte",
          description: `Vous pouvez choisir ${MAX_INTERESTS} centres d'intérêt maximum.`,
        });
        return prev;
      }
      return { ...prev, interests: [...prev.interests, value] };
    });
  };

  const toggleSymbol = (value: string) => {
    setForm((prev) => {
      const exists = prev.personaSymbols.includes(value);
      if (exists) {
        return { ...prev, personaSymbols: prev.personaSymbols.filter((item) => item !== value) };
      }
      return { ...prev, personaSymbols: [...prev.personaSymbols, value] };
    });
  };

  const goNext = () => {
    setCurrentStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setCurrentStepIndex((index) => Math.max(index - 1, 0));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setSaving(false);
    toast({
      title: "Profil enregistré",
      description: "Vos informations sont stockées localement.",
    });
    onProfileComplete({ profile_images: form.photos });
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between rounded-full bg-[#F5F6FB] px-4 py-2 text-xs font-medium text-[#8C8D9E]">
      {STEPS.map((label, index) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full",
              index === currentStepIndex ? "bg-[#E94057] text-white" : "bg-white text-[#8C8D9E]"
            )}
          >
            {index + 1}
          </span>
          <span className={cn(index === currentStepIndex ? "text-[#1F1F33]" : "text-[#8C8D9E]")}>{label}</span>
          {index < STEPS.length - 1 && <span className="h-px w-6 bg-[#E6E7F2]" />}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case "Informations":
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <ImageUpload
                currentImage={form.photos[0]}
                onImageUpdate={(image) =>
                  setForm((prev) => ({ ...prev, photos: image ? [image] : [] }))
                }
              />
              <p className="text-sm text-[#8C8D9E]">Ajoutez une photo claire de vous</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Prénom"
                value={form.firstName}
                onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                className="h-12 rounded-[16px]"
              />
              <Input
                placeholder="Nom"
                value={form.lastName}
                onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                className="h-12 rounded-[16px]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                type="date"
                value={form.dateOfBirth}
                onChange={(event) => setForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                className="h-12 rounded-[16px]"
              />
              <Textarea
                placeholder="Quelques mots sur vous"
                value={form.bio}
                onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                className="rounded-[16px]"
              />
            </div>

            {form.dateOfBirth && (
              <div className="rounded-[18px] bg-[#F5F6FB] px-4 py-3 text-sm text-[#1F1F33]">
                <p>Âge estimé : {age}</p>
                <p>Signe astrologique : {zodiacLabel}</p>
              </div>
            )}
          </div>
        );

      case "Centre d’intérêt":
        return (
          <div className="space-y-6">
            <p className="text-sm text-[#8C8D9E]">Sélectionnez jusqu'à {MAX_INTERESTS} centres d'intérêt.</p>
            <div className="grid grid-cols-2 gap-3">
              {interests.slice(0, 12).map((interest) => (
                <button
                  key={interest.value}
                  type="button"
                  onClick={() => toggleInterest(interest.value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-[18px] border px-4 py-3 text-sm",
                    form.interests.includes(interest.value)
                      ? "border-transparent bg-[#E94057] text-white shadow-[0_18px_32px_rgba(233,64,87,0.25)]"
                      : "border-[#E6E7F2] bg-white text-[#1F1F33]"
                  )}
                >
                  {interest.label.replace(/^[^ ]+\s/, "")}
                </button>
              ))}
            </div>
          </div>
        );

      case "Préférences":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#8C8D9E]">Pronoms</p>
                <div className="flex flex-wrap gap-2">
                  {pronounOptions.map((option) => (
                    <Badge
                      key={option.value}
                      onClick={() => setForm((prev) => ({ ...prev, pronouns: option.value }))}
                      className={cn(
                        "cursor-pointer rounded-full border px-3 py-1 text-xs",
                        form.pronouns === option.value
                          ? "border-transparent bg-[#E94057] text-white"
                          : "border-[#E6E7F2] bg-white text-[#1F1F33]"
                      )}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-[#8C8D9E]">Orientation</p>
                <div className="flex flex-wrap gap-2">
                  {orientationOptions.map((option) => (
                    <Badge
                      key={option.value}
                      onClick={() => setForm((prev) => ({ ...prev, orientation: option.value }))}
                      className={cn(
                        "cursor-pointer rounded-full border px-3 py-1 text-xs",
                        form.orientation === option.value
                          ? "border-transparent bg-[#E94057] text-white"
                          : "border-[#E6E7F2] bg-white text-[#1F1F33]"
                      )}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-[#8C8D9E]">Badges & symboles</p>
              <div className="flex flex-wrap gap-3">
                {personaSymbols.map((symbol) => (
                  <button
                    key={symbol.value}
                    type="button"
                    onClick={() => toggleSymbol(symbol.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-[16px] border px-4 py-2 text-sm",
                      form.personaSymbols.includes(symbol.value)
                        ? "border-transparent bg-[#FFF1F4] text-[#E94057]"
                        : "border-[#E6E7F2] bg-white text-[#1F1F33]"
                    )}
                  >
                    {symbol.emoji} {symbol.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[18px] border border-[#E6E7F2] bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1F1F33]">Notifications</p>
                  <p className="text-xs text-[#8C8D9E]">Recevez les nouveaux matchs et messages.</p>
                </div>
                <Switch
                  checked={form.notificationsEnabled}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, notificationsEnabled: checked }))}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1F1F33]">Accès aux contacts</p>
                  <p className="text-xs text-[#8C8D9E]">Suggère des amis déjà inscrits.</p>
                </div>
                <Switch
                  checked={form.contactAccessGranted}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, contactAccessGranted: checked }))}
                />
              </div>
            </div>
          </div>
        );

      case "Résumé":
      default:
        return (
          <div className="space-y-6">
            <div className="rounded-[24px] bg-white p-4 shadow-soft">
              <h3 className="text-lg font-semibold text-[#1F1F33]">Profil</h3>
              <p className="text-sm text-[#8C8D9E] mt-2">{form.firstName} {form.lastName}</p>
              <p className="text-sm text-[#8C8D9E]">{age ? `${age} ans` : ''} {zodiacLabel}</p>
              <p className="mt-3 text-sm text-[#1F1F33] whitespace-pre-line">{form.bio}</p>
            </div>

            <div className="rounded-[24px] bg-white p-4 shadow-soft">
              <h3 className="text-lg font-semibold text-[#1F1F33]">Centres d'intérêt</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.interests.map((interest) => (
                  <Badge key={interest} className="rounded-full bg-[#E94057] text-white">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <StepIndicator />

        <Card className="border-none shadow-[0_40px_60px_rgba(17,17,17,0.08)]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#1F1F33]">Complétez votre profil</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={onExit}
                className="text-[#8C8D9E] hover:text-[#1F1F33]"
              >
                Quitter
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={goBack}
                  disabled={currentStepIndex === 0}
                  className="rounded-full"
                >
                  Précédent
                </Button>
                {step === "Résumé" ? (
                  <Button
                    onClick={handleSave}
                    className="rounded-full bg-[#E94057] px-6 text-white shadow-[0_22px_40px_rgba(233,64,87,0.35)]"
                    disabled={saving}
                  >
                    {saving ? "Enregistrement..." : "Terminer"}
                  </Button>
                ) : (
                  <Button
                    onClick={goNext}
                    className="rounded-full bg-[#E94057] px-6 text-white shadow-[0_22px_40px_rgba(233,64,87,0.35)]"
                  >
                    Suivant
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
