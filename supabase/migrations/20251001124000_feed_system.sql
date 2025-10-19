-- Feed system helpers: ensure location columns exist, unique indexes, and enriched view
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS location_country text,
  ADD COLUMN IF NOT EXISTS location_city text;

CREATE UNIQUE INDEX IF NOT EXISTS feed_posts_unique_match_confirmed
ON public.feed_posts(match_id)
WHERE type = 'MATCH_CONFIRMED';

CREATE UNIQUE INDEX IF NOT EXISTS feed_posts_unique_rel_phase
ON public.feed_posts(match_id, (payload->>'phase'))
WHERE type = 'REL_STATUS_UPDATE';

CREATE OR REPLACE VIEW public.feed_posts_enriched AS
SELECT
  fp.id,
  fp.type,
  fp.payload,
  fp.visibility,
  fp.lang,
  fp.created_at,
  fp.match_id,
  m.is_intercultural,
  m.user1_id,
  m.user2_id,
  p1.abbrev_name AS user1_abbrev,
  p2.abbrev_name AS user2_abbrev,
  COALESCE(p1.origin_country_code, p1.location_country) AS user1_country,
  COALESCE(p2.origin_country_code, p2.location_country) AS user2_country
FROM public.feed_posts fp
LEFT JOIN public.matches m ON m.id = fp.match_id
LEFT JOIN public.profiles p1 ON p1.user_id = m.user1_id
LEFT JOIN public.profiles p2 ON p2.user_id = m.user2_id;

GRANT SELECT ON public.feed_posts_enriched TO anon;
GRANT SELECT ON public.feed_posts_enriched TO authenticated;
