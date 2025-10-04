-- ============================================================================
-- ADDITIONAL SECURITY TABLES FOR МОЙDATE
-- ============================================================================

-- 1. USER SESSIONS TABLE FOR TRACKING ACTIVE SESSIONS
CREATE TABLE public.user_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token text NOT NULL,
  ip_address inet,
  user_agent text,
  device_type text,
  location_country text,
  location_city text,
  is_active boolean DEFAULT true,
  last_activity timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT now() + interval '7 days'
);

-- Create index for performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(user_id, is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own sessions
CREATE POLICY "Users can view their own sessions"
ON public.user_sessions
FOR SELECT
USING (auth.uid() = user_id);

-- 2. BLOCKED USERS TABLE
CREATE TABLE public.blocked_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blocked_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- Enable RLS
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- Users can manage their own blocks
CREATE POLICY "Users can manage their own blocks"
ON public.blocked_users
FOR ALL
USING (auth.uid() = blocker_id);

-- 3. DEVICE TOKENS FOR PUSH NOTIFICATIONS
CREATE TABLE public.device_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  last_used timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, token)
);

-- Enable RLS
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- Users can manage their own device tokens
CREATE POLICY "Users can manage their own device tokens"
ON public.device_tokens
FOR ALL
USING (auth.uid() = user_id);

-- 4. CHAT MESSAGES TABLE
CREATE TABLE public.chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id uuid REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'system')),
  content text,
  content_url text, -- For images/audio
  is_ai_assisted boolean DEFAULT false,
  is_read boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  edited_at timestamp with time zone,
  CHECK (
    (message_type = 'text' AND content IS NOT NULL) OR
    (message_type IN ('image', 'audio') AND content_url IS NOT NULL) OR
    (message_type = 'system')
  )
);

-- Create indexes for performance
CREATE INDEX idx_chat_messages_match_id ON public.chat_messages(match_id);
CREATE INDEX idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only access messages from their matches
CREATE POLICY "Users can access messages from their matches"
ON public.chat_messages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.id = chat_messages.match_id
    AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
    AND m.is_active = true
  )
);

-- 5. IMPROVED PROFILES TABLE WITH ADDITIONAL SECURITY FIELDS
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ban_reason text,
ADD COLUMN IF NOT EXISTS ban_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS last_active timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS profile_visibility text DEFAULT 'public' CHECK (profile_visibility IN ('public', 'limited', 'hidden'));

-- 6. UPDATE PROFILE POLICIES TO CONSIDER BANNED/BLOCKED USERS
DROP POLICY IF EXISTS "Profiles are viewable with restrictions" ON public.profiles;

CREATE POLICY "Profiles are viewable with enhanced restrictions"
ON public.profiles
FOR SELECT
USING (
  -- Users can always see their own profile
  auth.uid() = user_id
  OR
  (
    -- Profile must be active and not banned
    profiles.is_banned = false
    AND profiles.profile_visibility != 'hidden'
    -- User is not blocked by the profile owner
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users bu
      WHERE bu.blocker_id = profiles.user_id
      AND bu.blocked_id = auth.uid()
    )
    -- User hasn't blocked the profile owner
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users bu
      WHERE bu.blocker_id = auth.uid()
      AND bu.blocked_id = profiles.user_id
    )
    AND (
      -- Users can see profiles they've matched with
      EXISTS (
        SELECT 1 FROM public.matches m
        WHERE (m.user1_id = auth.uid() AND m.user2_id = profiles.user_id)
        OR (m.user2_id = auth.uid() AND m.user1_id = profiles.user_id)
        AND m.is_active = true
      )
      OR
      -- Users can see potential matches (profiles they haven't interacted with yet)
      (
        profiles.user_id != auth.uid()
        AND profiles.profile_visibility = 'public'
        AND NOT EXISTS (
          SELECT 1 FROM public.user_interactions ui
          WHERE ui.from_user_id = auth.uid()
          AND ui.to_user_id = profiles.user_id
        )
      )
    )
  )
);

-- 7. FUNCTION TO UPDATE LAST ACTIVE
CREATE OR REPLACE FUNCTION public.update_last_active()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET last_active = now()
  WHERE user_id = auth.uid();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_last_active TO authenticated;

-- 8. FUNCTION TO BLOCK/UNBLOCK USERS
CREATE OR REPLACE FUNCTION public.manage_user_block(
  target_user_id uuid,
  block_action boolean, -- true to block, false to unblock
  block_reason text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate input
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot block yourself';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'Target user does not exist';
  END IF;

  IF block_action THEN
    -- Block user
    INSERT INTO public.blocked_users (blocker_id, blocked_id, reason)
    VALUES (auth.uid(), target_user_id, block_reason)
    ON CONFLICT (blocker_id, blocked_id) DO NOTHING;

    -- Remove any existing match
    UPDATE public.matches
    SET is_active = false
    WHERE (user1_id = auth.uid() AND user2_id = target_user_id)
    OR (user2_id = auth.uid() AND user1_id = target_user_id);

  ELSE
    -- Unblock user
    DELETE FROM public.blocked_users
    WHERE blocker_id = auth.uid() AND blocked_id = target_user_id;
  END IF;

  RETURN true;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.manage_user_block TO authenticated;

-- 9. FUNCTION TO REPORT USERS
CREATE OR REPLACE FUNCTION public.report_user(
  reported_user_id uuid,
  report_reason text,
  report_description text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate input
  IF reported_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot report yourself';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = reported_user_id) THEN
    RAISE EXCEPTION 'Reported user does not exist';
  END IF;

  -- Check if already reported
  IF EXISTS (
    SELECT 1 FROM public.user_reports
    WHERE reporter_id = auth.uid() AND reported_id = reported_user_id
  ) THEN
    RAISE EXCEPTION 'User already reported';
  END IF;

  -- Create report
  INSERT INTO public.user_reports (reporter_id, reported_id, reason, description)
  VALUES (auth.uid(), reported_user_id, report_reason, report_description);

  RETURN true;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.report_user TO authenticated;

-- 10. UPDATE DISCOVERABLE PROFILES VIEW
DROP VIEW IF EXISTS public.discoverable_profiles;

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
  CASE WHEN ps.show_last_active = true THEN p.last_active ELSE NULL END as last_active,
  p.is_verified,
  p.created_at
FROM public.profiles p
LEFT JOIN public.privacy_settings ps ON p.user_id = ps.user_id
WHERE
  -- Exclude own profile
  p.user_id != auth.uid()
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
  );

-- Grant access to the view
GRANT SELECT ON public.discoverable_profiles TO authenticated;

-- 11. TRIGGER TO AUTO-UPDATE LAST ACTIVE ON USER INTERACTIONS
CREATE OR REPLACE FUNCTION public.update_last_active_on_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update last_active for the user making the interaction
  UPDATE public.profiles
  SET last_active = now()
  WHERE user_id = NEW.from_user_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER update_last_active_trigger
  AFTER INSERT ON public.user_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_last_active_on_interaction();

-- 12. INDEXES FOR PERFORMANCE
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_last_active
ON public.profiles(last_active DESC) WHERE is_banned = false;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_visibility
ON public.profiles(profile_visibility) WHERE is_banned = false;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_blocked_users_composite
ON public.blocked_users(blocker_id, blocked_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_match_created
ON public.chat_messages(match_id, created_at DESC);

COMMENT ON MIGRATION IS 'Additional security tables: sessions, blocks, device tokens, chat messages, and enhanced profile security for МойDate';