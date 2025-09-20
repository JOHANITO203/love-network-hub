-- Create table for user preferences
CREATE TABLE public.user_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  min_age integer DEFAULT 18,
  max_age integer DEFAULT 50,
  max_distance integer DEFAULT 50, -- in kilometers
  interested_in text[] DEFAULT ARRAY['all'], -- 'men', 'women', 'all'
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for user interactions (likes/passes)
CREATE TABLE public.user_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'pass', 'super_like')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);

-- Create table for matches
CREATE TABLE public.matches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user2_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  matched_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  last_message_at timestamp with time zone,
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id) -- Ensure consistent ordering
);

-- Enable RLS on all tables
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can view and manage their own preferences" 
ON public.user_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for user_interactions
CREATE POLICY "Users can view their own interactions" 
ON public.user_interactions 
FOR SELECT 
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create their own interactions" 
ON public.user_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = from_user_id);

-- RLS Policies for matches
CREATE POLICY "Users can view their own matches" 
ON public.matches 
FOR ALL 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Add triggers for updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create matches when both users like each other
CREATE OR REPLACE FUNCTION public.check_for_match()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only check for matches on 'like' interactions
  IF NEW.interaction_type = 'like' THEN
    -- Check if the other user has also liked this user
    IF EXISTS (
      SELECT 1 FROM public.user_interactions 
      WHERE from_user_id = NEW.to_user_id 
      AND to_user_id = NEW.from_user_id 
      AND interaction_type = 'like'
    ) THEN
      -- Create a match (ensure consistent ordering)
      INSERT INTO public.matches (user1_id, user2_id)
      VALUES (
        LEAST(NEW.from_user_id, NEW.to_user_id),
        GREATEST(NEW.from_user_id, NEW.to_user_id)
      )
      ON CONFLICT (user1_id, user2_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic match creation
CREATE TRIGGER create_match_trigger
  AFTER INSERT ON public.user_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.check_for_match();