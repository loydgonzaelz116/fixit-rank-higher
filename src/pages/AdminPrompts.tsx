import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";

type Prompt = {
  id: string;
  trade: string;
  category: "hero" | "process" | "trust";
  visual_description: string;
  alt_text_template: string;
  is_active: boolean;
};

export default function AdminPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [trade, setTrade] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("image_prompts").select("*").order("trade").order("category").then(({ data }) => {
      setPrompts((data as Prompt[]) ?? []);
      setLoading(false);
    });
  }, []);

  const trades = Array.from(new Set(prompts.map((p) => p.trade))).sort();
  const filtered = trade === "all" ? prompts : prompts.filter((p) => p.trade === trade);

  return (
    <>
      <SEOHead title="Prompt library" description="Image prompt library" path="/admin/prompts" />
      <section className="container py-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-extrabold">Image prompt library</h1>
            <p className="text-sm text-muted-foreground">PNW prompts auto-selected by the Content Machine when generating posts.</p>
          </div>
          <nav className="flex gap-3 text-sm">
            <Link to="/admin/content-machine" className="text-accent hover:underline">Content Machine</Link>
            <Link to="/admin/new-post" className="text-accent hover:underline">New post</Link>
          </nav>
        </div>

        <div className="mt-4">
          <select value={trade} onChange={(e) => setTrade(e.target.value)} className="flex h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="all">All trades ({prompts.length})</option>
            {trades.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading...</p>
        ) : (
          <div className="mt-6 space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-lg border border-border p-4">
                <div className="flex gap-2 text-xs">
                  <span className="rounded-full bg-accent/10 text-accent px-2 py-0.5 font-medium">{p.trade}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-medium uppercase">{p.category}</span>
                  {!p.is_active && <span className="rounded-full bg-red-100 text-red-800 px-2 py-0.5">inactive</span>}
                </div>
                <p className="mt-2 text-sm">{p.visual_description}</p>
                <p className="mt-2 text-xs text-muted-foreground"><strong>Alt:</strong> {p.alt_text_template}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
