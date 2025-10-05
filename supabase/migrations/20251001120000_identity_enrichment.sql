-- Identity enrichment for matching and storytelling
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS origin_country_code text,
  ADD COLUMN IF NOT EXISTS is_diaspora boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS premium_tier text DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS abbrev_name text;

UPDATE public.profiles
SET premium_tier = COALESCE(premium_tier, 'free');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND constraint_name = 'profiles_premium_tier_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_premium_tier_check
      CHECK (premium_tier IN ('free','plus','pro','vip'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.compute_profile_abbrev_name()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.first_name IS NULL OR length(trim(NEW.first_name)) = 0 THEN
    NEW.abbrev_name := NULL;
  ELSE
    NEW.abbrev_name := upper(left(trim(NEW.first_name), 1)) || '.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_abbrev_name ON public.profiles;
CREATE TRIGGER profiles_set_abbrev_name
  BEFORE INSERT OR UPDATE OF first_name
  ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.compute_profile_abbrev_name();

UPDATE public.profiles
SET abbrev_name = upper(left(trim(first_name), 1)) || '.'
WHERE first_name IS NOT NULL AND length(trim(first_name)) > 0;

ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS is_intercultural boolean DEFAULT false;

CREATE OR REPLACE FUNCTION public.compute_match_intercultural(user_a uuid, user_b uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  profile_a RECORD;
  profile_b RECORD;
  origin_a text;
  origin_b text;
BEGIN
  SELECT
    is_diaspora,
    origin_country_code,
    location_country
  INTO profile_a
  FROM public.profiles
  WHERE user_id = user_a;

  SELECT
    is_diaspora,
    origin_country_code,
    location_country
  INTO profile_b
  FROM public.profiles
  WHERE user_id = user_b;

  origin_a := COALESCE(profile_a.origin_country_code, profile_a.location_country);
  origin_b := COALESCE(profile_b.origin_country_code, profile_b.location_country);

  RETURN
    (profile_a.is_diaspora IS DISTINCT FROM profile_b.is_diaspora)
    OR (
      origin_a IS NOT NULL
      AND origin_b IS NOT NULL
      AND origin_a <> origin_b
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.set_match_intercultural()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.is_intercultural := public.compute_match_intercultural(NEW.user1_id, NEW.user2_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS matches_set_intercultural ON public.matches;
CREATE TRIGGER matches_set_intercultural
  BEFORE INSERT OR UPDATE OF user1_id, user2_id
  ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.set_match_intercultural();

UPDATE public.matches
SET is_intercultural = public.compute_match_intercultural(user1_id, user2_id);

CREATE INDEX IF NOT EXISTS idx_profiles_is_diaspora ON public.profiles(is_diaspora);
CREATE INDEX IF NOT EXISTS idx_profiles_origin_country ON public.profiles(origin_country_code);
