
-- 1. image_prompts: remove public read access
DROP POLICY IF EXISTS "Image prompts are publicly readable" ON public.image_prompts;

-- 2. storage: drop overly-broad public listing policy on content-images bucket
DROP POLICY IF EXISTS "Content images are publicly readable" ON storage.objects;

-- 3. Replace permissive INSERT policies with basic validation in WITH CHECK
DROP POLICY IF EXISTS "Anyone can insert email captures" ON public.email_captures;
CREATE POLICY "Anyone can insert email captures"
  ON public.email_captures FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(email) BETWEEN 3 AND 255
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(first_name) BETWEEN 1 AND 100
  );

DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone can insert contact submissions"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(email) BETWEEN 3 AND 255
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(name) BETWEEN 1 AND 100
    AND (message IS NULL OR length(message) <= 5000)
    AND (city IS NULL OR length(city) <= 100)
    AND (business_type IS NULL OR length(business_type) <= 100)
  );

DROP POLICY IF EXISTS "Anyone can insert waitlist entries" ON public.contractor_waitlist;
CREATE POLICY "Anyone can insert waitlist entries"
  ON public.contractor_waitlist FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(email) BETWEEN 3 AND 255
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(name) BETWEEN 1 AND 100
    AND length(city) BETWEEN 1 AND 100
    AND (trade IS NULL OR length(trade) <= 100)
  );

DROP POLICY IF EXISTS "Anyone can submit calculator leads" ON public.industry_calculator_leads;
CREATE POLICY "Anyone can submit calculator leads"
  ON public.industry_calculator_leads FOR INSERT TO anon, authenticated
  WITH CHECK (
    zip_code ~ '^\d{5}$'
    AND length(trade) BETWEEN 1 AND 100
    AND (email IS NULL OR (length(email) <= 255 AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
    AND (name IS NULL OR length(name) <= 100)
    AND (phone IS NULL OR length(phone) <= 30)
    AND (notes IS NULL OR length(notes) <= 2000)
  );

DROP POLICY IF EXISTS "Anyone can submit a programmatic calculator lead" ON public.programmatic_calculator_leads;
CREATE POLICY "Anyone can submit a programmatic calculator lead"
  ON public.programmatic_calculator_leads FOR INSERT TO anon, authenticated
  WITH CHECK (
    zip_code ~ '^\d{5}$'
    AND length(industry) BETWEEN 1 AND 100
    AND length(full_name) BETWEEN 1 AND 100
    AND length(phone) BETWEEN 5 AND 30
    AND length(email) BETWEEN 3 AND 255
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );
