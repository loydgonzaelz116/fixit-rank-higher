
-- Enum for image prompt category
DO $$ BEGIN
  CREATE TYPE public.image_prompt_category AS ENUM ('hero', 'process', 'trust');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- image_prompts library
CREATE TABLE public.image_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trade text NOT NULL,
  category public.image_prompt_category NOT NULL,
  visual_description text NOT NULL,
  alt_text_template text NOT NULL,
  aspect_ratio text NOT NULL DEFAULT '16:9',
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_image_prompts_trade_cat ON public.image_prompts (trade, category) WHERE is_active;

ALTER TABLE public.image_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Image prompts are publicly readable"
  ON public.image_prompts FOR SELECT
  USING (true);

CREATE POLICY "Service role manages image prompts"
  ON public.image_prompts FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_image_prompts_updated_at
  BEFORE UPDATE ON public.image_prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- generated_posts drafts
CREATE TABLE public.generated_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  trade text NOT NULL,
  title text NOT NULL DEFAULT '',
  slug text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  body_html text NOT NULL DEFAULT '',
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Local Cost Guides',
  hero_prompt_id uuid REFERENCES public.image_prompts(id),
  process_prompt_id uuid REFERENCES public.image_prompts(id),
  trust_prompt_id uuid REFERENCES public.image_prompts(id),
  hero_image_url text,
  process_image_url text,
  trust_image_url text,
  hero_alt text,
  process_alt text,
  trust_alt text,
  status text NOT NULL DEFAULT 'draft',
  published_post_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages generated posts"
  ON public.generated_posts FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_generated_posts_updated_at
  BEFORE UPDATE ON public.generated_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Content images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'content-images');

CREATE POLICY "Service role manages content images"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'content-images')
  WITH CHECK (bucket_id = 'content-images');

-- Seed: 3 PNW prompts (hero, process, trust) for each of 21 trades
WITH trades(slug, label) AS (VALUES
  ('plumbing','plumbing'),('electrical','electrical work'),('hvac','HVAC'),
  ('roofing','roofing'),('painting','painting'),('landscaping','landscaping'),
  ('fence','fence installation'),('deck','deck building'),('pressure-washing','pressure washing'),
  ('handyman','handyman work'),('tree-service','tree service'),('water-damage','water damage restoration'),
  ('concrete','concrete work'),('windows','window installation'),('chimney','chimney service'),
  ('garage-door','garage door installation'),('flooring','flooring installation'),('septic','septic service'),
  ('insulation','insulation installation'),('siding','siding installation'),('foundation','foundation repair')
)
INSERT INTO public.image_prompts (trade, category, visual_description, alt_text_template)
SELECT slug, 'hero'::public.image_prompt_category,
  'Wide-angle exterior photograph of a craftsman-style home in a Pacific Northwest residential neighborhood ({city} area) showing finished, professional-grade ' || label || '. Cedar shake or lap siding, river-rock pier bases, mature Ponderosa pines and Douglas firs framing the lot, basalt rock retaining wall, damp pavement, soft overcast sky with diffused natural light. An unmarked clean white work truck with ladder rack sits in the driveway. Shot on a 35mm full-frame lens, neutral color grade, no HDR, no lens flare, no logos or branded signage.',
  'Completed ' || label || ' on a craftsman home in a {city} neighborhood'
FROM trades
UNION ALL
SELECT slug, 'process'::public.image_prompt_category,
  'Tight close-up photograph (50mm macro feel) of a contractor''s weathered, gloved hands actively performing ' || label || '. Realistic worn leather work gloves, authentic tool wear, fine material texture (sawdust, sealant, metal shavings as appropriate), slight motion on the active tool. Natural side light from a soft overcast Pacific Northwest sky, no studio lighting, shallow depth of field with the work area in sharp focus. Background falls off softly. No logos, no branded clothing.',
  'Close-up of a {city} contractor performing ' || label
FROM trades
UNION ALL
SELECT slug, 'trust'::public.image_prompt_category,
  'Three-quarter mid-shot of a professional contractor (late 30s, short beard, plain navy work shirt with no visible logo, unbranded ball cap) standing on a front lawn next to a homeowner couple in casual fall layers. All three are looking up and to the right toward the completed ' || label || ' work — none face the camera. The contractor holds a clipboard with a printed inspection checklist. Damp grass, fallen maple leaves, soft late-afternoon overcast Pacific Northwest light. Candid documentary feel, no posed handshake clichés, natural skin tones, no logos.',
  'Local contractor reviewing completed ' || label || ' with homeowners outside their {city} home'
FROM trades;
