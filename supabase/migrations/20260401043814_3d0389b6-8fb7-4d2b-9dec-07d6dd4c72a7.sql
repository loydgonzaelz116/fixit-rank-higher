
-- Remove overly permissive SELECT policies on PII tables
DROP POLICY IF EXISTS "Authenticated users can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can read email captures" ON public.email_captures;

-- Remove overly permissive INSERT/UPDATE policies on blog_posts
-- (posts are created via edge function using service role key, which bypasses RLS)
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
