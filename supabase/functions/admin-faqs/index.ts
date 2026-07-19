import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const expected = Deno.env.get("ADMIN_BEARER_TOKEN");
  if (!expected) return json({ error: "Server misconfigured" }, 500);
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("service_location_faqs")
        .select("*")
        .order("service_slug")
        .order("state_slug", { nullsFirst: true })
        .order("county_slug", { nullsFirst: true });
      if (error) return json({ error: error.message }, 400);
      return json({ items: data });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { id, service_slug, state_slug, county_slug, faqs } = body ?? {};
      if (!service_slug || !Array.isArray(faqs)) {
        return json({ error: "service_slug and faqs[] required" }, 400);
      }
      const clean = faqs
        .filter((f: any) => f && typeof f.q === "string" && typeof f.a === "string")
        .map((f: any) => ({ q: f.q.trim(), a: f.a.trim() }))
        .filter((f: any) => f.q && f.a);

      const row = {
        service_slug: String(service_slug).toLowerCase(),
        state_slug: state_slug ? String(state_slug).toLowerCase() : null,
        county_slug: county_slug ? String(county_slug).toLowerCase() : null,
        faqs: clean,
      };

      if (id) {
        const { data, error } = await supabase
          .from("service_location_faqs")
          .update(row)
          .eq("id", id)
          .select()
          .single();
        if (error) return json({ error: error.message }, 400);
        return json({ item: data });
      }

      // upsert by scope
      const { data: existing } = await supabase
        .from("service_location_faqs")
        .select("id")
        .eq("service_slug", row.service_slug)
        .is("state_slug", row.state_slug === null ? null : undefined)
        .is("county_slug", row.county_slug === null ? null : undefined);

      let query = supabase
        .from("service_location_faqs")
        .select("id")
        .eq("service_slug", row.service_slug);
      query = row.state_slug ? query.eq("state_slug", row.state_slug) : query.is("state_slug", null);
      query = row.county_slug ? query.eq("county_slug", row.county_slug) : query.is("county_slug", null);
      const { data: match } = await query.maybeSingle();

      if (match?.id) {
        const { data, error } = await supabase
          .from("service_location_faqs")
          .update(row)
          .eq("id", match.id)
          .select()
          .single();
        if (error) return json({ error: error.message }, 400);
        return json({ item: data });
      }

      const { data, error } = await supabase
        .from("service_location_faqs")
        .insert(row)
        .select()
        .single();
      if (error) return json({ error: error.message }, 400);
      return json({ item: data });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id required" }, 400);
      const { error } = await supabase.from("service_location_faqs").delete().eq("id", id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (e) {
    return json({ error: (e as Error).message }, 400);
  }
});
