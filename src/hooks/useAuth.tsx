import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface MockUser {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: Record<string, unknown>;
}

export interface MockSession {
  user: MockUser;
  access_token: string;
}

interface AuthContextValue {
  user: MockUser | null;
  session: MockSession | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOtp: (contact: string, isPhone: boolean) => Promise<{ error: Error | null }>;
  verifyOtp: (contact: string, token: string, isPhone: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "moydate_session";
const OTP_KEY = "moydate_otp_pending";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: MockSession = JSON.parse(stored);
        setSession(parsed);
        setUser(parsed.user);
      } catch (error) {
        console.warn("Failed to parse stored session", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (nextSession: MockSession | null) => {
    if (nextSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const signUp: AuthContextValue["signUp"] = async (email, _password, firstName, lastName) => {
    try {
      await delay();
      const newUser: MockUser = {
        id: `user-${Date.now()}`,
        email,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
        },
      };
      const newSession: MockSession = {
        user: newUser,
        access_token: `token-${Date.now()}`,
      };
      setUser(newUser);
      setSession(newSession);
      persistSession(newSession);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn: AuthContextValue["signIn"] = async (email) => {
    try {
      await delay();
      const newUser: MockUser = {
        id: `user-${Date.now()}`,
        email,
      };
      const newSession: MockSession = {
        user: newUser,
        access_token: `token-${Date.now()}`,
      };
      setUser(newUser);
      setSession(newSession);
      persistSession(newSession);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithOtp: AuthContextValue["signInWithOtp"] = async (contact, isPhone) => {
    try {
      await delay();
      localStorage.setItem(
        OTP_KEY,
        JSON.stringify({ contact, isPhone, code: "1234", timestamp: Date.now() })
      );
            return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const verifyOtp: AuthContextValue["verifyOtp"] = async (contact, token, isPhone) => {
    try {
      await delay();
      const pendingRaw = localStorage.getItem(OTP_KEY);
      if (!pendingRaw) {
        throw new Error("No OTP request found");
      }
      const pending = JSON.parse(pendingRaw);
      if (token !== "1234" && token !== pending.code) {
        throw new Error("Invalid code");
      }
      const newUser: MockUser = {
        id: `user-${Date.now()}`,
        ...(isPhone ? { phone: contact } : { email: contact }),
      };
      const newSession: MockSession = {
        user: newUser,
        access_token: `token-${Date.now()}`,
      };
      setUser(newUser);
      setSession(newSession);
      persistSession(newSession);
      localStorage.removeItem(OTP_KEY);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await delay(100);
    setUser(null);
    setSession(null);
    persistSession(null);
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOtp,
    verifyOtp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
