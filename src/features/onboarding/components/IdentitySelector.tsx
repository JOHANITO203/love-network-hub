import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OnboardingState = {
  dialCode?: string;
  phoneNumber?: string;
};

const identityOptions = [
  { id: "woman", label: "Woman" },
  { id: "man", label: "Man" },
  { id: "other", label: "Choose another" },
] as const;

export const IdentitySelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = (location.state as OnboardingState) ?? {};
  const [selection, setSelection] = useState<string | null>(null);

  const goNext = (state: Record<string, unknown>) => {
    navigate("/onboarding/birthday", { replace: true, state });
  };

  const handleContinue = () => {
    if (!selection) return;
    goNext({ ...baseState, identity: selection });
  };

  const handleSkip = () => {
    goNext(baseState);
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-white">
      <div className="flex w-full max-w-md flex-1 flex-col px-6 pb-16 pt-10">
        <div className="mb-12 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] border border-[#EFEFF4] bg-white text-[#1F1F33] shadow-sm transition-colors hover:border-[#E94057] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E94057]/40"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-semibold text-[#E94057]"
          >
            Skip
          </button>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-[#1F1F33]">I am a</h1>
          <p className="text-sm text-[#8C8D9E]">
            Choose the identity that best describes you. You can change this later in your profile settings.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {identityOptions.map((option) => {
            const isActive = selection === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelection(option.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-[22px] border px-6 py-5 text-lg font-medium transition-colors",
                  isActive
                    ? "border-[#E94057] bg-[#E94057] text-white shadow-[0_18px_30px_rgba(233,64,87,0.25)]"
                    : "border-[#EFEFF4] bg-white text-[#1F1F33] hover:border-[#E94057]/60"
                )}
              >
                <span>{option.label}</span>
                <span
                  className={cn(
                    "h-4 w-4 rounded-full border",
                    isActive ? "border-white bg-white/20" : "border-[#D7D9E4]"
                  )}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-12">
          <Button
            type="button"
            onClick={handleContinue}
            disabled={!selection}
            className={cn(
              "h-14 w-full rounded-[24px] bg-[#E94057] text-lg font-semibold text-white shadow-[0_18px_30px_rgba(233,64,87,0.35)] transition-transform duration-200",
              !selection && "opacity-60"
            )}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

