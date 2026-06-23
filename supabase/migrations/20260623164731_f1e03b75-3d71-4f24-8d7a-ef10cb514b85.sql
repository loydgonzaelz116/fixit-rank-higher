
CREATE TABLE public.programmatic_calculator_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry text NOT NULL,
  zip_code text NOT NULL,
  region_tier text,
  modifier numeric,
  area_sqft numeric,
  project_type text,
  thickness_inches numeric,
  board_feet numeric,
  estimate_low numeric,
  estimate_high numeric,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.programmatic_calculator_leads TO anon, authenticated;
GRANT ALL ON public.programmatic_calculator_leads TO service_role;

ALTER TABLE public.programmatic_calculator_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a programmatic calculator lead"
  ON public.programmatic_calculator_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role manages programmatic calculator leads"
  ON public.programmatic_calculator_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
