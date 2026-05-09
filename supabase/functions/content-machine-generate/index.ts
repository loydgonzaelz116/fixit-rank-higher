import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRADES = new Set([
  "plumbing","electrical","hvac","roofing","painting","landscaping","fence","deck",
  "pressure-washing","handyman","tree-service","water-damage","concrete","windows",
  "chimney","garage-door","flooring","septic","insulation","siding","foundation",
]);

type Category = "hero" | "process" | "trust";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function generateImage(prompt: string, apiKey: string): Promise<Uint8Array | null> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) {
    console.error("image gen failed", res.status, await res.text());
    return null;
  }
  const data = await res.json();
  const url: string | undefined = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url?.startsWith("data:")) return null;
  const b64 = url.split(",")[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function generateCopy(city: string, trade: string, apiKey: string) {
  const sys = `You are an expert local-SEO copywriter for FixItNearMe, covering Spokane WA and North Idaho home services. Write in a trustworthy, blue-collar professional tone. Always cite that prices are high-end estimates so readers aren't caught off guard. Output strict JSON only.`;
  const user = `Write a cost guide article for "${trade.replace(/-/g, " ")}" in ${city}. 600-900 words. Output JSON with keys: title (60 chars max, includes city + trade + "Cost"), slug (kebab-case, include city and trade), excerpt (160 chars max), meta_title (60 chars), meta_description (155 chars), body_html. body_html must use <h2>, <p>, <ul>, <li>, <strong>. Include H2 sections: "What ${trade.replace(/-/g, " ")} actually costs in ${city}", "Cost factors that move the price", "Red flags when hiring", "How to get an honest quote". No <h1>. No markdown. JSON only.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`AI copy gen failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(content);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const expected = Deno.env.get("ADMIN_BEARER_TOKEN");
  if (!expected) return json(500, { error: "Server misconfigured" });
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${expected}`) return json(401, { error: "Unauthorized" });

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json(500, { error: "Missing LOVABLE_API_KEY" });

  let payload: { city?: string; trade?: string; regenerate_image?: Category; generated_post_id?: string };
  try { payload = await req.json(); } catch { return json(400, { error: "Invalid JSON" }); }

  const city = (payload.city ?? "").trim();
  const trade = (payload.trade ?? "").trim();
  if (!city || city.length > 80) return json(400, { error: "Invalid city" });
  if (!TRADES.has(trade)) return json(400, { error: "Invalid trade" });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // ---------- Single-image regenerate path ----------
  if (payload.regenerate_image && payload.generated_post_id) {
    const cat = payload.regenerate_image;
    const { data: post, error: postErr } = await supabase
      .from("generated_posts").select("*").eq("id", payload.generated_post_id).single();
    if (postErr || !post) return json(404, { error: "Draft not found" });

    // Pick a fresh prompt from the library
    const { data: prompts } = await supabase
      .from("image_prompts").select("*").eq("trade", trade).eq("category", cat).eq("is_active", true);
    if (!prompts?.length) return json(400, { error: `No ${cat} prompts for ${trade}` });
    const chosen = prompts[Math.floor(Math.random() * prompts.length)];

    const description = chosen.visual_description.replaceAll("{city}", city);
    const altText = chosen.alt_text_template.replaceAll("{city}", city);
    const bytes = await generateImage(description, apiKey);
    if (!bytes) return json(502, { error: "Image generation failed" });

    const path = `${post.id}/${cat}-${Date.now()}.png`;
    const { error: upErr } = await supabase.storage.from("content-images")
      .upload(path, bytes, { contentType: "image/png", upsert: true });
    if (upErr) return json(500, { error: `Upload failed: ${upErr.message}` });
    const { data: pub } = supabase.storage.from("content-images").getPublicUrl(path);

    const update: Record<string, unknown> = {
      [`${cat}_prompt_id`]: chosen.id,
      [`${cat}_image_url`]: pub.publicUrl,
      [`${cat}_alt`]: altText,
    };
    const { data: updated, error: updErr } = await supabase
      .from("generated_posts").update(update).eq("id", post.id).select().single();
    if (updErr) return json(500, { error: updErr.message });
    return json(200, { post: updated });
  }

  // ---------- Full generate path ----------
  try {
    // 1) Pick one prompt per category
    const { data: prompts, error: pErr } = await supabase
      .from("image_prompts").select("*").eq("trade", trade).eq("is_active", true);
    if (pErr) throw pErr;
    const pickRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    const byCat = (c: Category) => {
      const subset = (prompts ?? []).filter((p: any) => p.category === c);
      if (!subset.length) throw new Error(`No ${c} prompts for ${trade}`);
      return pickRandom(subset);
    };
    const hero = byCat("hero");
    const process = byCat("process");
    const trust = byCat("trust");

    // 2) Generate copy
    const copy = await generateCopy(city, trade, apiKey);
    const title = String(copy.title ?? `${trade} cost in ${city}`).slice(0, 120);
    const slug = slugify(String(copy.slug ?? `${trade}-${slugify(city)}-cost`)) || `${trade}-${slugify(city)}-cost`;
    const excerpt = String(copy.excerpt ?? "").slice(0, 280);
    const meta_title = String(copy.meta_title ?? title).slice(0, 70);
    const meta_description = String(copy.meta_description ?? excerpt).slice(0, 200);
    const body_html = String(copy.body_html ?? "");

    // 3) Insert draft (so we have an id for image paths)
    const { data: draft, error: dErr } = await supabase
      .from("generated_posts").insert({
        city, trade, title, slug, excerpt, body_html, meta_title, meta_description,
        hero_prompt_id: hero.id, process_prompt_id: process.id, trust_prompt_id: trust.id,
      }).select().single();
    if (dErr) throw dErr;

    // 4) Generate 3 images in parallel
    const cats: Array<{ cat: Category; prompt: any }> = [
      { cat: "hero", prompt: hero }, { cat: "process", prompt: process }, { cat: "trust", prompt: trust },
    ];
    const results = await Promise.all(cats.map(async ({ cat, prompt }) => {
      const desc = prompt.visual_description.replaceAll("{city}", city);
      const alt = prompt.alt_text_template.replaceAll("{city}", city);
      const bytes = await generateImage(desc, apiKey);
      if (!bytes) return { cat, url: null, alt };
      const path = `${draft.id}/${cat}-${Date.now()}.png`;
      const { error: upErr } = await supabase.storage.from("content-images")
        .upload(path, bytes, { contentType: "image/png", upsert: true });
      if (upErr) { console.error("upload err", cat, upErr); return { cat, url: null, alt }; }
      const { data: pub } = supabase.storage.from("content-images").getPublicUrl(path);
      return { cat, url: pub.publicUrl, alt };
    }));

    const update: Record<string, unknown> = {};
    for (const r of results) {
      update[`${r.cat}_image_url`] = r.url;
      update[`${r.cat}_alt`] = r.alt;
    }
    const { data: final, error: fErr } = await supabase
      .from("generated_posts").update(update).eq("id", draft.id).select().single();
    if (fErr) throw fErr;

    return json(200, { post: final });
  } catch (e) {
    console.error("generate error", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return json(500, { error: msg });
  }
});
