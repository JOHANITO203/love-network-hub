-- Super Likes System Migration
-- Daily limited super likes (3/day) with special animations and priority notifications

-- Table for super likes quotas and usage
CREATE TABLE IF NOT EXISTS public.super_likes_quota (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_limit INTEGER NOT NULL DEFAULT 3,
  used_today INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_super_likes_sent INTEGER NOT NULL DEFAULT 0,
  total_super_likes_received INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_super_likes_quota_user_id ON public.super_likes_quota(user_id);
CREATE INDEX IF NOT EXISTS idx_super_likes_quota_last_reset ON public.super_likes_quota(last_reset_date);

-- Add super_like flag to user_interactions table
ALTER TABLE public.user_interactions
  ADD COLUMN IF NOT EXISTS is_super_like BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS super_like_seen BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS super_like_seen_at TIMESTAMPTZ;

-- Index for super likes queries
CREATE INDEX IF NOT EXISTS idx_user_interactions_super_like
  ON public.user_interactions(to_user_id, is_super_like, super_like_seen)
  WHERE is_super_like = TRUE;

-- Function to reset daily super likes quota
CREATE OR REPLACE FUNCTION reset_super_likes_quota()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset if it's a new day
  IF NEW.last_reset_date < CURRENT_DATE THEN
    NEW.used_today := 0;
    NEW.last_reset_date := CURRENT_DATE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-reset quota on access
CREATE TRIGGER trigger_reset_super_likes_quota
  BEFORE INSERT OR UPDATE ON public.super_likes_quota
  FOR EACH ROW
  EXECUTE FUNCTION reset_super_likes_quota();

-- Function to check and use super like quota
CREATE OR REPLACE FUNCTION use_super_like_quota(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  quota_row public.super_likes_quota%ROWTYPE;
  can_use BOOLEAN;
BEGIN
  -- Get or create quota row
  INSERT INTO public.super_likes_quota (user_id, daily_limit, used_today, last_reset_date)
  VALUES (user_id_param, 3, 0, CURRENT_DATE)
  ON CONFLICT (user_id) DO UPDATE
    SET last_reset_date = CASE
      WHEN super_likes_quota.last_reset_date < CURRENT_DATE
      THEN CURRENT_DATE
      ELSE super_likes_quota.last_reset_date
    END,
    used_today = CASE
      WHEN super_likes_quota.last_reset_date < CURRENT_DATE
      THEN 0
      ELSE super_likes_quota.used_today
    END,
    updated_at = NOW()
  RETURNING * INTO quota_row;

  -- Check if user can use super like
  can_use := quota_row.used_today < quota_row.daily_limit;

  -- If can use, increment counter
  IF can_use THEN
    UPDATE public.super_likes_quota
    SET used_today = used_today + 1,
        total_super_likes_sent = total_super_likes_sent + 1,
        updated_at = NOW()
    WHERE user_id = user_id_param;
  END IF;

  RETURN can_use;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get remaining super likes
CREATE OR REPLACE FUNCTION get_remaining_super_likes(user_id_param UUID)
RETURNS TABLE(
  remaining INTEGER,
  daily_limit INTEGER,
  used_today INTEGER,
  resets_at TIMESTAMPTZ
) AS $$
DECLARE
  quota_row public.super_likes_quota%ROWTYPE;
BEGIN
  -- Get or create quota row with auto-reset
  INSERT INTO public.super_likes_quota (user_id, daily_limit, used_today, last_reset_date)
  VALUES (user_id_param, 3, 0, CURRENT_DATE)
  ON CONFLICT (user_id) DO UPDATE
    SET last_reset_date = CASE
      WHEN super_likes_quota.last_reset_date < CURRENT_DATE
      THEN CURRENT_DATE
      ELSE super_likes_quota.last_reset_date
    END,
    used_today = CASE
      WHEN super_likes_quota.last_reset_date < CURRENT_DATE
      THEN 0
      ELSE super_likes_quota.used_today
    END,
    updated_at = NOW()
  RETURNING * INTO quota_row;

  -- Calculate reset time (midnight next day)
  RETURN QUERY SELECT
    (quota_row.daily_limit - quota_row.used_today)::INTEGER AS remaining,
    quota_row.daily_limit,
    quota_row.used_today,
    (CURRENT_DATE + INTERVAL '1 day')::TIMESTAMPTZ AS resets_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment received super likes counter
CREATE OR REPLACE FUNCTION increment_super_likes_received()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_super_like = TRUE THEN
    INSERT INTO public.super_likes_quota (user_id, total_super_likes_received)
    VALUES (NEW.to_user_id, 1)
    ON CONFLICT (user_id) DO UPDATE
      SET total_super_likes_received = super_likes_quota.total_super_likes_received + 1,
          updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment received counter
CREATE TRIGGER trigger_increment_super_likes_received
  AFTER INSERT ON public.user_interactions
  FOR EACH ROW
  WHEN (NEW.is_super_like = TRUE AND NEW.interaction_type = 'like')
  EXECUTE FUNCTION increment_super_likes_received();

-- RLS Policies
ALTER TABLE public.super_likes_quota ENABLE ROW LEVEL SECURITY;

-- Users can read their own quota
CREATE POLICY "Users can read own super likes quota"
  ON public.super_likes_quota
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own quota via functions only
CREATE POLICY "Users can update own super likes quota via functions"
  ON public.super_likes_quota
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION use_super_like_quota(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_remaining_super_likes(UUID) TO authenticated;

-- Comments
COMMENT ON TABLE public.super_likes_quota IS 'Tracks daily super likes quota and usage for each user';
COMMENT ON FUNCTION use_super_like_quota(UUID) IS 'Checks and decrements super like quota. Returns true if quota available.';
COMMENT ON FUNCTION get_remaining_super_likes(UUID) IS 'Returns remaining super likes count and reset time';
