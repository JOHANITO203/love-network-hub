import { Request } from 'express';

export interface User {
  id: string;
  phone?: string;
  phone_verified: boolean;
  email?: string;
  email_verified: boolean;
  vk_id?: string;
  google_id?: string;
  apple_id?: string;
  instagram_id?: string;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  sessionId: string;
  type: 'access' | 'refresh';
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  sessionId?: string;
}

export interface OTPCode {
  id: number;
  phone: string;
  code: string;
  attempts: number;
  expires_at: Date;
  verified: boolean;
}

export interface SessionData {
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivity: string;
}

export type OAuthProvider = 'vk' | 'google' | 'apple' | 'instagram';
export type AuthEventType = 'login' | 'logout' | 'otp_sent' | 'otp_verified' | 'token_refresh';

export class AuthError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class RateLimitError extends AuthError {
  constructor(message = 'Too Many Requests') {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
  }
}
