import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type TranslationRequest = {
  text: string;
  target_language: string;
  source_language?: string | null;
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const buildPrompt = (text: string, target: string, source?: string | null) => {
  const base = `Translate the following message into ${target}. If the message is already in ${target}, return it unchanged. Preserve tone, emojis and formatting.`;
  const sourcePart = source ? ` The original language is ${source}.` : "";
  return `${base}${sourcePart}\n\nMessage: ${text}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing translation backend" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as TranslationRequest;
    const text = body.text?.trim();
    const target = body.target_language?.trim();

    if (!text || !target) {
      return new Response(JSON.stringify({ error: "Missing text or target language" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = buildPrompt(text, target, body.source_language);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a translation engine. Return only the translated text without additional commentary." },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI translation error", errorText);
      return new Response(JSON.stringify({ translated_text: text }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const completion = await response.json();
    const translatedText: string = completion.choices?.[0]?.message?.content?.trim() ?? text;

    return new Response(JSON.stringify({ translated_text: translatedText }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Translation function error", error);
    return new Response(JSON.stringify({ translated_text: null }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
