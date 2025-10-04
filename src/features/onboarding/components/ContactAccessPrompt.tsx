import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingState {
  dialCode?: string;
  phoneNumber?: string;
  identity?: string;
  birthday?: string;
  passions?: string[];
  notificationsEnabled?: boolean;
  contactAccessGranted?: boolean;
}

export const ContactAccessPrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = (location.state as OnboardingState) ?? {};
  const [pending, setPending] = useState(false);

  const goNext = (contactAccessGranted: boolean) => {
    setPending(true);
    setTimeout(() => {
      navigate("/onboarding/summary", {
        replace: true,
        state: { ...baseState, contactAccessGranted },
      });
    }, 250);
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
            onClick={() => goNext(false)}
            className="text-sm font-semibold text-[#E94057]"
            disabled={pending}
          >
            Skip
          </button>
        </div>

        <div className="mt-20 flex flex-col items-center gap-10 text-center">
          <div className="relative h-40 w-40 rounded-full bg-gradient-to-br from-[#F6E8FF] via-[#E5D2FF] to-[#D0BCFF] shadow-[0_22px_40px_rgba(138,35,135,0.2)]" aria-hidden="true" />
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-[#1F1F33]">Search friend’s</h1>
            <p className="text-sm leading-relaxed text-[#8C8D9E]">
              You can find friends from your contact lists to connected
            </p>
          </div>
        </div>

        <div className="mt-auto pt-16">
          <Button
            type="button"
            onClick={() => goNext(true)}
            disabled={pending}
            className="h-14 w-full rounded-[24px] bg-[#E94057] text-lg font-semibold text-white shadow-[0_18px_30px_rgba(233,64,87,0.35)]"
          >
            Access to a contact list
          </Button>
        </div>
      </div>
    </div>
  );
};
