export type SocialProvider = "vk" | "google";

export interface TokenPayload {
  token: string;
  expiresIn: number;
  expiresAt?: string;
  jti?: string;
}

export interface AuthTokens {
  accessToken: TokenPayload;
  refreshToken: TokenPayload;
}

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  role: string;
  verified: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export type AuthSession = AuthResponse;

export interface RegisterEmailPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterPhonePayload {
  phone: string;
  password: string;
  otpCode: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginEmailPayload {
  email: string;
  password: string;
}

export interface LoginPhonePayload {
  phone: string;
  otpCode: string;
}

export interface SendOtpPayload {
  contact: string;
  type: "email" | "phone";
}

export interface VerifyOtpPayload {
  contact: string;
  code: string;
}

export interface RefreshTokensResponse {
  tokens: AuthTokens;
}

export interface LogoutResponse {
  message: string;
}

