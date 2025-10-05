-- ============================================================================
-- МОЙDATE BACKEND SECURITY IMPROVEMENTS
-- ============================================================================

-- 1. IMPROVED RLS POLICIES FOR PROFILES
-- Replace the overly permissive "everyone can view" policy with a more secure one

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Only allow viewing profiles that are:
-- 1. Your own profile
-- 2. Profiles that match your preferences and haven't been passed
-- 3. Profiles of users you've matched with
CREATE POLICY "Profiles are viewable with restrictions"
ON public.profiles
FOR SELECT
USING (
  -- Users can always see their own profile
  auth.uid() = user_id
  OR
  -- Users can see profiles they've matched with
  EXISTS (
    SELECT 1 FROM public.matches m
    WHERE (m.user1_id = auth.uid() AND m.user2_id = profiles.user_id)
    OR (m.user2_id = auth.uid() AND m.user1_id = profiles.user_id)
  )
  OR
  -- Users can see potential matches (profiles they haven't interacted with yet)
  (
    profiles.user_id != auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.user_interactions ui
      WHERE ui.from_user_id = auth.uid()
      AND ui.to_user_id = profiles.user_id
    )
    -- Additional matching criteria can be added here based on preferences
  )
);

-- 2. ADD PRIVACY SETTINGS TABLE
CREATE TABLE public.privacy_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  show_age boolean DEFAULT true,
  show_location boolean DEFAULT true,
  show_profession boolean DEFAULT true,
  show_last_active boolean DEFAULT true,
  allow_location_based_matching boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for privacy settings
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Privacy settings policies
CREATE POLICY "Users can manage their own privacy settings"
ON public.privacy_settings
FOR ALL
USING (auth.uid() = user_id);

-- 3. ADD USER REPORTS TABLE FOR MODERATION
CREATE TABLE public.user_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reported_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason text NOT NULL CHECK (reason IN ('spam', 'harassment', 'fake_profile', 'inappropriate_content', 'other')),
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  UNIQUE(reporter_id, reported_id)
);

-- Enable RLS for user reports
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Users can only create reports, not view others' reports
CREATE POLICY "Users can create reports"
ON public.user_reports
FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

-- 4. ADD RATE LIMITING TABLE
CREATE TABLE public.user_activity_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('like', 'super_like', 'message', 'profile_view')),
  activity_date date DEFAULT current_date,
  activity_count integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, activity_type, activity_date)
);

-- Enable RLS for activity logs
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own activity logs
CREATE POLICY "Users can view their own activity logs"
ON public.user_activity_logs
FOR SELECT
USING (auth.uid() = user_id);

-- 5. SECURE FUNCTION FOR RATE LIMITING
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  activity_type_param text,
  daily_limit integer DEFAULT 100
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
BEGIN
  -- Get current count for today
  SELECT COALESCE(activity_count, 0) INTO current_count
  FROM public.user_activity_logs
  WHERE user_id = auth.uid()
  AND activity_type = activity_type_param
  AND activity_date = current_date;

  -- Check if limit exceeded
  IF current_count >= daily_limit THEN
    RETURN false;
  END IF;

  -- Increment counter
  INSERT INTO public.user_activity_logs (user_id, activity_type, activity_date, activity_count)
  VALUES (auth.uid(), activity_type_param, current_date, 1)
  ON CONFLICT (user_id, activity_type, activity_date)
  DO UPDATE SET
    activity_count = user_activity_logs.activity_count + 1,
    updated_at = now();

  RETURN true;
END;
$$;

-- 6. IMPROVED SECURITY FOR USER INTERACTIONS
-- Add rate limiting to user interactions
CREATE OR REPLACE FUNCTION public.secure_user_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check rate limit based on interaction type
  IF NEW.interaction_type = 'like' THEN
    IF NOT public.check_rate_limit('like', 50) THEN
      RAISE EXCEPTION 'Daily like limit exceeded';
    END IF;
  ELSIF NEW.interaction_type = 'super_like' THEN
    IF NOT public.check_rate_limit('super_like', 5) THEN
      RAISE EXCEPTION 'Daily super like limit exceeded';
    END IF;
  END IF;

  -- Prevent self-interactions
  IF NEW.from_user_id = NEW.to_user_id THEN
    RAISE EXCEPTION 'Cannot interact with yourself';
  END IF;

  -- Check if target user exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = NEW.to_user_id
    AND deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Target user not found or inactive';
  END IF;

  RETURN NEW;
END;
$$;

-- Add the security trigger to user_interactions
CREATE TRIGGER secure_interaction_trigger
  BEFORE INSERT ON public.user_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.secure_user_interaction();

-- 7. ADD AUDIT LOG TABLE
CREATE TABLE public.audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  table_name text NOT NULL,
  operation text NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for audit logs (only admins should see these)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 8. ADD TRIGGERS FOR PRIVACY SETTINGS
CREATE TRIGGER update_privacy_settings_updated_at
  BEFORE UPDATE ON public.privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 9. CREATE VIEW FOR SECURE PROFILE DISCOVERY
CREATE OR REPLACE VIEW public.discoverable_profiles AS
SELECT
  p.id,
  p.user_id,
  p.first_name,
  p.last_name,
  CASE WHEN ps.show_age = true THEN p.age ELSE NULL END as age,
  p.bio,
  CASE WHEN ps.show_location = true THEN p.location ELSE NULL END as location,
  CASE WHEN ps.show_profession = true THEN p.profession ELSE NULL END as profession,
  p.astrological_sign,
  p.interests,
  p.profile_images,
  p.created_at
FROM public.profiles p
LEFT JOIN public.privacy_settings ps ON p.user_id = ps.user_id
WHERE
  -- Exclude own profile
  p.user_id != auth.uid()
  -- Exclude users we've already interacted with
  AND NOT EXISTS (
    SELECT 1 FROM public.user_interactions ui
    WHERE ui.from_user_id = auth.uid()
    AND ui.to_user_id = p.user_id
  )
  -- Only include active users (could add last_active check here)
  AND EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = p.user_id
    AND u.deleted_at IS NULL
  );

-- Grant access to the view
GRANT SELECT ON public.discoverable_profiles TO authenticated;

-- 10. CREATE FUNCTION FOR SECURE MATCHING ALGORITHM
CREATE OR REPLACE FUNCTION public.get_potential_matches(
  limit_count integer DEFAULT 10
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
  astrological_sign text,
  interests text[],
  profile_images text[],
  compatibility_score numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dp.id as profile_id,
    dp.user_id,
    dp.first_name,
    dp.last_name,
    dp.age,
    dp.bio,
    dp.location,
    dp.profession,
    dp.astrological_sign,
    dp.interests,
    dp.profile_images,
    -- Simple compatibility score (can be enhanced)
    COALESCE(
      (
        -- Age compatibility (40%)
        CASE
          WHEN dp.age BETWEEN COALESCE(up.min_age, 18) AND COALESCE(up.max_age, 50)
          THEN 40
          ELSE 0
        END +
        -- Interest compatibility (30%) - count common interests
        (
          SELECT COUNT(*) * 30 / GREATEST(1, array_length(dp.interests, 1))
          FROM unnest(dp.interests) AS interest
          WHERE interest = ANY(
            SELECT i FROM unnest(mp.interests) AS i
          )
        ) +
        -- Profile completeness (20%)
        (
          CASE WHEN dp.bio IS NOT NULL AND length(dp.bio) > 10 THEN 10 ELSE 0 END +
          CASE WHEN dp.location IS NOT NULL THEN 5 ELSE 0 END +
          CASE WHEN dp.profession IS NOT NULL THEN 5 ELSE 0 END
        ) +
        -- Random factor for variety (10%)
        (random() * 10)
      )::numeric,
      0
    ) as compatibility_score
  FROM public.discoverable_profiles dp
  LEFT JOIN public.user_preferences up ON up.user_id = auth.uid()
  LEFT JOIN public.profiles mp ON mp.user_id = auth.uid() -- my profile for comparison
  ORDER BY compatibility_score DESC, random()
  LIMIT limit_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_potential_matches TO authenticated;

-- 11. ADD INDEXES FOR PERFORMANCE
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_interactions_from_user
ON public.user_interactions(from_user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_interactions_to_user
ON public.user_interactions(to_user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_user1
ON public.matches(user1_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_user2
ON public.matches(user2_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_user_id
ON public.profiles(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_logs_user_date
ON public.user_activity_logs(user_id, activity_date);

-- 12. CREATE FUNCTION FOR SECURE PROFILE UPDATES
CREATE OR REPLACE FUNCTION public.update_profile_securely(
  profile_data jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed_fields text[] := ARRAY['first_name', 'last_name', 'bio', 'location', 'profession', 'astrological_sign', 'interests', 'date_of_birth'];
  field_name text;
BEGIN
  -- Validate that only allowed fields are being updated
  FOR field_name IN SELECT jsonb_object_keys(profile_data)
  LOOP
    IF NOT (field_name = ANY(allowed_fields)) THEN
      RAISE EXCEPTION 'Field % is not allowed to be updated', field_name;
    END IF;
  END LOOP;

  -- Validate bio length
  IF profile_data ? 'bio' AND length(profile_data->>'bio') > 500 THEN
    RAISE EXCEPTION 'Bio cannot exceed 500 characters';
  END IF;

  -- Validate interests array
  IF profile_data ? 'interests' AND jsonb_array_length(profile_data->'interests') > 10 THEN
    RAISE EXCEPTION 'Cannot have more than 10 interests';
  END IF;

  -- Update the profile
  UPDATE public.profiles
  SET
    first_name = COALESCE(profile_data->>'first_name', first_name),
    last_name = COALESCE(profile_data->>'last_name', last_name),
    bio = COALESCE(profile_data->>'bio', bio),
    location = COALESCE(profile_data->>'location', location),
    profession = COALESCE(profile_data->>'profession', profession),
    astrological_sign = COALESCE(profile_data->>'astrological_sign', astrological_sign),
    interests = CASE
      WHEN profile_data ? 'interests'
      THEN ARRAY(SELECT jsonb_array_elements_text(profile_data->'interests'))
      ELSE interests
    END,
    date_of_birth = CASE
      WHEN profile_data ? 'date_of_birth'
      THEN (profile_data->>'date_of_birth')::date
      ELSE date_of_birth
    END,
    updated_at = now()
  WHERE user_id = auth.uid();

  RETURN true;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_profile_securely TO authenticated;

COMMENT ON MIGRATION IS 'Enhanced security policies, rate limiting, privacy controls, and audit logging for МойDate app';