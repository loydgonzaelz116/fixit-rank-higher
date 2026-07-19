
CREATE TABLE public.service_location_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text NOT NULL,
  state_slug text,
  county_slug text,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX service_location_faqs_scope_idx
  ON public.service_location_faqs (
    service_slug,
    COALESCE(state_slug, ''),
    COALESCE(county_slug, '')
  );

GRANT SELECT ON public.service_location_faqs TO anon, authenticated;
GRANT ALL ON public.service_location_faqs TO service_role;

ALTER TABLE public.service_location_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read FAQs"
  ON public.service_location_faqs FOR SELECT
  USING (true);

CREATE TRIGGER update_service_location_faqs_updated_at
  BEFORE UPDATE ON public.service_location_faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
