import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import { useConsent } from "./useConsent";

export type VerificationStatus = "not_started" | "pending" | "approved" | "rejected";

interface VerificationRecord {
  id: string;
  status: VerificationStatus;
  url?: string | null;
  updated_at?: string | null;
}

export const useVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateConsent } = useConsent();
  const [record, setRecord] = useState<VerificationRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const loadRecord = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("verification_requests")
      .select("id,status,payload,url,updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (error) {
      console.warn("[verification] load failure", error);
      return;
    }

    if (data) {
      const payloadUrl = (data as any)?.payload?.mockUrl ?? null;
      setRecord({
        id: data.id,
        status: (data.status as VerificationStatus) ?? "pending",
        url: (data.url as string | null) ?? payloadUrl,
        updated_at: data.updated_at ?? undefined,
      });
    } else {
      setRecord(null);
    }
  }, [user]);

  const startVerification = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verification", {
        body: { user_id: user.id },
      });

      if (error) throw error;

      await updateConsent("biometry", true);
      setRecord({
        id: data?.verificationId ?? "",
        status: "pending",
        url: data?.url ?? undefined,
      });
      toast({
        title: "Vérification démarrée",
        description: "Complétez la procédure dans la fenêtre ouverte.",
      });
    } catch (error) {
      console.error("[verification] start failed", error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la vérification.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, updateConsent, user]);

  const markComplete = useCallback(async () => {
    if (!user || !record) return;
    try {
      const { error } = await supabase
        .from("verification_requests")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", record.id);
      if (error) throw error;
      setRecord((prev) => (prev ? { ...prev, status: "approved" } : prev));
      toast({
        title: "Vérification validée",
        description: "Merci d’avoir confirmé votre identité.",
      });
    } catch (error) {
      console.error("[verification] markComplete failed", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de vérification.",
        variant: "destructive",
      });
    }
  }, [record, toast, user]);

  useEffect(() => {
    void loadRecord();
  }, [loadRecord]);

  return {
    loading,
    record,
    startVerification,
    markComplete,
    refresh: loadRecord,
  };
};
