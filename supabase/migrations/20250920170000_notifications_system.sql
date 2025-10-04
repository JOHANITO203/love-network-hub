-- ============================================================================
-- NOTIFICATION SYSTEM FOR МОЙDATE
-- ============================================================================

-- 1. NOTIFICATION TYPES TABLE
CREATE TABLE public.notification_types (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  default_enabled boolean DEFAULT true,
  icon text,
  category text CHECK (category IN ('matches', 'messages', 'profile', 'system'))
);

-- Insert default notification types
INSERT INTO public.notification_types (id, name, description, default_enabled, icon, category) VALUES
('new_match', 'Nouveau Match', 'Quelqu''un vous a liké en retour', true, '💕', 'matches'),
('new_message', 'Nouveau Message', 'Vous avez reçu un nouveau message', true, '💬', 'messages'),
('new_like', 'Nouveau Like', 'Quelqu''un a liké votre profil', true, '❤️', 'matches'),
('super_like', 'Super Like', 'Quelqu''un vous a super liké', true, '⭐', 'matches'),
('profile_view', 'Visite de Profil', 'Quelqu''un a visité votre profil', false, '👀', 'profile'),
('match_reminder', 'Rappel Match', 'Vous avez un nouveau match sans conversation', true, '🔔', 'matches'),
('verification_approved', 'Profil Vérifié', 'Votre profil a été vérifié', true, '✅', 'profile'),
('verification_rejected', 'Vérification Rejetée', 'Votre demande de vérification a été rejetée', true, '❌', 'profile'),
('system_update', 'Mise à jour', 'Nouvelles fonctionnalités disponibles', false, '🚀', 'system');

-- 2. USER NOTIFICATION PREFERENCES
CREATE TABLE public.notification_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notification_type text REFERENCES public.notification_types(id) NOT NULL,
  push_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT false,
  in_app_enabled boolean DEFAULT true,
  quiet_hours_start time DEFAULT '22:00',
  quiet_hours_end time DEFAULT '08:00',
  timezone text DEFAULT 'UTC',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, notification_type)
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can manage their own notification preferences
CREATE POLICY "Users can manage their own notification preferences"
ON public.notification_preferences
FOR ALL
USING (auth.uid() = user_id);

-- 3. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notification_type text REFERENCES public.notification_types(id) NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb, -- Additional data (user_id, match_id, etc.)
  is_read boolean DEFAULT false,
  is_sent_push boolean DEFAULT false,
  is_sent_email boolean DEFAULT false,
  scheduled_for timestamp with time zone DEFAULT now(),
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT now() + interval '30 days'
);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_scheduled ON public.notifications(scheduled_for) WHERE is_sent_push = false;
CREATE INDEX idx_notifications_expires ON public.notifications(expires_at);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only access their own notifications
CREATE POLICY "Users can access their own notifications"
ON public.notifications
FOR ALL
USING (auth.uid() = user_id);

-- 4. FUNCTION TO CREATE DEFAULT NOTIFICATION PREFERENCES
CREATE OR REPLACE FUNCTION public.create_default_notification_preferences(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default preferences for all notification types
  INSERT INTO public.notification_preferences (user_id, notification_type, push_enabled, email_enabled, in_app_enabled)
  SELECT
    target_user_id,
    nt.id,
    nt.default_enabled,
    false, -- Email disabled by default
    true   -- In-app enabled by default
  FROM public.notification_types nt
  ON CONFLICT (user_id, notification_type) DO NOTHING;
END;
$$;

-- 5. TRIGGER TO CREATE DEFAULT PREFERENCES FOR NEW USERS
CREATE OR REPLACE FUNCTION public.handle_new_user_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create default notification preferences
  PERFORM public.create_default_notification_preferences(NEW.id);
  RETURN NEW;
END;
$$;

-- Update the existing trigger or create a new one
DROP TRIGGER IF EXISTS on_auth_user_created_notifications ON auth.users;
CREATE TRIGGER on_auth_user_created_notifications
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_notifications();

-- 6. FUNCTION TO SEND NOTIFICATION
CREATE OR REPLACE FUNCTION public.send_notification(
  target_user_id uuid,
  notification_type_param text,
  title_param text,
  message_param text,
  data_param jsonb DEFAULT NULL,
  schedule_delay interval DEFAULT interval '0 seconds'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id uuid;
  prefs record;
  scheduled_time timestamp with time zone;
BEGIN
  -- Calculate scheduled time
  scheduled_time := now() + schedule_delay;

  -- Get user notification preferences
  SELECT np.push_enabled, np.email_enabled, np.in_app_enabled, np.quiet_hours_start, np.quiet_hours_end
  INTO prefs
  FROM public.notification_preferences np
  WHERE np.user_id = target_user_id AND np.notification_type = notification_type_param;

  -- If no preferences found, use defaults
  IF NOT FOUND THEN
    SELECT nt.default_enabled as push_enabled, false as email_enabled, true as in_app_enabled,
           '22:00'::time as quiet_hours_start, '08:00'::time as quiet_hours_end
    INTO prefs
    FROM public.notification_types nt
    WHERE nt.id = notification_type_param;
  END IF;

  -- Only create notification if user has at least one channel enabled
  IF prefs.push_enabled OR prefs.email_enabled OR prefs.in_app_enabled THEN
    -- Check quiet hours for push notifications
    IF prefs.push_enabled THEN
      DECLARE
        current_time time := (scheduled_time AT TIME ZONE 'UTC')::time;
      BEGIN
        -- If we're in quiet hours, disable push for this notification
        IF (prefs.quiet_hours_start <= prefs.quiet_hours_end AND
            current_time BETWEEN prefs.quiet_hours_start AND prefs.quiet_hours_end) OR
           (prefs.quiet_hours_start > prefs.quiet_hours_end AND
            (current_time >= prefs.quiet_hours_start OR current_time <= prefs.quiet_hours_end)) THEN
          -- Schedule for after quiet hours
          IF prefs.quiet_hours_start > prefs.quiet_hours_end THEN
            -- Quiet hours cross midnight
            scheduled_time := date_trunc('day', scheduled_time) + prefs.quiet_hours_end;
          ELSE
            -- Normal quiet hours
            scheduled_time := date_trunc('day', scheduled_time) + interval '1 day' + prefs.quiet_hours_end;
          END IF;
        END IF;
      END;
    END IF;

    -- Create the notification
    INSERT INTO public.notifications (
      user_id,
      notification_type,
      title,
      message,
      data,
      scheduled_for
    )
    VALUES (
      target_user_id,
      notification_type_param,
      title_param,
      message_param,
      data_param,
      scheduled_time
    )
    RETURNING id INTO notification_id;

    RETURN notification_id;
  END IF;

  RETURN NULL;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.send_notification TO authenticated;

-- 7. FUNCTION TO MARK NOTIFICATIONS AS READ
CREATE OR REPLACE FUNCTION public.mark_notifications_read(notification_ids uuid[])
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.notifications
  SET is_read = true
  WHERE id = ANY(notification_ids)
    AND user_id = auth.uid()
    AND is_read = false;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.mark_notifications_read TO authenticated;

-- 8. FUNCTION TO GET UNREAD NOTIFICATION COUNT
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  unread_count integer;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM public.notifications
  WHERE user_id = auth.uid()
    AND is_read = false
    AND expires_at > now();

  RETURN COALESCE(unread_count, 0);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_unread_notification_count TO authenticated;

-- 9. TRIGGERS FOR AUTOMATIC NOTIFICATIONS

-- Notification for new matches
CREATE OR REPLACE FUNCTION public.notify_new_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user1_name text;
  user2_name text;
BEGIN
  -- Get names for the notification
  SELECT first_name INTO user1_name FROM public.profiles WHERE user_id = NEW.user1_id;
  SELECT first_name INTO user2_name FROM public.profiles WHERE user_id = NEW.user2_id;

  -- Send notification to both users
  PERFORM public.send_notification(
    NEW.user1_id,
    'new_match',
    'Nouveau Match ! 💕',
    'Vous avez un nouveau match avec ' || COALESCE(user2_name, 'quelqu''un'),
    jsonb_build_object('match_id', NEW.id, 'other_user_id', NEW.user2_id)
  );

  PERFORM public.send_notification(
    NEW.user2_id,
    'new_match',
    'Nouveau Match ! 💕',
    'Vous avez un nouveau match avec ' || COALESCE(user1_name, 'quelqu''un'),
    jsonb_build_object('match_id', NEW.id, 'other_user_id', NEW.user1_id)
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER notify_new_match_trigger
  AFTER INSERT ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_match();

-- Notification for new likes
CREATE OR REPLACE FUNCTION public.notify_new_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  liker_name text;
  notification_type_to_use text;
BEGIN
  -- Only notify for likes and super likes
  IF NEW.interaction_type IN ('like', 'super_like') THEN
    -- Get liker's name
    SELECT first_name INTO liker_name FROM public.profiles WHERE user_id = NEW.from_user_id;

    -- Determine notification type
    notification_type_to_use := CASE
      WHEN NEW.interaction_type = 'super_like' THEN 'super_like'
      ELSE 'new_like'
    END;

    -- Send notification to the liked user
    PERFORM public.send_notification(
      NEW.to_user_id,
      notification_type_to_use,
      CASE
        WHEN NEW.interaction_type = 'super_like' THEN 'Super Like ! ⭐'
        ELSE 'Nouveau Like ! ❤️'
      END,
      COALESCE(liker_name, 'Quelqu''un') ||
      CASE
        WHEN NEW.interaction_type = 'super_like' THEN ' vous a super liké !'
        ELSE ' vous a liké !'
      END,
      jsonb_build_object('from_user_id', NEW.from_user_id, 'interaction_type', NEW.interaction_type)
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER notify_new_like_trigger
  AFTER INSERT ON public.user_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_like();

-- Notification for new messages
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_id uuid;
  sender_name text;
  match_record record;
BEGIN
  -- Skip system messages
  IF NEW.message_type = 'system' THEN
    RETURN NEW;
  END IF;

  -- Get match information
  SELECT user1_id, user2_id INTO match_record
  FROM public.matches
  WHERE id = NEW.match_id;

  -- Determine recipient
  recipient_id := CASE
    WHEN NEW.sender_id = match_record.user1_id THEN match_record.user2_id
    ELSE match_record.user1_id
  END;

  -- Get sender's name
  SELECT first_name INTO sender_name FROM public.profiles WHERE user_id = NEW.sender_id;

  -- Send notification
  PERFORM public.send_notification(
    recipient_id,
    'new_message',
    'Nouveau Message 💬',
    COALESCE(sender_name, 'Quelqu''un') || ' vous a envoyé un message',
    jsonb_build_object(
      'message_id', NEW.id,
      'match_id', NEW.match_id,
      'sender_id', NEW.sender_id,
      'message_type', NEW.message_type
    )
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER notify_new_message_trigger
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_message();

-- 10. UPDATE TRIGGERS FOR UPDATED_AT
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 11. CLEANUP FUNCTION FOR OLD NOTIFICATIONS
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.notifications
  WHERE expires_at < now();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Grant execute permission to service role for scheduled cleanup
GRANT EXECUTE ON FUNCTION public.cleanup_old_notifications TO service_role;

-- 12. VIEW FOR USER NOTIFICATIONS WITH TYPE DETAILS
CREATE OR REPLACE VIEW public.user_notifications_view AS
SELECT
  n.id,
  n.notification_type,
  nt.name as type_name,
  nt.icon,
  nt.category,
  n.title,
  n.message,
  n.data,
  n.is_read,
  n.created_at,
  n.scheduled_for,
  n.sent_at
FROM public.notifications n
JOIN public.notification_types nt ON n.notification_type = nt.id
WHERE n.user_id = auth.uid()
  AND n.expires_at > now()
ORDER BY n.created_at DESC;

-- Grant access to the view
GRANT SELECT ON public.user_notifications_view TO authenticated;

COMMENT ON MIGRATION IS 'Complete notification system with push notifications, preferences, and automated triggers for МойDate';