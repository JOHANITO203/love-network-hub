-- ============================================================================
-- RUSSIAN PAYMENT SYSTEM FOR МОЙDATE (YooMoney Integration)
-- ============================================================================

-- 1. SUBSCRIPTION PLANS TABLE
CREATE TABLE public.subscription_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_ru text NOT NULL,
  description text,
  description_ru text,
  price_rub decimal(10,2) NOT NULL,
  price_usd decimal(10,2), -- For reference
  duration_days integer NOT NULL,
  features jsonb NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert subscription plans
INSERT INTO public.subscription_plans (id, name, name_ru, description, description_ru, price_rub, price_usd, duration_days, features, sort_order) VALUES
('basic_monthly', 'Basic Monthly', 'Базовый Месячный', 'Basic features for casual dating', 'Базовые функции для знакомств', 499.00, 5.99, 30,
 '{"unlimited_likes": true, "super_likes_per_day": 5, "rewind_feature": true, "boost_per_month": 0, "priority_support": false}', 1),

('premium_monthly', 'Premium Monthly', 'Премиум Месячный', 'Advanced features and priority matching', 'Расширенные возможности и приоритетный подбор', 999.00, 11.99, 30,
 '{"unlimited_likes": true, "super_likes_per_day": 20, "rewind_feature": true, "boost_per_month": 2, "priority_support": true, "advanced_filters": true, "read_receipts": true, "incognito_mode": true}', 2),

('premium_yearly', 'Premium Yearly', 'Премиум Годовой', 'Best value - Premium features for a full year', 'Лучшее предложение - функции Премиум на год', 7999.00, 95.99, 365,
 '{"unlimited_likes": true, "super_likes_per_day": 20, "rewind_feature": true, "boost_per_month": 3, "priority_support": true, "advanced_filters": true, "read_receipts": true, "incognito_mode": true, "profile_boost": true}', 3),

('vip_monthly', 'VIP Monthly', 'VIP Месячный', 'Ultimate dating experience', 'Максимальные возможности для знакомств', 1999.00, 23.99, 30,
 '{"unlimited_likes": true, "super_likes_per_day": 50, "rewind_feature": true, "boost_per_month": 5, "priority_support": true, "advanced_filters": true, "read_receipts": true, "incognito_mode": true, "profile_boost": true, "priority_matching": true, "ai_conversation_coach": true}', 4);

-- 2. USER SUBSCRIPTIONS TABLE
CREATE TABLE public.user_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id text REFERENCES public.subscription_plans(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'refunded', 'failed')),
  payment_method text DEFAULT 'yoomoney' CHECK (payment_method IN ('yoomoney', 'sberbank', 'tinkoff', 'qiwi', 'webmoney', 'card')),
  yoomoney_payment_id text, -- YooMoney specific payment ID
  external_payment_id text, -- Other payment system IDs
  amount_rub decimal(10,2) NOT NULL,
  currency text DEFAULT 'RUB' CHECK (currency IN ('RUB', 'USD', 'EUR')),
  starts_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  cancelled_at timestamp with time zone,
  auto_renew boolean DEFAULT true,
  payment_metadata jsonb, -- Store payment system specific data
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_expires ON public.user_subscriptions(expires_at);
CREATE INDEX idx_user_subscriptions_payment_id ON public.user_subscriptions(yoomoney_payment_id);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- 3. PAYMENT TRANSACTIONS TABLE
CREATE TABLE public.payment_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES public.user_subscriptions(id),
  transaction_type text NOT NULL CHECK (transaction_type IN ('subscription', 'boost', 'super_likes', 'refund')),
  payment_system text NOT NULL CHECK (payment_system IN ('yoomoney', 'sberbank', 'tinkoff', 'qiwi', 'webmoney')),
  external_transaction_id text NOT NULL,
  amount_rub decimal(10,2) NOT NULL,
  currency text DEFAULT 'RUB',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_method_details jsonb, -- Card type, wallet info, etc.
  raw_response jsonb, -- Full payment system response
  error_message text,
  processed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_external_id ON public.payment_transactions(external_transaction_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_transactions_created ON public.payment_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.payment_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- 4. ADD PREMIUM FEATURES TO PROFILES
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS premium_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS premium_features jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS boost_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS super_likes_remaining integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_super_likes_reset_at timestamp with time zone DEFAULT date_trunc('day', now() + interval '1 day');

-- 5. FUNCTION TO CHECK USER PREMIUM STATUS
CREATE OR REPLACE FUNCTION public.get_user_premium_status()
RETURNS TABLE (
  is_premium boolean,
  plan_id text,
  plan_name text,
  expires_at timestamp with time zone,
  features jsonb,
  days_remaining integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_subscription record;
BEGIN
  -- Get current active subscription
  SELECT us.*, sp.name, sp.features
  INTO current_subscription
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = auth.uid()
    AND us.status = 'active'
    AND us.expires_at > now()
  ORDER BY us.expires_at DESC
  LIMIT 1;

  IF FOUND THEN
    RETURN QUERY
    SELECT
      true as is_premium,
      current_subscription.plan_id,
      current_subscription.name as plan_name,
      current_subscription.expires_at,
      current_subscription.features,
      EXTRACT(day FROM current_subscription.expires_at - now())::integer as days_remaining;
  ELSE
    RETURN QUERY
    SELECT
      false as is_premium,
      NULL::text as plan_id,
      NULL::text as plan_name,
      NULL::timestamp with time zone as expires_at,
      '{}'::jsonb as features,
      0 as days_remaining;
  END IF;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_premium_status TO authenticated;

-- 6. FUNCTION TO CREATE YOOMONEY PAYMENT
CREATE OR REPLACE FUNCTION public.create_yoomoney_payment(
  plan_id_param text,
  return_url_param text DEFAULT 'https://moydate.ru/payment/success',
  notification_url_param text DEFAULT 'https://moydate.ru/api/yoomoney/webhook'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  plan_record record;
  subscription_id uuid;
  payment_data jsonb;
BEGIN
  -- Get plan details
  SELECT * INTO plan_record
  FROM public.subscription_plans
  WHERE id = plan_id_param AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or inactive subscription plan';
  END IF;

  -- Create subscription record
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_id,
    amount_rub,
    expires_at,
    status
  )
  VALUES (
    auth.uid(),
    plan_id_param,
    plan_record.price_rub,
    now() + (plan_record.duration_days || ' days')::interval,
    'pending'
  )
  RETURNING id INTO subscription_id;

  -- Prepare payment data for YooMoney
  payment_data := jsonb_build_object(
    'subscription_id', subscription_id,
    'amount', plan_record.price_rub,
    'currency', 'RUB',
    'description', 'МойDate ' || plan_record.name_ru,
    'return_url', return_url_param,
    'notification_url', notification_url_param,
    'metadata', jsonb_build_object(
      'user_id', auth.uid(),
      'plan_id', plan_id_param,
      'subscription_id', subscription_id
    )
  );

  RETURN payment_data;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_yoomoney_payment TO authenticated;

-- 7. FUNCTION TO PROCESS PAYMENT WEBHOOK
CREATE OR REPLACE FUNCTION public.process_payment_webhook(
  webhook_data jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  subscription_record record;
  transaction_id uuid;
BEGIN
  -- Extract subscription ID from webhook data
  SELECT * INTO subscription_record
  FROM public.user_subscriptions
  WHERE id = (webhook_data->'metadata'->>'subscription_id')::uuid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found for webhook data';
  END IF;

  -- Create transaction record
  INSERT INTO public.payment_transactions (
    user_id,
    subscription_id,
    transaction_type,
    payment_system,
    external_transaction_id,
    amount_rub,
    status,
    payment_method_details,
    raw_response,
    processed_at
  )
  VALUES (
    subscription_record.user_id,
    subscription_record.id,
    'subscription',
    'yoomoney',
    webhook_data->>'id',
    (webhook_data->'amount'->>'value')::decimal,
    CASE
      WHEN webhook_data->>'status' = 'succeeded' THEN 'completed'
      WHEN webhook_data->>'status' = 'canceled' THEN 'cancelled'
      ELSE 'failed'
    END,
    webhook_data->'payment_method',
    webhook_data,
    now()
  )
  RETURNING id INTO transaction_id;

  -- Update subscription status if payment succeeded
  IF webhook_data->>'status' = 'succeeded' THEN
    UPDATE public.user_subscriptions
    SET
      status = 'active',
      yoomoney_payment_id = webhook_data->>'id',
      payment_metadata = webhook_data,
      updated_at = now()
    WHERE id = subscription_record.id;

    -- Update user premium status
    UPDATE public.profiles
    SET
      is_premium = true,
      premium_expires_at = subscription_record.expires_at,
      premium_features = (
        SELECT features FROM public.subscription_plans
        WHERE id = subscription_record.plan_id
      ),
      updated_at = now()
    WHERE user_id = subscription_record.user_id;

    -- Send notification
    PERFORM public.send_notification(
      subscription_record.user_id,
      'subscription_activated',
      'Подписка активирована! 🎉',
      'Ваша премиум подписка МойDate успешно активирована. Наслаждайтесь всеми возможностями!',
      jsonb_build_object('subscription_id', subscription_record.id, 'plan_id', subscription_record.plan_id)
    );

  ELSE
    -- Payment failed, update subscription
    UPDATE public.user_subscriptions
    SET
      status = 'failed',
      updated_at = now()
    WHERE id = subscription_record.id;
  END IF;

  RETURN true;
END;
$$;

-- Grant execute permission to service role for webhooks
GRANT EXECUTE ON FUNCTION public.process_payment_webhook TO service_role;

-- 8. FUNCTION TO CHECK PREMIUM FEATURE ACCESS
CREATE OR REPLACE FUNCTION public.can_use_premium_feature(
  feature_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_premium_features jsonb;
BEGIN
  SELECT premium_features INTO user_premium_features
  FROM public.profiles
  WHERE user_id = auth.uid()
    AND is_premium = true
    AND premium_expires_at > now();

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if feature is available in user's plan
  RETURN COALESCE((user_premium_features->>feature_name)::boolean, false);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.can_use_premium_feature TO authenticated;

-- 9. CREATE VIEW FOR ACTIVE SUBSCRIPTIONS
CREATE OR REPLACE VIEW public.active_subscriptions AS
SELECT
  us.id,
  us.user_id,
  us.plan_id,
  sp.name,
  sp.name_ru,
  sp.features,
  us.amount_rub,
  us.starts_at,
  us.expires_at,
  us.auto_renew,
  EXTRACT(day FROM us.expires_at - now())::integer as days_remaining
FROM public.user_subscriptions us
JOIN public.subscription_plans sp ON us.plan_id = sp.id
WHERE us.status = 'active'
  AND us.expires_at > now()
  AND us.user_id = auth.uid();

-- Grant access to the view
GRANT SELECT ON public.active_subscriptions TO authenticated;

-- 10. TRIGGER TO UPDATE PREMIUM STATUS
CREATE OR REPLACE FUNCTION public.update_premium_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Expire premium for users whose subscriptions have ended
  UPDATE public.profiles
  SET
    is_premium = false,
    premium_expires_at = NULL,
    premium_features = '{}',
    updated_at = now()
  WHERE is_premium = true
    AND premium_expires_at < now();

  -- Update daily super likes
  UPDATE public.profiles
  SET
    super_likes_remaining = COALESCE(
      (premium_features->>'super_likes_per_day')::integer,
      1 -- Free users get 1 super like per day
    ),
    daily_super_likes_reset_at = date_trunc('day', now() + interval '1 day')
  WHERE daily_super_likes_reset_at < now();
END;
$$;

-- Grant execute permission to service role for scheduled tasks
GRANT EXECUTE ON FUNCTION public.update_premium_status TO service_role;

COMMENT ON MIGRATION IS 'Russian payment system integration with YooMoney for МойDate subscription management';