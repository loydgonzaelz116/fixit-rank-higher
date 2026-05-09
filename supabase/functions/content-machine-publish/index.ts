import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const expected = Deno.env.get("ADMIN_BEARER_TOKEN");
  if (!expected) return json(500, { error: "Server misconfigured" });
  if (req.headers.get("Authorization") !== `Bearer ${expected}`) return json(401, { error: "Unauthorized" });

  let body: { generated_post_id?: string; overrides?: Record<string, string> };
  try { body = await req.json(); } catch { return json(400, { error: "Invalid JSON" }); }
  if (!body.generated_post_id) return json(400, { error: "generated_post_id required" });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: draft, error: dErr } = await supabase
    .from("generated_posts").select("*").eq("id", body.generated_post_id).single();
  if (dErr || !draft) return json(404, { error: "Draft not found" });

  const o = body.overrides ?? {};
  const title = o.title ?? draft.title;
  const slug = o.slug ?? draft.slug;
  const excerpt = o.excerpt ?? draft.excerpt;
  const body_html = o.body_html ?? draft.body_html;
  const meta_title = o.meta_title ?? draft.meta_title;
  const meta_description = o.meta_description ?? draft.meta_description;
  const hero_image_url = o.hero_image_url ?? draft.hero_image_url ?? "";

  // Build full content with hero image embedded + a process & trust image inline
  const heroBlock = hero_image_url
    ? `<img src="${hero_image_url}" alt="${draft.hero_alt ?? title}" loading="eager" style="width:100%;border-radius:8px;margin-bottom:1.5rem;" />`
    : "";
  const processBlock = draft.process_image_url
    ? `<figure style="margin:2rem 0;"><img src="${draft.process_image_url}" alt="${draft.process_alt ?? ""}" loading="lazy" style="width:100%;border-radius:8px;" /><figcaption style="font-size:0.85rem;color:#64748b;margin-top:0.5rem;">${draft.process_alt ?? ""}</figcaption></figure>`
    : "";
  const trustBlock = draft.trust_image_url
    ? `<figure style="margin:2rem 0;"><img src="${draft.trust_image_url}" alt="${draft.trust_alt ?? ""}" loading="lazy" style="width:100%;border-radius:8px;" /><figcaption style="font-size:0.85rem;color:#64748b;margin-top:0.5rem;">${draft.trust_alt ?? ""}</figcaption></figure>`
    : "";

  // Insert process image after first </h2> block, trust before last </h2> block
  let composed = body_html;
  const firstH2End = composed.indexOf("</h2>");
  if (firstH2End >= 0 && processBlock) {
    composed = composed.slice(0, firstH2End + 5) + processBlock + composed.slice(firstH2End + 5);
  }
  if (trustBlock) composed = composed + trustBlock;

  const fullContent = heroBlock + composed;

  const { data: post, error: insErr } = await supabase
    .from("blog_posts").insert({
      title, slug, content: fullContent,
      category: draft.category || "Local Cost Guides",
      featured_image: hero_image_url,
      meta_title, meta_description,
      excerpt: excerpt || title,
      city: draft.city,
      author: "FixItNearMe Team",
      read_time: `${Math.max(2, Math.ceil((fullContent.replace(/<[^>]*>/g, "").split(/\s+/).length) / 200))} min`,
      status: "published",
    }).select("id, slug").single();

  if (insErr) return json(400, { error: insErr.message });

  await supabase.from("generated_posts")
    .update({ status: "published", published_post_id: post.id }).eq("id", draft.id);

  return json(200, { success: true, slug: post.slug });
});
