
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS meta_title text;

-- Add service role full access policy
CREATE POLICY "Service role has full access to blog_posts"
  ON public.blog_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
