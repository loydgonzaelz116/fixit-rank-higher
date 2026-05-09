import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/SEOHead";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const GEN_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/content-machine-generate`;
const PUB_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/content-machine-publish`;

const TRADES = [
  "plumbing","electrical","hvac","roofing","painting","landscaping","fence","deck",
  "pressure-washing","handyman","tree-service","water-damage","concrete","windows",
  "chimney","garage-door","flooring","septic","insulation","siding","foundation",
];

const CITIES = [
  "Spokane","Spokane Valley","Coeur d'Alene","Post Falls","Hayden","Liberty Lake","Sandpoint","Rathdrum",
];

type Draft = {
  id: string;
  city: string;
  trade: string;
  title: string;
  slug: string;
  excerpt: string;
  body_html: string;
  meta_title: string;
  meta_description: string;
  hero_image_url: string | null;
  process_image_url: string | null;
  trust_image_url: string | null;
  hero_alt: string | null;
  process_alt: string | null;
  trust_alt: string | null;
};

export default function AdminContentMachine() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => sessionStorage.getItem("admin_token") || "");
  const [authed, setAuthed] = useState(false);
  const [city, setCity] = useState(CITIES[0]);
  const [trade, setTrade] = useState(TRADES[0]);
  const [loading, setLoading] = useState(false);
  const [regen, setRegen] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      sessionStorage.setItem("admin_token", token.trim());
      setAuthed(true);
    }
  };

  const generate = async () => {
    setErr(null); setOk(null); setLoading(true); setDraft(null);
    try {
      const res = await fetch(GEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ city, trade }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setDraft(data.post);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
    }
    setLoading(false);
  };

  const regenerateImage = async (cat: "hero" | "process" | "trust") => {
    if (!draft) return;
    setRegen(cat); setErr(null);
    try {
      const res = await fetch(GEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ city, trade, generated_post_id: draft.id, regenerate_image: cat }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Regenerate failed");
      setDraft(data.post);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
    }
    setRegen(null);
  };

  const publish = async () => {
    if (!draft) return;
    setPublishing(true); setErr(null); setOk(null);
    try {
      const res = await fetch(PUB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          generated_post_id: draft.id,
          overrides: {
            title: draft.title, slug: draft.slug, excerpt: draft.excerpt,
            body_html: draft.body_html, meta_title: draft.meta_title,
            meta_description: draft.meta_description,
            hero_image_url: draft.hero_image_url ?? "",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setOk(`Published! /blog/${data.slug}`);
      setDraft(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
    }
    setPublishing(false);
  };

  if (!authed) {
    return (
      <>
        <SEOHead title="Admin Login" description="Admin authentication" path="/admin/content-machine" />
        <section className="container py-20 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-extrabold mb-2">Admin Access</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter your bearer token to continue.</p>
          <form onSubmit={login} className="space-y-4">
            <Input type="password" placeholder="Bearer token" value={token} onChange={(e) => setToken(e.target.value)} required />
            <Button type="submit" variant="cta" className="w-full">Authenticate</Button>
          </form>
        </section>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Content Machine" description="AI city+trade article generator." path="/admin/content-machine" />
      <section className="container py-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-extrabold">Content Machine</h1>
            <p className="text-sm text-muted-foreground">Pick a city + trade. AI writes the post and pulls 3 PNW images from your prompt library.</p>
          </div>
          <nav className="flex gap-3 text-sm">
            <Link to="/admin/blog-editor" className="text-accent hover:underline">Blog editor</Link>
            <Link to="/admin/new-post" className="text-accent hover:underline">New post</Link>
            <Link to="/admin/prompts" className="text-accent hover:underline">Prompt library</Link>
          </nav>
        </div>

        {err && <div className="mt-4 rounded-lg p-4 text-sm bg-red-50 text-red-800">❌ {err}</div>}
        {ok && <div className="mt-4 rounded-lg p-4 text-sm bg-green-50 text-green-800">✅ {ok}</div>}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium">City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Trade</label>
            <select value={trade} onChange={(e) => setTrade(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              {TRADES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={generate} disabled={loading} variant="cta" className="w-full">
              {loading ? "Generating (30-60s)..." : "Generate post"}
            </Button>
          </div>
        </div>

        {draft && (
          <div className="mt-10 space-y-6">
            <h2 className="text-xl font-bold">Preview & edit</h2>

            <div className="grid gap-4 md:grid-cols-3">
              {(["hero","process","trust"] as const).map((cat) => {
                const url = draft[`${cat}_image_url` as keyof Draft] as string | null;
                const alt = draft[`${cat}_alt` as keyof Draft] as string | null;
                return (
                  <div key={cat} className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">{cat}</span>
                      <Button size="sm" variant="outline" onClick={() => regenerateImage(cat)} disabled={regen === cat}>
                        {regen === cat ? "..." : "Regenerate"}
                      </Button>
                    </div>
                    {url ? (
                      <img src={url} alt={alt ?? ""} className="w-full rounded aspect-video object-cover" />
                    ) : (
                      <div className="w-full aspect-video bg-secondary rounded flex items-center justify-center text-xs text-muted-foreground">No image</div>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2">{alt}</p>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Excerpt</label>
                <Input value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Meta title</label>
                <Input value={draft.meta_title} onChange={(e) => setDraft({ ...draft, meta_title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Meta description</label>
                <Input value={draft.meta_description} onChange={(e) => setDraft({ ...draft, meta_description: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Body HTML</label>
                <Textarea rows={16} className="font-mono text-xs" value={draft.body_html} onChange={(e) => setDraft({ ...draft, body_html: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={publish} disabled={publishing} variant="cta" size="lg">
                {publishing ? "Publishing..." : "Publish to /blog"}
              </Button>
              <Button variant="outline" onClick={() => setDraft(null)}>Discard</Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
