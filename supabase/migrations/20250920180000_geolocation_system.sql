-- ============================================================================
-- GEOLOCATION SYSTEM FOR МОЙDATE
-- ============================================================================

-- 1. ADD GEOLOCATION FIELDS TO PROFILES TABLE
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS latitude decimal(10, 8),
ADD COLUMN IF NOT EXISTS longitude decimal(11, 8),
ADD COLUMN IF NOT EXISTS location_accuracy integer, -- in meters
ADD COLUMN IF NOT EXISTS location_updated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS allow_location_sharing boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS location_city text,
ADD COLUMN IF NOT EXISTS location_country text,
ADD COLUMN IF NOT EXISTS location_region text;

-- Create index for geospatial queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_location
ON public.profiles USING GIST (
  ll_to_earth(latitude, longitude)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Alternative index for distance calculations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_lat_lng
ON public.profiles (latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 2. UPDATE USER_PREFERENCES TABLE FOR LOCATION SETTINGS
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS max_distance_km integer DEFAULT 50,
ADD COLUMN IF NOT EXISTS use_precise_location boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_distance boolean DEFAULT true;

-- 3. CREATE FUNCTION TO CALCULATE DISTANCE BETWEEN TWO POINTS
-- Using Haversine formula for accurate distance calculation
CREATE OR REPLACE FUNCTION public.calculate_distance_km(
  lat1 decimal,
  lng1 decimal,
  lat2 decimal,
  lng2 decimal
)
RETURNS decimal
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  earth_radius decimal := 6371; -- Earth's radius in kilometers
  dlat decimal;
  dlng decimal;
  a decimal;
  c decimal;
BEGIN
  -- Handle null values
  IF lat1 IS NULL OR lng1 IS NULL OR lat2 IS NULL OR lng2 IS NULL THEN
    RETURN NULL;
  END IF;

  -- Convert latitude and longitude from degrees to radians
  dlat := radians(lat2 - lat1);
  dlng := radians(lng2 - lng1);

  -- Haversine formula
  a := sin(dlat/2) * sin(dlat/2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dlng/2) * sin(dlng/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));

  -- Distance in kilometers
  RETURN earth_radius * c;
END;
$$;

-- 4. CREATE FUNCTION TO UPDATE USER LOCATION
CREATE OR REPLACE FUNCTION public.update_user_location(
  latitude_param decimal,
  longitude_param decimal,
  accuracy_param integer DEFAULT NULL,
  city_param text DEFAULT NULL,
  country_param text DEFAULT NULL,
  region_param text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate coordinates
  IF latitude_param IS NULL OR longitude_param IS NULL THEN
    RAISE EXCEPTION 'Latitude and longitude are required';
  END IF;

  IF latitude_param < -90 OR latitude_param > 90 THEN
    RAISE EXCEPTION 'Invalid latitude: must be between -90 and 90';
  END IF;

  IF longitude_param < -180 OR longitude_param > 180 THEN
    RAISE EXCEPTION 'Invalid longitude: must be between -180 and 180';
  END IF;

  -- Update user's profile with new location
  UPDATE public.profiles
  SET
    latitude = latitude_param,
    longitude = longitude_param,
    location_accuracy = accuracy_param,
    location_updated_at = now(),
    location_city = COALESCE(city_param, location_city),
    location_country = COALESCE(country_param, location_country),
    location_region = COALESCE(region_param, location_region),
    updated_at = now()
  WHERE user_id = auth.uid();

  -- Check if any rows were updated
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found for current user';
  END IF;

  RETURN true;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_user_location TO authenticated;

-- 5. CREATE FUNCTION TO GET NEARBY PROFILES
CREATE OR REPLACE FUNCTION public.get_nearby_profiles(
  max_distance_km integer DEFAULT 50,
  limit_count integer DEFAULT 20
)
RETURNS TABLE (
  profile_id uuid,
  user_id uuid,
  first_name text,
  last_name text,
  age integer,
  bio text,
  location_city text,
  profession text,
  astrological_sign text,
  interests text[],
  profile_images text[],
  distance_km decimal,
  last_active timestamp with time zone,
  is_verified boolean,
  compatibility_score numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_lat decimal;
  user_lng decimal;
  user_preferences record;
  user_profile record;
BEGIN
  -- Get current user's location and preferences
  SELECT p.latitude, p.longitude INTO user_lat, user_lng
  FROM public.profiles p
  WHERE p.user_id = auth.uid();

  -- If user has no location, return empty result
  IF user_lat IS NULL OR user_lng IS NULL THEN
    RETURN;
  END IF;

  -- Get user preferences
  SELECT up.max_distance_km, up.min_age, up.max_age, up.interested_in, up.show_distance
  INTO user_preferences
  FROM public.user_preferences up
  WHERE up.user_id = auth.uid();

  -- Get user's own profile for compatibility calculation
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE user_id = auth.uid();

  -- Return nearby profiles with distance and compatibility
  RETURN QUERY
  SELECT
    p.id as profile_id,
    p.user_id,
    p.first_name,
    p.last_name,
    p.age,
    p.bio,
    p.location_city,
    p.profession,
    p.astrological_sign,
    p.interests,
    p.profile_images,
    CASE
      WHEN user_preferences.show_distance = true
      THEN public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude)
      ELSE NULL
    END as distance_km,
    p.last_active,
    p.is_verified,
    -- Enhanced compatibility score including distance
    COALESCE(
      (
        -- Age compatibility (30%)
        CASE
          WHEN p.age BETWEEN COALESCE(user_preferences.min_age, 18) AND COALESCE(user_preferences.max_age, 50)
          THEN 30
          ELSE 0
        END +
        -- Interest compatibility (25%) - count common interests
        COALESCE(
          (
            SELECT COUNT(*) * 25 / GREATEST(1, array_length(p.interests, 1))
            FROM unnest(p.interests) AS interest
            WHERE interest = ANY(user_profile.interests)
          ),
          0
        ) +
        -- Profile completeness (20%)
        (
          CASE WHEN p.bio IS NOT NULL AND length(p.bio) > 10 THEN 10 ELSE 0 END +
          CASE WHEN p.location_city IS NOT NULL THEN 5 ELSE 0 END +
          CASE WHEN p.profession IS NOT NULL THEN 5 ELSE 0 END
        ) +
        -- Distance compatibility (15%) - closer is better
        CASE
          WHEN public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 5 THEN 15
          WHEN public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 15 THEN 12
          WHEN public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 30 THEN 8
          WHEN public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 50 THEN 5
          ELSE 0
        END +
        -- Verification bonus (5%)
        CASE WHEN p.is_verified = true THEN 5 ELSE 0 END +
        -- Activity bonus (5%) - recently active users
        CASE
          WHEN p.last_active > now() - interval '1 day' THEN 5
          WHEN p.last_active > now() - interval '7 days' THEN 3
          WHEN p.last_active > now() - interval '30 days' THEN 1
          ELSE 0
        END
      )::numeric,
      0
    ) as compatibility_score
  FROM public.profiles p
  WHERE
    -- Exclude own profile
    p.user_id != auth.uid()
    -- Only profiles with location data
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    -- Only profiles that allow location sharing
    AND p.allow_location_sharing = true
    -- Within distance range
    AND public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= COALESCE(user_preferences.max_distance_km, max_distance_km)
    -- Only active, non-banned profiles
    AND p.is_banned = false
    AND p.profile_visibility = 'public'
    -- Exclude blocked users (both ways)
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users bu
      WHERE (bu.blocker_id = auth.uid() AND bu.blocked_id = p.user_id)
      OR (bu.blocker_id = p.user_id AND bu.blocked_id = auth.uid())
    )
    -- Exclude users we've already interacted with
    AND NOT EXISTS (
      SELECT 1 FROM public.user_interactions ui
      WHERE ui.from_user_id = auth.uid()
      AND ui.to_user_id = p.user_id
    )
    -- Only include active users (logged in within last 30 days)
    AND p.last_active > now() - interval '30 days'
    -- Must have auth user record
    AND EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = p.user_id
      AND u.deleted_at IS NULL
    )
  ORDER BY compatibility_score DESC, distance_km ASC NULLS LAST
  LIMIT limit_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_nearby_profiles TO authenticated;

-- 6. CREATE FUNCTION TO GET LOCATION STATS
CREATE OR REPLACE FUNCTION public.get_location_stats()
RETURNS TABLE (
  total_profiles_with_location bigint,
  profiles_within_5km bigint,
  profiles_within_25km bigint,
  profiles_within_50km bigint,
  avg_distance_km decimal
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_lat decimal;
  user_lng decimal;
BEGIN
  -- Get current user's location
  SELECT p.latitude, p.longitude INTO user_lat, user_lng
  FROM public.profiles p
  WHERE p.user_id = auth.uid();

  -- If user has no location, return zeros
  IF user_lat IS NULL OR user_lng IS NULL THEN
    RETURN QUERY
    SELECT 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::decimal;
    RETURN;
  END IF;

  -- Calculate location statistics
  RETURN QUERY
  SELECT
    COUNT(*) as total_profiles_with_location,
    COUNT(*) FILTER (WHERE public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 5) as profiles_within_5km,
    COUNT(*) FILTER (WHERE public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 25) as profiles_within_25km,
    COUNT(*) FILTER (WHERE public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude) <= 50) as profiles_within_50km,
    ROUND(AVG(public.calculate_distance_km(user_lat, user_lng, p.latitude, p.longitude)), 1) as avg_distance_km
  FROM public.profiles p
  WHERE
    p.user_id != auth.uid()
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND p.allow_location_sharing = true
    AND p.is_banned = false
    AND p.profile_visibility = 'public'
    AND p.last_active > now() - interval '30 days';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_location_stats TO authenticated;

-- 7. CREATE VIEW FOR LOCATION-BASED DISCOVERABLE PROFILES
CREATE OR REPLACE VIEW public.location_discoverable_profiles AS
SELECT
  p.id,
  p.user_id,
  p.first_name,
  p.last_name,
  CASE WHEN ps.show_age = true THEN p.age ELSE NULL END as age,
  p.bio,
  CASE WHEN ps.show_location = true THEN p.location_city ELSE NULL END as location_city,
  CASE WHEN ps.show_profession = true THEN p.profession ELSE NULL END as profession,
  p.astrological_sign,
  p.interests,
  p.profile_images,
  CASE WHEN ps.show_last_active = true THEN p.last_active ELSE NULL END as last_active,
  p.is_verified,
  p.latitude,
  p.longitude,
  p.location_updated_at,
  p.created_at
FROM public.profiles p
LEFT JOIN public.privacy_settings ps ON p.user_id = ps.user_id
WHERE
  -- Exclude own profile
  p.user_id != auth.uid()
  -- Only active, non-banned profiles
  AND p.is_banned = false
  AND p.profile_visibility = 'public'
  -- Only profiles that allow location sharing
  AND p.allow_location_sharing = true
  -- Has location data
  AND p.latitude IS NOT NULL
  AND p.longitude IS NOT NULL
  -- Exclude blocked users (both ways)
  AND NOT EXISTS (
    SELECT 1 FROM public.blocked_users bu
    WHERE (bu.blocker_id = auth.uid() AND bu.blocked_id = p.user_id)
    OR (bu.blocker_id = p.user_id AND bu.blocked_id = auth.uid())
  )
  -- Exclude users we've already interacted with
  AND NOT EXISTS (
    SELECT 1 FROM public.user_interactions ui
    WHERE ui.from_user_id = auth.uid()
    AND ui.to_user_id = p.user_id
  )
  -- Only include active users (logged in within last 30 days)
  AND p.last_active > now() - interval '30 days'
  -- Must have auth user record
  AND EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = p.user_id
    AND u.deleted_at IS NULL
  );

-- Grant access to the view
GRANT SELECT ON public.location_discoverable_profiles TO authenticated;

-- 8. UPDATE EXISTING GET_POTENTIAL_MATCHES FUNCTION TO USE LOCATION
DROP FUNCTION IF EXISTS public.get_potential_matches(integer);

CREATE OR REPLACE FUNCTION public.get_potential_matches(
  limit_count integer DEFAULT 10,
  use_location boolean DEFAULT true
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
  distance_km decimal,
  compatibility_score numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Use location-based matching if requested and user has location
  IF use_location THEN
    RETURN QUERY
    SELECT
      np.profile_id,
      np.user_id,
      np.first_name,
      np.last_name,
      np.age,
      np.bio,
      np.location_city as location,
      np.profession,
      np.astrological_sign,
      np.interests,
      np.profile_images,
      np.distance_km,
      np.compatibility_score
    FROM public.get_nearby_profiles(
      (SELECT max_distance_km FROM public.user_preferences WHERE user_id = auth.uid()),
      limit_count
    ) np;
  ELSE
    -- Fallback to original matching without location
    RETURN QUERY
    SELECT
      dp.id as profile_id,
      dp.user_id,
      dp.first_name,
      dp.last_name,
      dp.age,
      dp.bio,
      dp.location_city as location,
      dp.profession,
      dp.astrological_sign,
      dp.interests,
      dp.profile_images,
      NULL::decimal as distance_km,
      -- Simple compatibility score without location factor
      COALESCE(
        (
          -- Age compatibility (40%)
          CASE
            WHEN dp.age BETWEEN COALESCE(up.min_age, 18) AND COALESCE(up.max_age, 50)
            THEN 40
            ELSE 0
          END +
          -- Interest compatibility (30%)
          COALESCE(
            (
              SELECT COUNT(*) * 30 / GREATEST(1, array_length(dp.interests, 1))
              FROM unnest(dp.interests) AS interest
              WHERE interest = ANY(mp.interests)
            ),
            0
          ) +
          -- Profile completeness (20%)
          (
            CASE WHEN dp.bio IS NOT NULL AND length(dp.bio) > 10 THEN 10 ELSE 0 END +
            CASE WHEN dp.location_city IS NOT NULL THEN 5 ELSE 0 END +
            CASE WHEN dp.profession IS NOT NULL THEN 5 ELSE 0 END
          ) +
          -- Random factor for variety (10%)
          (random() * 10)
        )::numeric,
        0
      ) as compatibility_score
    FROM public.discoverable_profiles dp
    LEFT JOIN public.user_preferences up ON up.user_id = auth.uid()
    LEFT JOIN public.profiles mp ON mp.user_id = auth.uid()
    ORDER BY compatibility_score DESC, random()
    LIMIT limit_count;
  END IF;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_potential_matches TO authenticated;

-- 9. ADD LOCATION PRIVACY POLICY
CREATE POLICY "Location data is restricted"
ON public.profiles
FOR SELECT
USING (
  -- Users can always see their own location
  auth.uid() = user_id
  OR
  -- Others can only see location if sharing is enabled and they meet visibility criteria
  (
    allow_location_sharing = true
    AND is_banned = false
    AND profile_visibility = 'public'
    -- User is not blocked
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users bu
      WHERE (bu.blocker_id = auth.uid() AND bu.blocked_id = profiles.user_id)
      OR (bu.blocker_id = profiles.user_id AND bu.blocked_id = auth.uid())
    )
  )
);

COMMENT ON MIGRATION IS 'Complete geolocation system with GPS coordinates, distance calculations, and location-based matching for МойDate';