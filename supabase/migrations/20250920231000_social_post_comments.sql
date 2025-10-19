-- Social feed comments table
CREATE TABLE IF NOT EXISTS public.social_post_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_post_comments_post_created
  ON public.social_post_comments (post_id, created_at);

ALTER TABLE public.social_post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are readable by everyone"
  ON public.social_post_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own comments"
  ON public.social_post_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.social_post_comments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.social_post_comments
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_social_post_comments_updated_at
  BEFORE UPDATE ON public.social_post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.social_post_comments IS 'Commentaires associés aux publications sociales (clé post_id gérée côté frontend).';
