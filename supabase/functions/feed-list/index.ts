import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 50;

interface FeedItem {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  visibility: string;
  lang: string;
  created_at: string;
  match_id: string | null;
  is_intercultural: boolean | null;
  user1_id: string | null;
  user2_id: string | null;
  user1_abbrev: string | null;
  user2_abbrev: string | null;
  user1_country: string | null;
  user2_country: string | null;
}

const getSupabaseClient = () => {
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!url || !anonKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
};

const parseQuery = (url: URL) => {
  const limitParam = url.searchParams.get('limit');
  const cursor = url.searchParams.get('cursor');

  let limit = PAGE_SIZE_DEFAULT;
  if (limitParam) {
    const parsed = Number(limitParam);
    if (!Number.isNaN(parsed) && parsed > 0) {
      limit = Math.min(parsed, PAGE_SIZE_MAX);
    }
  }

  return { limit, cursor };
};

const decodeCursor = (cursor?: string | null) => {
  if (!cursor) return null;
  try {
    const decoded = JSON.parse(atob(cursor));
    if (decoded && decoded.created_at && decoded.id) {
      return decoded as { created_at: string; id: string };
    }
  } catch (_err) {
    console.warn('Invalid cursor provided');
  }
  return null;
};

const encodeCursor = (item: FeedItem) => {
  return btoa(JSON.stringify({ created_at: item.created_at, id: item.id }));
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { ...corsHeaders },
    });
  }

  try {
    const url = new URL(req.url);
    const { limit, cursor } = parseQuery(url);
    const supabase = getSupabaseClient();
    const cursorValue = decodeCursor(cursor);

    let query = supabase
      .from('feed_posts_enriched')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit);

    if (cursorValue) {
      query = query.lt('created_at', cursorValue.created_at);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to load feed', error);
      return new Response(JSON.stringify({ error: 'feed_fetch_failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const items = (data ?? []) as FeedItem[];
    const nextCursor = items.length === limit ? encodeCursor(items[items.length - 1]) : null;

    return new Response(
      JSON.stringify({
        items,
        nextCursor,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error) {
    console.error('Feed list handler failed', error);
    return new Response(JSON.stringify({ error: 'unexpected_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
