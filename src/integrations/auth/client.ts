import {
  AuthResponse,
  AuthSession,
  LoginEmailPayload,
  LoginPhonePayload,
  RegisterEmailPayload,
  RegisterPhonePayload,
  SendOtpPayload,
  VerifyOtpPayload,
  RefreshTokensResponse,
  LogoutResponse,
  SocialProvider,
} from "./types";

const RAW_BASE_URL = import.meta.env.VITE_AUTH_API_URL ?? "http://localhost:3001";
const AUTH_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

export class AuthApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.details = details;
  }
}

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new AuthApiError("Invalid JSON response from auth service", response.status);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${AUTH_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        ...JSON_HEADERS,
        ...(init.headers ?? {}),
      },
    });

    const payload = await parseJson<T>(response);

    if (!response.ok) {
      type ErrorPayload = { message?: string; error?: string };
      const errorPayload = payload as ErrorPayload | null;
      const message =
        errorPayload?.message ??
        errorPayload?.error ??
        response.statusText ??
        "Authentication service error";
      throw new AuthApiError(message, response.status, payload);
    }

    if (payload == null) {
      throw new AuthApiError("Empty response from authentication service", response.status);
    }

    return payload;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new AuthApiError(error.message || "Unable to reach authentication service", 0);
    }

    throw new AuthApiError("Unexpected authentication error", 0, error);
  }
}

const buildBody = (data: unknown) => JSON.stringify(data);

export async function registerWithEmail(payload: RegisterEmailPayload): Promise<AuthSession> {
  return request<AuthResponse>("/auth/register/email", {
    method: "POST",
    body: buildBody(payload),
  });
}

export async function registerWithPhone(payload: RegisterPhonePayload): Promise<AuthSession> {
  return request<AuthResponse>("/auth/register/phone", {
    method: "POST",
    body: buildBody(payload),
  });
}

export async function loginWithEmail(payload: LoginEmailPayload): Promise<AuthSession> {
  return request<AuthResponse>("/auth/login/email", {
    method: "POST",
    body: buildBody(payload),
  });
}

export async function loginWithPhone(payload: LoginPhonePayload): Promise<AuthSession> {
  return request<AuthResponse>("/auth/login/phone", {
    method: "POST",
    body: buildBody(payload),
  });
}

export async function sendOtp(payload: SendOtpPayload) {
  return request<{ message: string; contact: string; expiresIn?: string }>("/auth/otp/send", {
    method: "POST",
    body: buildBody(payload),
  });
}

export async function verifyOtp(payload: VerifyOtpPayload) {
  return request<{ verified: boolean; message: string }>("/auth/otp/verify", {
    method: "POST",
    body: buildBody(payload),
  });
}

export async function refreshTokens(refreshToken: string): Promise<RefreshTokensResponse> {
  return request<RefreshTokensResponse>("/auth/refresh", {
    method: "POST",
    body: buildBody({ refreshToken }),
  });
}

export async function logout(userId: string): Promise<LogoutResponse> {
  return request<LogoutResponse>("/auth/logout", {
    method: "POST",
    body: buildBody({ userId }),
  });
}

export function buildOAuthUrl(provider: SocialProvider, state?: string) {
  const url = new URL(`${AUTH_BASE_URL}/auth/${provider}`);
  if (state) {
    url.searchParams.set("state", state);
  }
  return url.toString();
}
