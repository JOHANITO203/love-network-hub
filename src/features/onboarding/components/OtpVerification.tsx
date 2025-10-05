import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 4;
const COUNTDOWN_SECONDS = 60;

const keypadLayout = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["", "0", "back"]] as const;

type PhoneState = {
  dialCode?: string;
  phoneNumber?: string;
};

export const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneState = (location.state as PhoneState) ?? {};

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [verifying, setVerifying] = useState(false);

  const verifyCode = useCallback(
    async (code: string) => {
      setVerifying(true);
      await new Promise((resolve) => setTimeout(resolve, 350));
            navigate("/onboarding/identity", { replace: true, state: phoneState });
    },
    [navigate, phoneState]
  );

  const pushDigit = useCallback(
    (digit: string) => {
      setDigits((prev) => {
        const next = [...prev];
        const index = next.findIndex((value) => value === "");
        if (index === -1) return prev;
        next[index] = digit;
        const nextActive = Math.min(index + 1, OTP_LENGTH - 1);
        setActiveIndex(nextActive);
        if (index === OTP_LENGTH - 1) {
          verifyCode(next.join(""));
        }
        return next;
      });
    },
    [verifyCode]
  );

  const popDigit = useCallback(() => {
    setDigits((prev) => {
      let index = prev.length - 1;
      while (index >= 0 && prev[index] === "") {
        index -= 1;
      }
      if (index < 0) return prev;
      const next = [...prev];
      next[index] = "";
      setActiveIndex(index);
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (verifying) return;
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        pushDigit(event.key);
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        popDigit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [popDigit, pushDigit, verifying]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const handleKeypadPress = (key: string) => {
    if (verifying) return;
    if (key === "back") {
      popDigit();
      return;
    }
    if (key === "") return;
    pushDigit(key);
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setDigits(Array(OTP_LENGTH).fill(""));
    setActiveIndex(0);
    setSecondsLeft(COUNTDOWN_SECONDS);
  };

  useEffect(() => {
    if (!phoneState?.dialCode || !phoneState?.phoneNumber) {
      navigate("/onboarding/phone", { replace: true });
    }
  }, [navigate, phoneState?.dialCode, phoneState?.phoneNumber]);

  const targetPhone = useMemo(() => {
    if (!phoneState?.dialCode || !phoneState?.phoneNumber) return null;
    return `${phoneState.dialCode} ${phoneState.phoneNumber}`;
  }, [phoneState?.dialCode, phoneState?.phoneNumber]);

  return (
    <div className="flex min-h-screen w-full justify-center bg-white">
      <div className="flex w-full max-w-md flex-1 flex-col px-6 pb-16 pt-10">
        <div className="mb-14 flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] border border-[#EFEFF4] bg-white text-[#1F1F33] shadow-sm transition-colors hover:border-[#E94057] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E94057]/40"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center">
          <p className="text-5xl font-semibold tracking-tight text-[#1F1F33]">{formattedTimer}</p>
          <p className="mt-6 text-lg text-[#57586C]">Type the verification code we�ve sent you</p>
          {targetPhone ? <p className="mt-1 text-sm text-[#8C8D9E]">{targetPhone}</p> : null}
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          {digits.map((value, index) => {
            const isFilled = value !== "";
            const isActive = !isFilled && index === activeIndex;
            return (
              <div
                key={index}
                className={cn(
                  "flex h-[84px] w-[84px] items-center justify-center rounded-3xl border text-3xl font-semibold transition-colors",
                  isFilled && "border-none bg-[#E94057] text-white",
                  !isFilled && "border-[#F1F1F5] text-[#C0C1CF]",
                  isActive && "border-[2px] border-[#E94057]/70"
                )}
              >
                {value || "\u00A0"}
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col gap-6">
          {keypadLayout.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-3 gap-x-12 text-2xl font-medium text-[#1F1F33]">
              {row.map((key) => {
                if (key === "back") {
                  return (
                    <button
                      key="backspace"
                      type="button"
                      onClick={() => handleKeypadPress(key)}
                      className="flex h-16 items-center justify-center rounded-full text-[#1F1F33] transition-colors hover:text-[#E94057] focus:outline-none"
                      aria-label="Delete"
                    >
                      <Delete className="h-7 w-7" />
                    </button>
                  );
                }

                if (key === "") {
                  return <span key={`placeholder-${rowIndex}`} />;
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeypadPress(key)}
                    className="flex h-16 items-center justify-center rounded-full transition-colors hover:text-[#E94057] focus:outline-none"
                    disabled={verifying}
                    aria-label={`Digit ${key}`}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-10 text-center">
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={secondsLeft > 0}
            className={cn(
              "text-base font-semibold text-[#E94057]",
              secondsLeft > 0 && "pointer-events-none opacity-40"
            )}
          >
            Send again
          </Button>
        </div>
      </div>
    </div>
  );
};

