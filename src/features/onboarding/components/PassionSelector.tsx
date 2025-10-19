import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { interests } from "@/data/profileOptions";
import { cn } from "@/lib/utils";

const MAX_SELECTION = 5;

interface OnboardingState {
  dialCode?: string;
  phoneNumber?: string;
  identity?: string;
  birthday?: string;
  passions?: string[];
}

export const PassionSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = (location.state as OnboardingState) ?? {};
  const [selected, setSelected] = useState<string[]>(baseState.passions ?? []);

  const toggleInterest = (value: string) => {
    setSelected((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      if (prev.length >= MAX_SELECTION) {
        return prev;
      }
      return [...prev, value];
    });
  };

  const handleSkip = () => {
    navigate("/onboarding/notifications", { replace: true, state: baseState });
  };

  const handleContinue = () => {
    navigate("/profile-setup", {
      replace: true,
      state: { ...baseState, passions: selected },
    });
  };

  const isDisabled = selected.length === 0;
  const sortedInterests = useMemo(() => interests.slice(0, 12), []);

  return (
    <div className="flex min-h-screen w-full justify-center bg-white">
      <div className="flex w-full max-w-md flex-1 flex-col px-6 pb-16 pt-10">
        <div className="mb-10 flex items-center justify-between">
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

        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-[#1F1F33]">Your interests</h1>
          <p className="text-sm leading-relaxed text-[#8C8D9E]">
            Select a few of your interests and let everyone know what you’re passionate about.
          </p>
          <p className="text-xs font-medium text-[#E94057]">
            {selected.length} / {MAX_SELECTION} selected
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {sortedInterests.map((interest) => {
            const isActive = selected.includes(interest.value);
            return (
              <button
                key={interest.value}
                type="button"
                onClick={() => toggleInterest(interest.value)}
                className={cn(
                  "flex h-16 items-center justify-center gap-2 rounded-[22px] border text-base font-medium transition-all",
                  isActive
                    ? "border-transparent bg-[#E94057] text-white shadow-[0_12px_24px_rgba(233,64,87,0.25)]"
                    : "border-[#EFEFF4] bg-white text-[#1F1F33] hover:border-[#E94057]/60"
                )}
              >
                <span className="text-lg" aria-hidden="true">
                  {interest.icon}
                </span>
                <span>{interest.label.replace(/^..\s/, "")}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-12">
          <Button
            type="button"
            onClick={handleContinue}
            disabled={isDisabled}
            className={cn(
              "h-14 w-full rounded-[24px] bg-[#E94057] text-lg font-semibold text-white shadow-[0_18px_30px_rgba(233,64,87,0.35)] transition-transform duration-200",
              isDisabled && "opacity-60"
            )}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};


