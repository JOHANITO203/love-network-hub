import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { calculateAge, calculateZodiacSign, getZodiacLabel } from "@/utils/zodiacCalculator";
import { interests } from "@/data/profileOptions";

interface OnboardingState {
  dialCode?: string;
  phoneNumber?: string;
  identity?: string;
  birthday?: string;
  passions?: string[];
  notificationsEnabled?: boolean;
  contactAccessGranted?: boolean;
  firstName?: string;
  lastName?: string;
  profileBirthday?: string;
}

const formatBirthday = (value?: string) => {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const OnboardingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onboardingState = (location.state as OnboardingState) ?? {};

  const birthday = onboardingState.birthday ? new Date(onboardingState.birthday) : null;
  const profileBirthday = onboardingState.profileBirthday ?? onboardingState.birthday;

  const zodiac = useMemo(() => {
    if (!birthday) return null;
    const sign = calculateZodiacSign(birthday);
    return {
      id: sign,
      label: getZodiacLabel(sign),
    };
  }, [birthday]);

  const age = birthday ? calculateAge(birthday) : null;
  const passionLabels = onboardingState.passions?.map((value) => {
    const found = interests.find((item) => item.value === value);
    return found ? found.label : value;
  });

  const handleEdit = (path: string) => {
    navigate(path, { replace: true, state: onboardingState });
  };

  const handleContinue = () => {
    navigate("/profile/details", { replace: true, state: onboardingState });
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-white">
      <div className="flex w-full max-w-xl flex-1 flex-col gap-6 px-6 pb-20 pt-10">
        <h1 className="text-3xl font-semibold text-[#1F1F33]">Preview your profile</h1>
        <p className="text-sm text-[#8C8D9E]">
          This is what other members will see. You can always edit this information later in your settings.
        </p>

        <Card className="border border-[#F0F1F5]">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-lg">Identity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleEdit("/onboarding/identity")}>Edit</Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-4 text-sm text-[#1F1F33]">
            <div className="flex justify-between text-muted-foreground">
              <span>Gender</span>
              <span className="font-medium text-foreground">{onboardingState.identity ?? "Not set"}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Phone</span>
              <span className="font-medium text-foreground">
                {onboardingState.dialCode && onboardingState.phoneNumber
                  ? `${onboardingState.dialCode} ${onboardingState.phoneNumber}`
                  : "Not set"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F0F1F5]">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-lg">Birthday</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleEdit("/onboarding/birthday")}>Edit</Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-4 text-sm text-[#1F1F33]">
            <div className="flex justify-between text-muted-foreground">
              <span>Birthdate</span>
              <span className="font-medium text-foreground">{formatBirthday(onboardingState.birthday)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Age</span>
              <span className="font-medium text-foreground">{age ?? "-"}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Zodiac</span>
              <span className="font-medium text-foreground">{zodiac?.label ?? "-"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F0F1F5]">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-lg">Passions</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleEdit("/onboarding/passions")}>Edit</Button>
          </CardHeader>
          <CardContent className="space-y-3 pt-4 text-sm">
            {passionLabels?.length ? (
              <div className="flex flex-wrap gap-2">
                {passionLabels.map((label) => (
                  <Badge key={label} variant="secondary" className="rounded-full border border-[#E94057]/20 bg-[#FFF1F4] text-[#E94057]">
                    {label}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No passion selected yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-[#F0F1F5]">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-lg">Preferences</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEdit("/onboarding/notifications")}>Notifications</Button>
              <Button variant="ghost" size="sm" onClick={() => handleEdit("/onboarding/contacts")}>Contacts</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-4 text-sm text-[#1F1F33]">
            <div className="flex justify-between text-muted-foreground">
              <span>Notifications</span>
              <span className="font-medium text-foreground">{onboardingState.notificationsEnabled ? "Enabled" : "Disabled"}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Contact access</span>
              <span className="font-medium text-foreground">{onboardingState.contactAccessGranted ? "Granted" : "Not granted"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#F0F1F5]">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-lg">About you</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleEdit("/profile/details")}>Edit</Button>
          </CardHeader>
          <CardContent className="space-y-2 pt-4 text-sm text-[#1F1F33]">
            <div className="flex justify-between text-muted-foreground">
              <span>First name</span>
              <span className="font-medium text-foreground">{onboardingState.firstName ?? "Not set"}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Last name</span>
              <span className="font-medium text-foreground">{onboardingState.lastName ?? "Not set"}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Profile birthday</span>
              <span className="font-medium text-foreground">{formatBirthday(profileBirthday)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            onClick={handleContinue}
            className="h-14 w-full max-w-sm rounded-[24px] bg-[#E94057] text-lg font-semibold text-white shadow-[0_18px_30px_rgba(233,64,87,0.35)]"
          >
            Finish setup
          </Button>
        </div>
      </div>
    </div>
  );
};
