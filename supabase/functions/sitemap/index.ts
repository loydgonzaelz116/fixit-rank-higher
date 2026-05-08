// Dynamic sitemap.xml generator
// Aggregates static pages, calculator pages, and blog posts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://fixitnearme.com";

const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/blog",
  "/free-checklist",
  "/permit-calculator",
  "/calculators",
  "/coming-soon",
];

const TRADES = [
  "plumbing", "electrical", "hvac", "roofing", "painting", "landscaping",
  "fence", "deck", "pressure-washing", "handyman", "tree-service",
  "water-damage", "concrete", "windows", "chimney", "garage-door",
  "flooring", "septic", "insulation", "siding", "foundation",
];

const CITIES = [
  "spokane", "coeur-dalene", "post-falls", "hayden",
  "liberty-lake", "moscow", "pullman",
];

// External Supabase that holds blog_posts (matches src/lib/blog-data.ts)
const BLOG_SUPABASE_URL = "https://pcvotucxbrqbbcjgzsht.supabase.co";
const BLOG_SUPABASE_KEY = "sb_publishable_F7dfp71sttdBRQXrnlEjHg_FG_rUP7p";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function urlEntry(loc: string, lastmod?: string, priority = "0.7", changefreq = "weekly") {
  return `<url><loc>${escape(SITE + loc)}</loc>${
    lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ""
  }<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

Deno.serve(async () => {
  const today = new Date().toISOString().slice(0, 10);
  const entries: string[] = [];

  // Static
  for (const p of STATIC_PATHS) {
    entries.push(urlEntry(p, today, p === "/" ? "1.0" : "0.8", "weekly"));
  }

  // Calculator pages (industry pages)
  for (const t of TRADES) {
    entries.push(urlEntry(`/calculator/${t}`, today, "0.7", "monthly"));
  }

  // Industry × city landing pages (if/when added)
  for (const t of TRADES) {
    for (const c of CITIES) {
      entries.push(urlEntry(`/${t}/${c}`, today, "0.6", "monthly"));
    }
  }

  // Blog posts
  try {
    const supabase = createClient(BLOG_SUPABASE_URL, BLOG_SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(2000);

    for (const p of data ?? []) {
      entries.push(
        urlEntry(`/blog/${p.slug}`, p.updated_at ?? p.created_at, "0.8", "monthly"),
      );
    }
  } catch (e) {
    console.error("blog fetch failed", e);
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "access-control-allow-origin": "*",
    },
  });
});
