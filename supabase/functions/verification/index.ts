import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

const initClient = () => {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("Missing Supabase configuration");
  }

  return createClient(url, key, { auth: { persistSession: false } });
};

const ok = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

const badRequest = (message: string) =>
  new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

const serverError = (details: unknown) => {
  console.error("[verification] failure", details);
  return new Response(JSON.stringify({ error: "internal_error" }), {
    status: 500,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
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
    return badRequest("method_not_allowed");
  }

  try {
    const supabase = initClient();
    const body = await req.json();
    const userId = body?.user_id as string | undefined;

    if (!userId) {
      return badRequest("missing_user_id");
    }

    const verificationId = crypto.randomUUID();
    const mockUrl = `https://sumsub.com/verify?token=${verificationId}`;

    const { error } = await supabase.from("verification_requests").upsert({
      id: verificationId,
      user_id: userId,
      status: "pending",
      provider: "sumsub",
      created_at: new Date().toISOString(),
      payload: { mockUrl },
    });

    if (error) {
      throw error;
    }

    return ok({
      verificationId,
      url: mockUrl,
      status: "pending",
    });
  } catch (error) {
    return serverError(error);
  }
});
