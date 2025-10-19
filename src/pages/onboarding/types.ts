export interface MediaFileSummary {
  id: string;
  url: string;
  type: "image" | "video";
}

export interface OnboardingState {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  profileBirthday?: string;
  zodiacSign?: string;
  gender?: string;
  mediaFiles?: MediaFileSummary[];
  photos?: string[];
  bio?: string;
  interests?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  locationEnabled?: boolean;
  interestedIn?: string;
  [key: string]: unknown;
}