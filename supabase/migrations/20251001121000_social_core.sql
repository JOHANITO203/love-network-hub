-- Core social tables for questionnaires, feed, badges, keyword detection, feature flags
CREATE TABLE IF NOT EXISTS public.feed_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES public.matches(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('MATCH_CONFIRMED','REL_STATUS_UPDATE','BADGE_UNLOCKED')),
  payload jsonb NOT NULL,
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','private','followers')),
  lang text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feed_posts_created_at ON public.feed_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_posts_type ON public.feed_posts(type);

CREATE TABLE IF NOT EXISTS public.relationship_status (
  match_id uuid PRIMARY KEY REFERENCES public.matches(id) ON DELETE CASCADE,
  phase text NOT NULL DEFAULT 'day3' CHECK (phase IN ('day3','day7','day14','day30')),
  a_status text,
  b_status text,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  public_opt_in boolean NOT NULL DEFAULT false,
  next_survey_at timestamptz,
  audit jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.touch_relationship_status()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS relationship_status_touch ON public.relationship_status;
CREATE TRIGGER relationship_status_touch
  BEFORE UPDATE ON public.relationship_status
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_relationship_status();

CREATE TABLE IF NOT EXISTS public.questionnaire_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase text NOT NULL CHECK (phase IN ('day3','day7','day14','day30')),
  lang text NOT NULL CHECK (lang IN ('fr','pt','en','ru')),
  text text NOT NULL,
  options text[] NOT NULL,
  version integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questionnaire_phase_lang ON public.questionnaire_catalog(phase, lang, active);

CREATE OR REPLACE FUNCTION public.touch_questionnaire_catalog()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS questionnaire_catalog_touch ON public.questionnaire_catalog;
CREATE TRIGGER questionnaire_catalog_touch
  BEFORE UPDATE ON public.questionnaire_catalog
  FOR EACH ROW EXECUTE FUNCTION public.touch_questionnaire_catalog();

CREATE TABLE IF NOT EXISTS public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  icon text NOT NULL,
  rules jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked_at ON public.user_badges(unlocked_at DESC);

CREATE TABLE IF NOT EXISTS public.keyword_lexicon (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('messaging','phone','handle','meeting')),
  lang text NOT NULL CHECK (lang IN ('fr','pt','en','ru')),
  variant text NOT NULL,
  severity_score integer NOT NULL CHECK (severity_score BETWEEN 1 AND 100),
  pattern text NOT NULL,
  fuzzy_key text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_keyword_lexicon_lang_category ON public.keyword_lexicon(lang, category);
CREATE INDEX IF NOT EXISTS idx_keyword_lexicon_variant ON public.keyword_lexicon(variant);

CREATE TABLE IF NOT EXISTS public.feature_flags (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.touch_feature_flags()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS feature_flags_touch ON public.feature_flags;
CREATE TRIGGER feature_flags_touch
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW EXECUTE FUNCTION public.touch_feature_flags();

-- seed defaults for feature flags
INSERT INTO public.feature_flags(key, value)
VALUES
  ('swipe.intercultural_ratio', '{"value": 0.55}'::jsonb),
  ('safety.disclaimer_interval_hours', '{"value": 24}'::jsonb),
  ('scheduler.cadence_minutes', '{"value": 5}'::jsonb)
ON CONFLICT (key) DO NOTHING;
