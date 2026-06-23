
CREATE TABLE public.industry_calculator_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trade text NOT NULL,
  zip_code text NOT NULL,
  region_tier text NOT NULL,
  modifier numeric NOT NULL,
  base_low numeric NOT NULL,
  base_high numeric NOT NULL,
  estimate_low numeric NOT NULL,
  estimate_high numeric NOT NULL,
  selections jsonb NOT NULL DEFAULT '{}'::jsonb,
  name text,
  email text,
  phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.industry_calculator_leads TO anon, authenticated;
GRANT ALL ON public.industry_calculator_leads TO service_role;

ALTER TABLE public.industry_calculator_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit calculator leads"
  ON public.industry_calculator_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role full access"
  ON public.industry_calculator_leads FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_industry_calculator_leads_updated_at
  BEFORE UPDATE ON public.industry_calculator_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_calc_leads_trade ON public.industry_calculator_leads(trade);
CREATE INDEX idx_calc_leads_zip ON public.industry_calculator_leads(zip_code);
