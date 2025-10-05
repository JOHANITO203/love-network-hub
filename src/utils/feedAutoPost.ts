import { SupabaseClient } from "@supabase/supabase-js";

interface AutoPostConfig {
  matchId: string;
  type: "MATCH_CONFIRMED" | "REL_STATUS_UPDATE" | "BADGE_UNLOCKED";
  payload: Record<string, unknown>;
  visibility?: "public" | "friends" | "private";
  lang?: string;
}

/**
 * Creates an auto-post in feed_posts table for reality-show events
 * @param supabase - Supabase client instance
 * @param config - Post configuration
 * @returns Promise with post data or error
 */
export const createFeedAutoPost = async (
  supabase: SupabaseClient,
  config: AutoPostConfig
) => {
  const { matchId, type, payload, visibility = "public", lang = "fr" } = config;

  try {
    // Check if post already exists for this match/type combination
    if (type === "MATCH_CONFIRMED") {
      const { data: existing } = await supabase
        .from("feed_posts")
        .select("id")
        .eq("match_id", matchId)
        .eq("type", type)
        .single();

      if (existing) {

        return { data: existing, error: null };
      }
    }

    // For REL_STATUS_UPDATE, check if post exists for this match + phase
    if (type === "REL_STATUS_UPDATE" && payload.phase) {
      const { data: existing } = await supabase
        .from("feed_posts")
        .select("id")
        .eq("match_id", matchId)
        .eq("type", type)
        .filter("payload->>phase", "eq", payload.phase)
        .single();

      if (existing) {

        return { data: existing, error: null };
      }
    }

    // Insert new post
    const { data, error } = await supabase
      .from("feed_posts")
      .insert({
        match_id: matchId,
        type,
        payload,
        visibility,
        lang,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create feed auto-post:", error);
      return { data: null, error };
    }


    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error in createFeedAutoPost:", err);
    return { data: null, error: err };
  }
};

/**
 * Creates a MATCH_CONFIRMED post when two users match
 * @param supabase - Supabase client
 * @param matchId - Match ID
 * @param flags - Optional flags (e.g., ['intercultural', 'first_match'])
 */
export const createMatchConfirmedPost = async (
  supabase: SupabaseClient,
  matchId: string,
  flags: string[] = []
) => {
  return createFeedAutoPost(supabase, {
    matchId,
    type: "MATCH_CONFIRMED",
    payload: { flags },
    visibility: "public",
  });
};

/**
 * Creates a REL_STATUS_UPDATE post for relationship milestones
 * @param supabase - Supabase client
 * @param matchId - Match ID
 * @param phase - Relationship phase (day3, day7, day14, day30)
 * @param status - Relationship status (e.g., 'official', 'confirmed', 'established')
 * @param concordanceScore - Optional concordance percentage
 */
export const createRelationshipStatusPost = async (
  supabase: SupabaseClient,
  matchId: string,
  phase: "day3" | "day7" | "day14" | "day30",
  status: string,
  concordanceScore?: number
) => {
  const payload: Record<string, unknown> = { phase, status };
  if (concordanceScore !== undefined) {
    payload.concordance_score = concordanceScore;
  }

  return createFeedAutoPost(supabase, {
    matchId,
    type: "REL_STATUS_UPDATE",
    payload,
    visibility: "public",
  });
};

/**
 * Creates a BADGE_UNLOCKED post when users unlock a badge
 * @param supabase - Supabase client
 * @param matchId - Match ID
 * @param badgeCode - Badge code (e.g., 'first_match', 'intercultural_pioneer')
 * @param badgeName - Human-readable badge name
 */
export const createBadgeUnlockedPost = async (
  supabase: SupabaseClient,
  matchId: string,
  badgeCode: string,
  badgeName: string
) => {
  return createFeedAutoPost(supabase, {
    matchId,
    type: "BADGE_UNLOCKED",
    payload: {
      badge_code: badgeCode,
      badge_name: badgeName,
    },
    visibility: "public",
  });
};
