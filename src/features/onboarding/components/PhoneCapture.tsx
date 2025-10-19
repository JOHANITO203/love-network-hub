import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Phone } from "lucide-react";
import { countries } from "@/data/countries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export const PhoneCapture = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [countryCode, setCountryCode] = useState<string>(() => {
    const fallback = countries[0];
    const preferred = countries.find((country) => country.code === "US");
    return (preferred ?? fallback).code;
  });
  const [phoneNumber, setPhoneNumber] = useState("");

  const selectedCountry = useMemo(() => {
    return countries.find((country) => country.code === countryCode) ?? countries[0];
  }, [countryCode]);

  const isValid = phoneNumber.replace(/\D/g, "").length >= 6;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    // TODO: persister les infos dans un store (onboarding) avant d'aller plus loin
    navigate("/onboarding/code", {
      state: { dialCode: selectedCountry.dialCode, phoneNumber },
    });
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center bg-white">
      <div className="flex w-full max-w-xl flex-1 flex-col px-6 pb-16 pt-14 md:px-12">
        <header className="mb-10 flex flex-col gap-4">
          <h1 className="text-4xl font-semibold leading-tight text-[#1F1F33]">My mobile</h1>
          <p className="max-w-sm text-base leading-relaxed text-[#57586C]">
            Please enter your valid phone number. We will send you a 4-digit code to verify your account.
          </p>
        </header>

        <form className="flex flex-1 flex-col gap-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block text-sm font-medium uppercase tracking-wide text-[#8C8D9E]">
              Phone number
            </label>
            <div className="flex items-center gap-3">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex min-w-[120px] items-center justify-between rounded-[18px] border border-[#F1F1F5] bg-[#FDFDFE] px-4 py-3 text-base font-semibold text-[#1F1F33] shadow-sm transition-colors hover:border-[#E94057] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E94057]/40"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden="true">
                        {selectedCountry.flag}
                      </span>
                      <span>{selectedCountry.dialCode}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-[#8C8D9E]" aria-hidden="true" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-0" sideOffset={12} align="start">
                  <Command>
                    <CommandInput placeholder="Search a country" className="h-12" />
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {countries.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={country.name}
                          onSelect={() => {
                            setCountryCode(country.code);
                            setOpen(false);
                          }}
                          className="flex cursor-pointer items-center gap-3 px-3 py-2"
                        >
                          <span className="text-xl" aria-hidden="true">
                            {country.flag}
                          </span>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium text-[#1F1F33]">{country.name}</span>
                            <span className="text-xs text-[#8C8D9E]">{country.dialCode}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="relative flex-1">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C0C1CF]" />
                <Input
                  type="tel"
                  inputMode="tel"
                  aria-label="Phone number"
                  placeholder="331 623 8413"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="h-14 rounded-[18px] border-[1.5px] border-[#F1F1F5] bg-[#FDFDFE] pl-12 pr-4 text-base font-medium text-[#1F1F33] shadow-sm transition-colors focus:border-[#E94057] focus-visible:ring-2 focus-visible:ring-[#E94057]/40"
                />
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <Button
              type="submit"
              disabled={!isValid}
              className={cn(
                "h-14 w-full rounded-[24px] bg-[#E94057] text-lg font-semibold text-white shadow-[0_18px_30px_rgba(233,64,87,0.35)] transition-transform duration-200",
                !isValid && "opacity-60"
              )}
            >
              Continue
            </Button>

            <p className="text-center text-xs text-[#8C8D9E]">
              By continuing, you agree to receive SMS messages for verification. Standard rates may apply.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
