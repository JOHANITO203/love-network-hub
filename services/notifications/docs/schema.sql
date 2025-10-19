-- Notifications Database Schema for Love Network Hub
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Notification types enum
CREATE TYPE notification_type AS ENUM (
  'NEW_MATCH',
  'NEW_MESSAGE',
  'LIKE',
  'SUPER_LIKE',
  'PROFILE_VIEW',
  'SYSTEM_ANNOUNCEMENT',
  'PROMOTIONAL',
  'REMINDER',
  'SUBSCRIPTION'
);

-- Notification channels enum
CREATE TYPE notification_channel AS ENUM (
  'PUSH',
  'EMAIL',
  'IN_APP',
  'SMS'
);

-- Notification priority enum
CREATE TYPE notification_priority AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT'
);

-- Delivery status enum
CREATE TYPE delivery_status AS ENUM (
  'PENDING',
  'QUEUED',
  'SENT',
  'DELIVERED',
  'FAILED',
  'BOUNCED',
  'READ'
);

-- Platform enum
CREATE TYPE device_platform AS ENUM (
  'IOS',
  'ANDROID',
  'WEB'
);

-- Email frequency enum
CREATE TYPE email_frequency AS ENUM (
  'INSTANT',
  'DAILY_DIGEST',
  'WEEKLY_DIGEST',
  'NEVER'
);

-- Device tokens table
CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  token TEXT NOT NULL,
  platform device_platform NOT NULL,
  is_active BOOLEAN DEFAULT true,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, token)
);

CREATE INDEX idx_device_tokens_user_id ON device_tokens(user_id);
CREATE INDEX idx_device_tokens_active ON device_tokens(is_active) WHERE is_active = true;

-- User notification preferences table
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  push_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  notification_types JSONB DEFAULT '{}'::jsonb,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone VARCHAR(50) DEFAULT 'UTC',
  email_frequency email_frequency DEFAULT 'INSTANT',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Notification templates table
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  type notification_type NOT NULL,
  channel notification_channel NOT NULL,
  subject VARCHAR(255),
  title_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  html_template TEXT,
  variables TEXT[],
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_templates_type ON notification_templates(type);
CREATE INDEX idx_notification_templates_channel ON notification_templates(channel);
CREATE INDEX idx_notification_templates_active ON notification_templates(is_active) WHERE is_active = true;

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  action_url TEXT,
  priority notification_priority DEFAULT 'MEDIUM',
  channels notification_channel[] NOT NULL,
  delivery_status JSONB DEFAULT '{}'::jsonb,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  template_id UUID REFERENCES notification_templates(id),
  ab_test_variant VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_read ON notifications(read_at) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_priority ON notifications(priority);

-- Notification analytics table
CREATE TABLE notification_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  channel notification_channel NOT NULL,
  status delivery_status NOT NULL,
  delivery_time INTEGER, -- milliseconds
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  device_info JSONB,
  location VARCHAR(100),
  ab_test_variant VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_analytics_notification_id ON notification_analytics(notification_id);
CREATE INDEX idx_notification_analytics_user_id ON notification_analytics(user_id);
CREATE INDEX idx_notification_analytics_channel ON notification_analytics(channel);
CREATE INDEX idx_notification_analytics_created_at ON notification_analytics(created_at DESC);

-- A/B test variants table
CREATE TABLE ab_test_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_type notification_type NOT NULL,
  variant_name VARCHAR(100) NOT NULL,
  title_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  weight INTEGER DEFAULT 50 CHECK (weight >= 0 AND weight <= 100),
  is_active BOOLEAN DEFAULT true,
  metrics JSONB DEFAULT '{"sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "conversionRate": 0}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(notification_type, variant_name)
);

CREATE INDEX idx_ab_test_variants_type ON ab_test_variants(notification_type);
CREATE INDEX idx_ab_test_variants_active ON ab_test_variants(is_active) WHERE is_active = true;

-- Notification batches table (for digest emails)
CREATE TABLE notification_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  batch_type VARCHAR(50) NOT NULL,
  notification_ids UUID[],
  status VARCHAR(50) DEFAULT 'PENDING',
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_batches_user_id ON notification_batches(user_id);
CREATE INDEX idx_notification_batches_scheduled ON notification_batches(scheduled_for);
CREATE INDEX idx_notification_batches_status ON notification_batches(status);

-- Unsubscribe tokens table
CREATE TABLE unsubscribe_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  notification_type notification_type,
  is_used BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_unsubscribe_tokens_token ON unsubscribe_tokens(token);
CREATE INDEX idx_unsubscribe_tokens_user_id ON unsubscribe_tokens(user_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_device_tokens_updated_at BEFORE UPDATE ON device_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ab_test_variants_updated_at BEFORE UPDATE ON ab_test_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get user's active device tokens
CREATE OR REPLACE FUNCTION get_user_device_tokens(p_user_id UUID, p_platform device_platform DEFAULT NULL)
RETURNS TABLE (
  token TEXT,
  platform device_platform,
  device_info JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT dt.token, dt.platform, dt.device_info
  FROM device_tokens dt
  WHERE dt.user_id = p_user_id
    AND dt.is_active = true
    AND (p_platform IS NULL OR dt.platform = p_platform);
END;
$$ LANGUAGE plpgsql;

-- Function to check if notification should be sent based on preferences and quiet hours
CREATE OR REPLACE FUNCTION should_send_notification(
  p_user_id UUID,
  p_notification_type notification_type,
  p_channel notification_channel
) RETURNS BOOLEAN AS $$
DECLARE
  v_prefs RECORD;
  v_current_time TIME;
  v_channel_enabled BOOLEAN;
BEGIN
  -- Get user preferences
  SELECT * INTO v_prefs
  FROM notification_preferences
  WHERE user_id = p_user_id;

  -- If no preferences, allow by default
  IF NOT FOUND THEN
    RETURN true;
  END IF;

  -- Check channel enabled globally
  CASE p_channel
    WHEN 'PUSH' THEN v_channel_enabled := v_prefs.push_enabled;
    WHEN 'EMAIL' THEN v_channel_enabled := v_prefs.email_enabled;
    WHEN 'IN_APP' THEN v_channel_enabled := v_prefs.in_app_enabled;
    WHEN 'SMS' THEN v_channel_enabled := v_prefs.sms_enabled;
    ELSE v_channel_enabled := false;
  END CASE;

  IF NOT v_channel_enabled THEN
    RETURN false;
  END IF;

  -- Check quiet hours for push notifications
  IF p_channel = 'PUSH' AND v_prefs.quiet_hours_start IS NOT NULL AND v_prefs.quiet_hours_end IS NOT NULL THEN
    v_current_time := CURRENT_TIME AT TIME ZONE v_prefs.timezone;

    IF v_prefs.quiet_hours_start < v_prefs.quiet_hours_end THEN
      -- Normal case: e.g., 22:00 to 08:00
      IF v_current_time >= v_prefs.quiet_hours_start AND v_current_time < v_prefs.quiet_hours_end THEN
        RETURN false;
      END IF;
    ELSE
      -- Overnight case: e.g., 22:00 to 08:00 next day
      IF v_current_time >= v_prefs.quiet_hours_start OR v_current_time < v_prefs.quiet_hours_end THEN
        RETURN false;
      END IF;
    END IF;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Insert default notification templates
INSERT INTO notification_templates (name, type, channel, subject, title_template, body_template, variables) VALUES
('new_match_push', 'NEW_MATCH', 'PUSH', NULL, 'New Match!', 'You matched with {{matchName}}! Say hi!', ARRAY['matchName', 'matchPhoto']),
('new_match_email', 'NEW_MATCH', 'EMAIL', 'You have a new match!', 'New Match with {{matchName}}', '<h1>Congratulations!</h1><p>You matched with {{matchName}}!</p>', ARRAY['matchName', 'matchPhoto', 'profileUrl']),
('new_message_push', 'NEW_MESSAGE', 'PUSH', NULL, 'New Message', '{{senderName}}: {{messagePreview}}', ARRAY['senderName', 'messagePreview']),
('like_push', 'LIKE', 'PUSH', NULL, 'Someone likes you!', 'Someone just liked your profile!', ARRAY['likerName']),
('super_like_push', 'SUPER_LIKE', 'PUSH', NULL, 'Super Like!', '{{likerName}} super liked you!', ARRAY['likerName', 'likerPhoto']),
('profile_view_push', 'PROFILE_VIEW', 'PUSH', NULL, 'Profile View', '{{viewerName}} viewed your profile', ARRAY['viewerName']);

-- Insert default user preferences for testing
INSERT INTO notification_preferences (user_id, push_enabled, email_enabled, in_app_enabled) VALUES
('00000000-0000-0000-0000-000000000001', true, true, true);

COMMENT ON TABLE notifications IS 'Main notifications table storing all notification records';
COMMENT ON TABLE notification_preferences IS 'User-specific notification preferences and settings';
COMMENT ON TABLE notification_templates IS 'Reusable notification templates with variable substitution';
COMMENT ON TABLE notification_analytics IS 'Analytics and tracking data for notification delivery and engagement';
COMMENT ON TABLE ab_test_variants IS 'A/B testing variants for notification optimization';
COMMENT ON TABLE device_tokens IS 'FCM device tokens for push notifications';
COMMENT ON TABLE notification_batches IS 'Batched notifications for digest emails';
