# Content Machine Plan

Build an admin-only "Content Machine" that pairs a curated PNW image-prompt library with a blog-generation flow. Pick a City + Trade, generate post copy + auto-select matching imagery, preview, then publish to the existing `blog_posts` table.

## 1. Database changes (one migration)

**New table: `image_prompts`** — the PNW prompt library.
- Fields: `trade` (text), `category` (enum: `hero` | `process` | `trust`), `visual_description` (text), `alt_text_template` (text, supports `{city}` token), `aspect_ratio` (text, default `16:9`), `is_active` (bool), `notes` (text)
- RLS: public SELECT (so the generator can read without auth); writes via service role only (admin edge functions).
- Seed with 3 prompts (hero/process/trust) for each of the 21 existing trade slugs = 63 rows, all using the PNW aesthetic (craftsman homes, evergreens, overcast light, unbranded trucks) we've been writing.

**New table: `generated_posts`** — drafts before publishing.
- Fields: `city`, `trade`, `title`, `slug`, `outline` (jsonb), `body_md` (text), `meta_title`, `meta_description`, `hero_prompt_id`, `process_prompt_id`, `trust_prompt_id`, `hero_image_url`, `process_image_url`, `trust_image_url`, `status` (`draft` | `published`), `published_post_id` (nullable fk to blog_posts).
- RLS: service role only. Admin UI reads/writes via edge function gated by `ADMIN_BEARER_TOKEN`.

(`blog_posts` is unchanged — published output continues to land there so the public Blog page keeps working.)

## 2. Edge functions

**`content-machine-generate`** (POST, admin-bearer protected)
- Input: `{ city, trade }`
- Steps:
  1. Validate inputs (Zod). Trade must be one of the 21 known slugs.
  2. Pull one `hero` + one `process` + one `trust` prompt for that trade from `image_prompts` (random active row per category).
  3. Call Lovable AI Gateway (`google/gemini-2.5-flash`) with a structured prompt to produce: SEO title, slug, meta description, 600–900 word markdown body with H2 sections (Cost factors, What locals actually pay, Red flags, How to hire), and an excerpt. City + trade are interpolated.
  4. Call Lovable AI Gateway image model (`google/gemini-2.5-flash-image`) three times using each selected prompt's `visual_description` (city interpolated). Return base64.
  5. Upload the 3 images to a new `content-images` storage bucket (public). Store URLs.
  6. Insert into `generated_posts` as `draft` and return the row.

**`content-machine-publish`** (POST, admin-bearer protected)
- Input: `{ generated_post_id }`
- Copies the draft into `blog_posts` (mapping `hero_image_url` → `featured_image`, body to `content`, etc.), sets `published_post_id`, flips status to `published`.

(No changes to existing `admin-create-post`.)

## 3. Storage

- New public bucket `content-images` for the generated hero/process/trust images.

## 4. Admin UI

**New route: `/admin/content-machine`** (gated by the same bearer-token pattern used in `AdminBlogEditor` / `AdminNewPost`).
- Form: City dropdown (Spokane, Coeur d'Alene, Post Falls, Hayden, Liberty Lake, Sandpoint — editable), Trade dropdown (the 21 slugs), "Generate" button.
- While generating: skeleton preview.
- Result panel: editable fields (title, meta, body markdown via textarea), 3 image cards each showing the selected prompt + generated image with a "Regenerate this image" button (calls generate function with a `regenerate: 'hero'|'process'|'trust'` flag — handled by re-calling the same function in single-image mode).
- "Publish" button → calls `content-machine-publish`, then routes to `/blog/[slug]`.
- "Save draft" button → updates `generated_posts` row.

**New route: `/admin/prompts`** — simple table view of `image_prompts` (read-only list filterable by trade/category) so I can audit what the library contains. Editing prompts stays out of scope for v1 (seeded once via migration).

Add both routes to `App.tsx`. Add an "Admin" disclosure in the existing admin pages linking between Blog / New Post / Content Machine / Prompts (no public nav entry).

## 5. Wiring

- `Calculators.tsx` and public site are untouched.
- Published posts appear automatically on `/blog` because they live in `blog_posts`.
- `BlogPost.tsx` already renders `featured_image`, `content`, `meta_*` — no changes needed; the generator writes markdown that the existing renderer handles (verify it does; if not, add a tiny markdown→HTML pass in `BlogPost.tsx`).

## Technical details

```text
/admin/content-machine
   │  City + Trade
   ▼
content-machine-generate (edge)
   ├── pick prompts  ──►  image_prompts (SELECT)
   ├── LLM copy      ──►  Lovable AI (gemini-2.5-flash)
   ├── 3× image gen  ──►  Lovable AI (gemini-2.5-flash-image)
   ├── upload        ──►  storage: content-images
   └── insert        ──►  generated_posts (draft)
   ▼
   preview + edit
   ▼
content-machine-publish (edge)
   └── insert        ──►  blog_posts (published)
                          ▼
                        /blog/[slug]  (public, unchanged)
```

- Auth: both edge functions require `Authorization: Bearer ${ADMIN_BEARER_TOKEN}` (already a project secret); functions deployed with `verify_jwt = false` and validate the bearer in code, matching the existing `admin-create-post` pattern.
- Models: `google/gemini-2.5-flash` for copy (fast + cheap), `google/gemini-2.5-flash-image` for visuals (Nano Banana). Both go through the AI Gateway with `LOVABLE_API_KEY` (already a secret).
- City interpolation happens server-side: prompt strings contain `{city}`; the function does `.replaceAll('{city}', city)` before sending to the image model and before saving alt text.
- Slug generation: `${trade}-${citySlug}-cost-2026` with collision suffix.
- No changes to `src/integrations/supabase/{client,types}.ts` (auto-generated post-migration).

## Out of scope (v1)

- Editing/adding prompts in the UI (seed-only).
- Auto-scheduling / bulk generation queues.
- Multi-language support.
- Revisioning generated drafts.