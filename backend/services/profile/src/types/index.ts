export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  bio?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  looking_for: 'male' | 'female' | 'both';
  latitude?: number;
  longitude?: number;
  city?: string;
  country: string;
  interests?: string[];
  photos: string[];
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProfileDTO {
  user_id: string;
  display_name: string;
  bio?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  looking_for: 'male' | 'female' | 'both';
  city?: string;
  interests?: string[];
}

export interface UpdateProfileDTO {
  display_name?: string;
  bio?: string;
  age?: number;
  latitude?: number;
  longitude?: number;
  city?: string;
  interests?: string[];
}

export interface PhotoUploadResult {
  url: string;
  path: string;
}

export interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radius: number;
  minAge?: number;
  maxAge?: number;
  gender?: string;
  limit?: number;
}

export class ProfileError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ProfileError';
  }
}
