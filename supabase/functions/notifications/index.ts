import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

type SupabaseClient = ReturnType<typeof createClient>;

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, unknown>;
  user_id: string;
}

interface RequestBody {
  type: "push" | "email";
  payload: PushPayload;
}

const initClient = (): SupabaseClient => {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !key) {
    throw new Error("Missing Supabase configuration");
  }

  return createClient(url, key, { auth: { persistSession: false } });
};

const storeNotification = async (supabase: SupabaseClient, payload: PushPayload) => {
  const { error } = await supabase.from("notification_outbox").insert({
    user_id: payload.user_id,
    payload,
    status: "pending",
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[notifications] failed to store notification", error);
    throw error;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = initClient();
    const body = (await req.json()) as RequestBody;

    if (body.type === "push") {
      await storeNotification(supabase, body.payload);
    }

    return new Response(JSON.stringify({ status: "queued" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[notifications] unexpected failure", error);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
