import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Camera, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileDetailsState {
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
  avatar?: string;
}

export const ProfileDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = (location.state as ProfileDetailsState) ?? {};

  const [state, setState] = useState<ProfileDetailsState>({
    firstName: baseState.firstName ?? "",
    lastName: baseState.lastName ?? "",
    profileBirthday: baseState.profileBirthday ?? "",
    avatar: baseState.avatar ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      firstName: baseState.firstName ?? prev.firstName,
      lastName: baseState.lastName ?? prev.lastName,
      profileBirthday: baseState.profileBirthday ?? prev.profileBirthday,
      avatar: baseState.avatar ?? prev.avatar,
    }));
  }, [baseState.avatar, baseState.firstName, baseState.lastName, baseState.profileBirthday]);

  const handleInputChange = (key: keyof ProfileDetailsState, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleBirthdaySelect = () => {
    dateInputRef.current?.showPicker?.();
    if (!dateInputRef.current?.showPicker) {
      dateInputRef.current?.click();
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const payload: ProfileDetailsState = {
      ...baseState,
      ...state,
    };
    setTimeout(() => {
      navigate("/profile-setup", { replace: true, state: payload });
    }, 400);
  };

  const handleSkip = () => {
    navigate("/profile-setup", { replace: true, state: baseState });
  };

  return (
    <div className="flex min-h-screen w-full justify-center bg-white">
      <div className="flex w-full max-w-md flex-1 flex-col px-6 pb-16 pt-12">
        <div className="mb-12 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-[#E94057]"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-semibold text-[#E94057]"
          >
            Skip
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-10">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-[#1F1F33]">Profile details</h1>

            <div className="flex flex-col items-center gap-4">
              <div className="relative h-28 w-28 overflow-hidden rounded-[28px] bg-[#F3F4F8]">
                {state.avatar ? (
                  <img src={state.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl text-[#C7C8D5]">
                    ??
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#E94057] text-white shadow-[0_10px_22px_rgba(233,64,87,0.35)]"
                  aria-label="Upload photo"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      handleInputChange("avatar", typeof reader.result === "string" ? reader.result : "");
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
              <p className="text-sm text-[#8C8D9E]">Add a clear photo of yourself</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#8C8D9E]" htmlFor="firstName">
                  First name
                </label>
                <Input
                  id="firstName"
                  placeholder="David"
                  value={state.firstName}
                  onChange={(event) => handleInputChange("firstName", event.target.value)}
                  className="h-14 rounded-[18px] border border-[#EFEFF4] bg-white text-base text-[#1F1F33]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#8C8D9E]" htmlFor="lastName">
                  Last name
                </label>
                <Input
                  id="lastName"
                  placeholder="Peterson"
                  value={state.lastName}
                  onChange={(event) => handleInputChange("lastName", event.target.value)}
                  className="h-14 rounded-[18px] border border-[#EFEFF4] bg-white text-base text-[#1F1F33]"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleBirthdaySelect}
              className="flex h-16 w-full items-center justify-between rounded-[24px] bg-[#FFE7EB] px-6 text-base font-semibold text-[#E94057] shadow-[0_12px_24px_rgba(233,64,87,0.2)]"
            >
              <span className="flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                {state.profileBirthday ? `Birthday: ${formatBirthday(state.profileBirthday)}` : "Choose birthday date"}
              </span>
              <span className="text-sm text-[#E94057]/80">Edit</span>
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={state.profileBirthday ?? ""}
              onChange={(event) => handleInputChange("profileBirthday", event.target.value)}
              className="hidden"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-auto flex h-14 w-full items-center justify-center gap-2 rounded-[24px] bg-[#E94057] text-lg font-semibold text-white shadow-[0_18px_30px_rgba(233,64,87,0.35)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

const formatBirthday = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
