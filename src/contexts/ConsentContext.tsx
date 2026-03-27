import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { supabase } from "@/integrations/supabase/client";

export type ConsentKey = "location" | "push" | "biometry" | "sensitiveData";

export interface ConsentEntry {
  granted: boolean;
  updatedAt: number | null;
}

export type ConsentState = Record<ConsentKey, ConsentEntry>;

interface ConsentContextValue {
  consents: ConsentState;
  updateConsent: (key: ConsentKey, granted: boolean) => Promise<void>;
  resetConsents: () => Promise<void>;
}

const STORAGE_KEY = "moydate_consents";

const DEFAULT_CONSENTS: ConsentState = {
  location: { granted: false, updatedAt: null },
  push: { granted: false, updatedAt: null },
  biometry: { granted: false, updatedAt: null },
  sensitiveData: { granted: false, updatedAt: null },
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

const readStoredConsents = (): ConsentState => {
  if (typeof localStorage === "undefined") return DEFAULT_CONSENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENTS;
    const parsed = JSON.parse(raw) as ConsentState;
    return { ...DEFAULT_CONSENTS, ...parsed };
  } catch {
    return DEFAULT_CONSENTS;
  }
};

const persistConsents = (state: ConsentState) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage disabled/quota error -> ignore
  }
};

export const ConsentProvider = ({ children }: PropsWithChildren) => {
  const [consents, setConsents] = useState<ConsentState>(() => readStoredConsents());

  useEffect(() => {
    persistConsents(consents);
  }, [consents]);

  const logConsentToSupabase = useCallback(async (key: ConsentKey, granted: boolean) => {
    try {
      await supabase.from("consent_log").insert({
        key,
        granted,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.warn("[consent] failed to sync consent_log", error);
    }
  }, []);

  const updateConsent = useCallback(
    async (key: ConsentKey, granted: boolean) => {
      setConsents((prev) => ({
        ...prev,
        [key]: {
          granted,
          updatedAt: Date.now(),
        },
      }));
      void logConsentToSupabase(key, granted);
    },
    [logConsentToSupabase]
  );

  const resetConsents = useCallback(async () => {
    setConsents(DEFAULT_CONSENTS);
    persistConsents(DEFAULT_CONSENTS);
    await logConsentToSupabase("sensitiveData", false);
    await logConsentToSupabase("push", false);
    await logConsentToSupabase("location", false);
    await logConsentToSupabase("biometry", false);
  }, [logConsentToSupabase]);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consents,
      updateConsent,
      resetConsents,
    }),
    [consents, resetConsents, updateConsent]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};

export const useConsentContext = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsentContext must be used within a ConsentProvider");
  }
  return context;
};
