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

    const { productId, provider, userId } = body ?? {};
    if (!productId || !provider || !userId) {
      return badRequest("missing_parameters");
    }

    const { data: product, error: productError } = await supabase
      .from("premium_products")
      .select("id, amount, currency, name, benefits")
      .eq("id", productId)
      .maybeSingle();

    if (productError || !product) {
      throw productError ?? new Error("Unknown product");
    }

    const orderId = crypto.randomUUID();
    const paymentUrl = `https://pay.mock/${provider}/${orderId}`;

    const { error: orderError } = await supabase.from("premium_orders").insert({
      id: orderId,
      user_id: userId,
      product_id: productId,
      provider,
      amount: product.amount,
      currency: product.currency,
      status: "pending",
      created_at: new Date().toISOString(),
      payload: { paymentUrl },
    });

    if (orderError) {
      throw orderError;
    }

    return ok({ orderId, paymentUrl });
  } catch (error) {
    console.error("[payments] failure", error);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
