-- ============================================================================
-- ADVANCED FILTERS SYSTEM FOR МОЙDATE
-- ============================================================================

-- 1. EXPAND USER_PREFERENCES TABLE WITH ADVANCED FILTERS
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS education_level text[],
ADD COLUMN IF NOT EXISTS profession_category text[],
ADD COLUMN IF NOT EXISTS income_range text,
ADD COLUMN IF NOT EXISTS relationship_type text[] DEFAULT ARRAY['serious', 'casual'],
ADD COLUMN IF NOT EXISTS lifestyle_smoking text DEFAULT 'no_preference' CHECK (lifestyle_smoking IN ('never', 'sometimes', 'regularly', 'no_preference')),
ADD COLUMN IF NOT EXISTS lifestyle_drinking text DEFAULT 'no_preference' CHECK (lifestyle_drinking IN ('never', 'socially', 'regularly', 'no_preference')),
ADD COLUMN IF NOT EXISTS lifestyle_exercise text DEFAULT 'no_preference' CHECK (lifestyle_exercise IN ('never', 'sometimes', 'regularly', 'daily', 'no_preference')),
ADD COLUMN IF NOT EXISTS lifestyle_diet text DEFAULT 'no_preference' CHECK (lifestyle_diet IN ('omnivore', 'vegetarian', 'vegan', 'pescatarian', 'no_preference')),
ADD COLUMN IF NOT EXISTS family_plans text DEFAULT 'no_preference' CHECK (family_plans IN ('want_children', 'have_children', 'no_children', 'no_preference')),
ADD COLUMN IF NOT EXISTS pets text DEFAULT 'no_preference' CHECK (pets IN ('love_pets', 'have_pets', 'allergic', 'no_preference')),
ADD COLUMN IF NOT EXISTS religion text DEFAULT 'no_preference',
ADD COLUMN IF NOT EXISTS languages text[],
ADD COLUMN IF NOT EXISTS height_range_min integer, -- in cm
ADD COLUMN IF NOT EXISTS height_range_max integer, -- in cm
ADD COLUMN IF NOT EXISTS last_active_within interval DEFAULT '30 days',
ADD COLUMN IF NOT EXISTS verified_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS with_photos_only boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS dealbreakers text[]; -- Array of absolute dealbreakers

-- 2. EXPAND PROFILES TABLE WITH LIFESTYLE AND DETAILED INFO
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS education_level text,
ADD COLUMN IF NOT EXISTS profession_category text,
ADD COLUMN IF NOT EXISTS income_range text,
ADD COLUMN IF NOT EXISTS height integer, -- in cm
ADD COLUMN IF NOT EXISTS body_type text,
ADD COLUMN IF NOT EXISTS ethnicity text,
ADD COLUMN IF NOT EXISTS religion text,
ADD COLUMN IF NOT EXISTS languages text[] DEFAULT ARRAY['français'],
ADD COLUMN IF NOT EXISTS relationship_type text[] DEFAULT ARRAY['serious'],
ADD COLUMN IF NOT EXISTS lifestyle_smoking text DEFAULT 'never' CHECK (lifestyle_smoking IN ('never', 'sometimes', 'regularly')),
ADD COLUMN IF NOT EXISTS lifestyle_drinking text DEFAULT 'socially' CHECK (lifestyle_drinking IN ('never', 'socially', 'regularly')),
ADD COLUMN IF NOT EXISTS lifestyle_exercise text DEFAULT 'sometimes' CHECK (lifestyle_exercise IN ('never', 'sometimes', 'regularly', 'daily')),
ADD COLUMN IF NOT EXISTS lifestyle_diet text DEFAULT 'omnivore' CHECK (lifestyle_diet IN ('omnivore', 'vegetarian', 'vegan', 'pescatarian')),
ADD COLUMN IF NOT EXISTS family_plans text DEFAULT 'no_preference' CHECK (family_plans IN ('want_children', 'have_children', 'no_children', 'no_preference')),
ADD COLUMN IF NOT EXISTS pets text DEFAULT 'no_preference' CHECK (pets IN ('love_pets', 'have_pets', 'allergic', 'no_preference')),
ADD COLUMN IF NOT EXISTS personality_traits text[], -- Array of personality traits
ADD COLUMN IF NOT EXISTS hobbies text[], -- Different from interests, more specific activities
ADD COLUMN IF NOT EXISTS travel_frequency text DEFAULT 'sometimes' CHECK (travel_frequency IN ('never', 'rarely', 'sometimes', 'often', 'constantly')),
ADD COLUMN IF NOT EXISTS social_life text DEFAULT 'balanced' CHECK (social_life IN ('homebody', 'balanced', 'social_butterfly')),
ADD COLUMN IF NOT EXISTS communication_style text DEFAULT 'balanced' CHECK (communication_style IN ('introvert', 'balanced', 'extrovert')),
ADD COLUMN IF NOT EXISTS profile_completion_score integer DEFAULT 0; -- Calculated field for matching quality

-- 3. CREATE EDUCATION LEVELS ENUM TABLE
CREATE TABLE public.education_levels (
  id text PRIMARY KEY,
  name text NOT NULL,
  sort_order integer NOT NULL,
  description text
);

INSERT INTO public.education_levels (id, name, sort_order, description) VALUES
('high_school', 'Baccalauréat', 1, 'Niveau lycée terminé'),
('some_college', 'Études supérieures (en cours)', 2, 'Études supérieures non terminées'),
('bachelor', 'Licence/Bachelor', 3, 'Diplôme de premier cycle universitaire'),
('master', 'Master', 4, 'Diplôme de deuxième cycle universitaire'),
('doctorate', 'Doctorat', 5, 'Diplôme de troisième cycle universitaire'),
('trade_school', 'Formation professionnelle', 6, 'École de métiers ou formation technique'),
('other', 'Autre', 7, 'Autre type d''éducation');

-- 4. CREATE PROFESSION CATEGORIES TABLE
CREATE TABLE public.profession_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  sort_order integer NOT NULL,
  description text
);

INSERT INTO public.profession_categories (id, name, sort_order, description) VALUES
('technology', 'Technologie', 1, 'Informatique, développement, IA, etc.'),
('healthcare', 'Santé', 2, 'Médecine, soins infirmiers, pharmacie, etc.'),
('education', 'Éducation', 3, 'Enseignement, formation, recherche'),
('business', 'Business', 4, 'Commerce, management, entrepreneuriat'),
('finance', 'Finance', 5, 'Banque, assurance, comptabilité'),
('creative', 'Créatif', 6, 'Art, design, média, divertissement'),
('legal', 'Juridique', 7, 'Droit, justice, conseil juridique'),
('engineering', 'Ingénierie', 8, 'Ingénierie, architecture, construction'),
('science', 'Sciences', 9, 'Recherche scientifique, laboratoire'),
('hospitality', 'Hôtellerie', 10, 'Restauration, tourisme, hôtellerie'),
('retail', 'Commerce de détail', 11, 'Vente, service client'),
('government', 'Fonction publique', 12, 'Administration, services publics'),
('nonprofit', 'Associatif', 13, 'ONG, charité, services sociaux'),
('sports', 'Sport', 14, 'Sport, fitness, coaching'),
('transportation', 'Transport', 15, 'Logistique, transport, livraison'),
('other', 'Autre', 16, 'Autre profession');

-- 5. CREATE PERSONALITY TRAITS TABLE
CREATE TABLE public.personality_traits (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  sort_order integer NOT NULL
);

INSERT INTO public.personality_traits (id, name, category, description, sort_order) VALUES
-- Social traits
('outgoing', 'Extraverti', 'social', 'Aime socialiser et rencontrer du monde', 1),
('introverted', 'Introverti', 'social', 'Préfère les petits groupes et la solitude', 2),
('funny', 'Drôle', 'social', 'Sens de l''humour développé', 3),
('shy', 'Timide', 'social', 'Réservé dans les interactions sociales', 4),
('confident', 'Confiant', 'social', 'Sûr de soi et assertif', 5),

-- Lifestyle traits
('adventurous', 'Aventureux', 'lifestyle', 'Aime explorer et essayer de nouvelles choses', 10),
('homebody', 'Casanier', 'lifestyle', 'Préfère rester à la maison', 11),
('active', 'Actif', 'lifestyle', 'Toujours en mouvement, sportif', 12),
('laid_back', 'Décontracté', 'lifestyle', 'Prend la vie du bon côté', 13),
('organized', 'Organisé', 'lifestyle', 'Méthodique et planificateur', 14),
('spontaneous', 'Spontané', 'lifestyle', 'Impulsif et flexible', 15),

-- Values traits
('family_oriented', 'Axé famille', 'values', 'La famille est prioritaire', 20),
('career_focused', 'Axé carrière', 'values', 'Ambitieux professionnellement', 21),
('spiritual', 'Spirituel', 'values', 'Pratique religieuse ou spirituelle', 22),
('environmentalist', 'Écologiste', 'values', 'Soucieux de l''environnement', 23),
('artistic', 'Artistique', 'values', 'Créatif et sensible à l''art', 24),
('intellectual', 'Intellectuel', 'values', 'Aime apprendre et débattre', 25);

-- 6. CREATE FUNCTION TO CALCULATE PROFILE COMPLETION SCORE
CREATE OR REPLACE FUNCTION public.calculate_profile_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  score integer := 0;
BEGIN
  -- Basic info (40 points max)
  IF NEW.first_name IS NOT NULL AND length(NEW.first_name) > 0 THEN score := score + 5; END IF;
  IF NEW.last_name IS NOT NULL AND length(NEW.last_name) > 0 THEN score := score + 5; END IF;
  IF NEW.age IS NOT NULL THEN score := score + 5; END IF;
  IF NEW.bio IS NOT NULL AND length(NEW.bio) >= 50 THEN score := score + 10; END IF;
  IF NEW.location IS NOT NULL AND length(NEW.location) > 0 THEN score := score + 5; END IF;
  IF NEW.profession IS NOT NULL AND length(NEW.profession) > 0 THEN score := score + 5; END IF;
  IF NEW.photo_count IS NOT NULL AND NEW.photo_count >= 3 THEN score := score + 5; END IF;

  -- Lifestyle info (30 points max)
  IF NEW.education_level IS NOT NULL THEN score := score + 3; END IF;
  IF NEW.profession_category IS NOT NULL THEN score := score + 3; END IF;
  IF NEW.height IS NOT NULL THEN score := score + 2; END IF;
  IF NEW.lifestyle_smoking IS NOT NULL THEN score := score + 2; END IF;
  IF NEW.lifestyle_drinking IS NOT NULL THEN score := score + 2; END IF;
  IF NEW.lifestyle_exercise IS NOT NULL THEN score := score + 2; END IF;
  IF NEW.lifestyle_diet IS NOT NULL THEN score := score + 2; END IF;
  IF NEW.family_plans IS NOT NULL THEN score := score + 3; END IF;
  IF NEW.pets IS NOT NULL THEN score := score + 2; END IF;
  IF NEW.religion IS NOT NULL THEN score := score + 2; END IF;
  IF NEW.languages IS NOT NULL AND array_length(NEW.languages, 1) > 1 THEN score := score + 3; END IF;
  IF NEW.relationship_type IS NOT NULL AND array_length(NEW.relationship_type, 1) > 0 THEN score := score + 2; END IF;

  -- Interests and personality (30 points max)
  IF NEW.interests IS NOT NULL AND array_length(NEW.interests, 1) >= 3 THEN score := score + 10; END IF;
  IF NEW.personality_traits IS NOT NULL AND array_length(NEW.personality_traits, 1) >= 3 THEN score := score + 10; END IF;
  IF NEW.hobbies IS NOT NULL AND array_length(NEW.hobbies, 1) >= 2 THEN score := score + 5; END IF;
  IF NEW.travel_frequency IS NOT NULL THEN score := score + 2; END IF;
  IF NEW.social_life IS NOT NULL THEN score := score + 2; END IF;
  IF NEW.communication_style IS NOT NULL THEN score := score + 1; END IF;

  NEW.profile_completion_score := LEAST(score, 100); -- Cap at 100%
  RETURN NEW;
END;
$$;

-- Create trigger for profile completion calculation
CREATE TRIGGER calculate_profile_completion_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_profile_completion();

-- 7. CREATE ADVANCED MATCHING FUNCTION WITH FILTERS
CREATE OR REPLACE FUNCTION public.get_filtered_matches(
  limit_count integer DEFAULT 20,
  apply_strict_filters boolean DEFAULT true
)
RETURNS TABLE (
  profile_id uuid,
  user_id uuid,
  first_name text,
  last_name text,
  age integer,
  bio text,
  location text,
  profession text,
  education_level text,
  lifestyle_smoking text,
  lifestyle_drinking text,
  lifestyle_exercise text,
  height integer,
  astrological_sign text,
  interests text[],
  personality_traits text[],
  profile_images text[],
  distance_km decimal,
  compatibility_score numeric,
  filter_match_score numeric,
  profile_completion_score integer,
  last_active timestamp with time zone,
  is_verified boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_lat decimal;
  user_lng decimal;
  user_prefs record;
  user_profile record;
BEGIN
  -- Get current user's location, preferences, and profile
  SELECT
    p.latitude, p.longitude,
    p.age as user_age, p.interests as user_interests, p.personality_traits as user_personality
  INTO user_lat, user_lng, user_profile
  FROM public.profiles p
  WHERE p.user_id = auth.uid();

  -- Get user preferences
  SELECT * INTO user_prefs
  FROM public.user_preferences
  WHERE user_id = auth.uid();

  -- If no preferences found, use defaults
  IF NOT FOUND THEN
    user_prefs := ROW(
      auth.uid(), 18, 50, 50, ARRAY['all']::text[], true, true, -- basic preferences
      NULL, NULL, NULL, ARRAY['serious', 'casual']::text[], -- advanced filters
      'no_preference', 'no_preference', 'no_preference', 'no_preference',
      'no_preference', 'no_preference', NULL, NULL::text[],
      NULL, NULL, '30 days'::interval, false, true, NULL::text[]
    );
  END IF;

  RETURN QUERY
  SELECT
    p.id as profile_id,
    p.user_id,
    p.first_name,
    p.last_name,
    p.age,
    p.bio,
    COALESCE(p.location_city, p.location) as location,
    p.profession,
    p.education_level,
    p.lifestyle_smoking,
    p.lifestyle_drinking,
    p.lifestyle_exercise,
    p.height,
    p.astrological_sign,
    p.interests,
    p.personality_traits,
    p.profile_images,
    -- Distance calculation
    CASE
      WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
      THEN public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude)
      ELSE NULL
    END as distance_km,
    -- Enhanced compatibility score
    COALESCE(
      (
        -- Age compatibility (25%)
        CASE
          WHEN p.age BETWEEN user_prefs.min_age AND user_prefs.max_age
          THEN 25
          ELSE GREATEST(0, 25 - ABS(p.age - (user_prefs.min_age + user_prefs.max_age) / 2) * 2)
        END +
        -- Interest compatibility (20%)
        CASE
          WHEN p.interests IS NOT NULL AND user_profile.user_interests IS NOT NULL
          THEN LEAST(20, (
            SELECT COUNT(*) * 20 / GREATEST(1, array_length(p.interests, 1))
            FROM unnest(p.interests) AS interest
            WHERE interest = ANY(user_profile.user_interests)
          ))
          ELSE 0
        END +
        -- Personality compatibility (15%)
        CASE
          WHEN p.personality_traits IS NOT NULL AND user_profile.user_personality IS NOT NULL
          THEN LEAST(15, (
            SELECT COUNT(*) * 15 / GREATEST(1, array_length(p.personality_traits, 1))
            FROM unnest(p.personality_traits) AS trait
            WHERE trait = ANY(user_profile.user_personality)
          ))
          ELSE 0
        END +
        -- Distance compatibility (15%)
        CASE
          WHEN user_lat IS NOT NULL AND p.latitude IS NOT NULL
          THEN CASE
            WHEN public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 5 THEN 15
            WHEN public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 15 THEN 12
            WHEN public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 30 THEN 8
            WHEN public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 50 THEN 5
            ELSE 0
          END
          ELSE 5 -- Default if no location
        END +
        -- Profile completion bonus (10%)
        LEAST(10, p.profile_completion_score / 10) +
        -- Activity bonus (5%)
        CASE
          WHEN p.last_active > now() - interval '1 day' THEN 5
          WHEN p.last_active > now() - interval '7 days' THEN 3
          WHEN p.last_active > now() - interval '30 days' THEN 1
          ELSE 0
        END +
        -- Verification bonus (5%)
        CASE WHEN p.is_verified = true THEN 5 ELSE 0 END +
        -- Photo bonus (5%)
        CASE
          WHEN p.photo_count >= 3 THEN 5
          WHEN p.photo_count >= 1 THEN 3
          ELSE 0
        END
      )::numeric,
      0
    ) as compatibility_score,
    -- Filter match score (how well profile matches user's filters)
    COALESCE(
      (
        -- Education filter match
        CASE
          WHEN user_prefs.education_level IS NULL OR array_length(user_prefs.education_level, 1) = 0
          THEN 10
          WHEN p.education_level = ANY(user_prefs.education_level)
          THEN 10
          ELSE 0
        END +
        -- Profession filter match
        CASE
          WHEN user_prefs.profession_category IS NULL OR array_length(user_prefs.profession_category, 1) = 0
          THEN 10
          WHEN p.profession_category = ANY(user_prefs.profession_category)
          THEN 10
          ELSE 0
        END +
        -- Height filter match
        CASE
          WHEN user_prefs.height_range_min IS NULL OR user_prefs.height_range_max IS NULL
          THEN 10
          WHEN p.height IS NULL
          THEN 5
          WHEN p.height BETWEEN user_prefs.height_range_min AND user_prefs.height_range_max
          THEN 10
          ELSE 0
        END +
        -- Lifestyle filters (smoking, drinking, exercise, diet)
        CASE
          WHEN user_prefs.lifestyle_smoking = 'no_preference' OR p.lifestyle_smoking = user_prefs.lifestyle_smoking
          THEN 10
          ELSE 0
        END +
        CASE
          WHEN user_prefs.lifestyle_drinking = 'no_preference' OR p.lifestyle_drinking = user_prefs.lifestyle_drinking
          THEN 10
          ELSE 0
        END +
        CASE
          WHEN user_prefs.lifestyle_exercise = 'no_preference' OR p.lifestyle_exercise = user_prefs.lifestyle_exercise
          THEN 10
          ELSE 0
        END +
        CASE
          WHEN user_prefs.lifestyle_diet = 'no_preference' OR p.lifestyle_diet = user_prefs.lifestyle_diet
          THEN 10
          ELSE 0
        END +
        -- Family plans match
        CASE
          WHEN user_prefs.family_plans = 'no_preference' OR p.family_plans = user_prefs.family_plans
          THEN 10
          ELSE 0
        END +
        -- Pets match
        CASE
          WHEN user_prefs.pets = 'no_preference' OR p.pets = user_prefs.pets
          THEN 10
          ELSE 0
        END +
        -- Language match
        CASE
          WHEN user_prefs.languages IS NULL OR array_length(user_prefs.languages, 1) = 0
          THEN 10
          WHEN p.languages && user_prefs.languages -- Arrays have common elements
          THEN 10
          ELSE 0
        END
      )::numeric / 10, -- Convert to 0-10 scale
      0
    ) as filter_match_score,
    p.profile_completion_score,
    p.last_active,
    p.is_verified
  FROM public.profiles p
  WHERE
    -- Basic exclusions
    p.user_id != auth.uid()
    AND p.is_banned = false
    AND p.profile_visibility = 'public'
    AND p.last_active > now() - COALESCE(user_prefs.last_active_within, '30 days'::interval)

    -- Photo requirements
    AND (NOT user_prefs.with_photos_only OR p.photo_count > 0)

    -- Verification requirements
    AND (NOT user_prefs.verified_only OR p.is_verified = true)

    -- Distance filter
    AND (
      user_lat IS NULL OR p.latitude IS NULL OR
      public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= user_prefs.max_distance_km
    )

    -- Age filter
    AND p.age BETWEEN user_prefs.min_age AND user_prefs.max_age

    -- Strict filters (only apply if apply_strict_filters is true)
    AND (
      NOT apply_strict_filters OR (
        -- Education filter
        (user_prefs.education_level IS NULL OR array_length(user_prefs.education_level, 1) = 0 OR
         p.education_level = ANY(user_prefs.education_level)) AND

        -- Profession filter
        (user_prefs.profession_category IS NULL OR array_length(user_prefs.profession_category, 1) = 0 OR
         p.profession_category = ANY(user_prefs.profession_category)) AND

        -- Height filter
        (user_prefs.height_range_min IS NULL OR user_prefs.height_range_max IS NULL OR p.height IS NULL OR
         p.height BETWEEN user_prefs.height_range_min AND user_prefs.height_range_max) AND

        -- Lifestyle filters
        (user_prefs.lifestyle_smoking = 'no_preference' OR p.lifestyle_smoking = user_prefs.lifestyle_smoking) AND
        (user_prefs.lifestyle_drinking = 'no_preference' OR p.lifestyle_drinking = user_prefs.lifestyle_drinking) AND
        (user_prefs.lifestyle_exercise = 'no_preference' OR p.lifestyle_exercise = user_prefs.lifestyle_exercise) AND
        (user_prefs.lifestyle_diet = 'no_preference' OR p.lifestyle_diet = user_prefs.lifestyle_diet) AND
        (user_prefs.family_plans = 'no_preference' OR p.family_plans = user_prefs.family_plans) AND
        (user_prefs.pets = 'no_preference' OR p.pets = user_prefs.pets) AND

        -- Language filter
        (user_prefs.languages IS NULL OR array_length(user_prefs.languages, 1) = 0 OR
         p.languages && user_prefs.languages)
      )
    )

    -- Exclusions (blocked users, already interacted with)
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users bu
      WHERE (bu.blocker_id = auth.uid() AND bu.blocked_id = p.user_id)
      OR (bu.blocker_id = p.user_id AND bu.blocked_id = auth.uid())
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.user_interactions ui
      WHERE ui.from_user_id = auth.uid() AND ui.to_user_id = p.user_id
    )
    AND EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = p.user_id AND u.deleted_at IS NULL
    )

  ORDER BY
    compatibility_score DESC,
    filter_match_score DESC,
    profile_completion_score DESC,
    distance_km ASC NULLS LAST,
    random()
  LIMIT limit_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_filtered_matches TO authenticated;

-- 8. CREATE FUNCTION TO UPDATE USER FILTERS
CREATE OR REPLACE FUNCTION public.update_user_filters(
  filters jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_filters text[] := ARRAY[
    'education_level', 'profession_category', 'income_range', 'relationship_type',
    'lifestyle_smoking', 'lifestyle_drinking', 'lifestyle_exercise', 'lifestyle_diet',
    'family_plans', 'pets', 'religion', 'languages', 'height_range_min', 'height_range_max',
    'last_active_within', 'verified_only', 'with_photos_only', 'dealbreakers',
    'min_age', 'max_age', 'max_distance_km'
  ];
  filter_key text;
BEGIN
  -- Validate that only allowed filters are being updated
  FOR filter_key IN SELECT jsonb_object_keys(filters)
  LOOP
    IF NOT (filter_key = ANY(allowed_filters)) THEN
      RAISE EXCEPTION 'Invalid filter key: %', filter_key;
    END IF;
  END LOOP;

  -- Update or insert user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO NOTHING;

  -- Apply the filters using dynamic SQL (more secure than concatenation)
  UPDATE public.user_preferences
  SET
    education_level = CASE WHEN filters ? 'education_level' THEN
      ARRAY(SELECT jsonb_array_elements_text(filters->'education_level')) ELSE education_level END,
    profession_category = CASE WHEN filters ? 'profession_category' THEN
      ARRAY(SELECT jsonb_array_elements_text(filters->'profession_category')) ELSE profession_category END,
    income_range = COALESCE(filters->>'income_range', income_range),
    relationship_type = CASE WHEN filters ? 'relationship_type' THEN
      ARRAY(SELECT jsonb_array_elements_text(filters->'relationship_type')) ELSE relationship_type END,
    lifestyle_smoking = COALESCE(filters->>'lifestyle_smoking', lifestyle_smoking),
    lifestyle_drinking = COALESCE(filters->>'lifestyle_drinking', lifestyle_drinking),
    lifestyle_exercise = COALESCE(filters->>'lifestyle_exercise', lifestyle_exercise),
    lifestyle_diet = COALESCE(filters->>'lifestyle_diet', lifestyle_diet),
    family_plans = COALESCE(filters->>'family_plans', family_plans),
    pets = COALESCE(filters->>'pets', pets),
    religion = COALESCE(filters->>'religion', religion),
    languages = CASE WHEN filters ? 'languages' THEN
      ARRAY(SELECT jsonb_array_elements_text(filters->'languages')) ELSE languages END,
    height_range_min = COALESCE((filters->>'height_range_min')::integer, height_range_min),
    height_range_max = COALESCE((filters->>'height_range_max')::integer, height_range_max),
    last_active_within = COALESCE((filters->>'last_active_within')::interval, last_active_within),
    verified_only = COALESCE((filters->>'verified_only')::boolean, verified_only),
    with_photos_only = COALESCE((filters->>'with_photos_only')::boolean, with_photos_only),
    dealbreakers = CASE WHEN filters ? 'dealbreakers' THEN
      ARRAY(SELECT jsonb_array_elements_text(filters->'dealbreakers')) ELSE dealbreakers END,
    min_age = COALESCE((filters->>'min_age')::integer, min_age),
    max_age = COALESCE((filters->>'max_age')::integer, max_age),
    max_distance_km = COALESCE((filters->>'max_distance_km')::integer, max_distance_km),
    updated_at = now()
  WHERE user_id = auth.uid();

  RETURN true;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_user_filters TO authenticated;

-- 9. CREATE VIEW FOR FILTER OPTIONS
CREATE OR REPLACE VIEW public.filter_options AS
SELECT
  'education_levels' as category,
  jsonb_agg(
    jsonb_build_object(
      'id', id,
      'name', name,
      'description', description
    ) ORDER BY sort_order
  ) as options
FROM public.education_levels
UNION ALL
SELECT
  'profession_categories' as category,
  jsonb_agg(
    jsonb_build_object(
      'id', id,
      'name', name,
      'description', description
    ) ORDER BY sort_order
  ) as options
FROM public.profession_categories
UNION ALL
SELECT
  'personality_traits' as category,
  jsonb_agg(
    jsonb_build_object(
      'id', id,
      'name', name,
      'category', category,
      'description', description
    ) ORDER BY category, sort_order
  ) as options
FROM public.personality_traits;

-- Grant access to the view
GRANT SELECT ON public.filter_options TO authenticated;

COMMENT ON MIGRATION IS 'Advanced filtering system with lifestyle preferences, education, profession, and personality-based matching for МойDate';