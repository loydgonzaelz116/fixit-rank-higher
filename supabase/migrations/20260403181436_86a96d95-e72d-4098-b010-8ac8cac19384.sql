CREATE TABLE public.contractor_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  trade TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contractor_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert waitlist entries"
  ON public.contractor_waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
