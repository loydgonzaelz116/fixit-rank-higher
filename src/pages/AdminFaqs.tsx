import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { BASELINE_COSTS, LOCATION_MULTIPLIERS, calculateCost } from "@/lib/cost-directory";
import { buildDefaultFaqs, interpolate } from "@/lib/faqs";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-faqs`;

interface FaqRow {
  id: string;
  service_slug: string;
  state_slug: string | null;
  county_slug: string | null;
  faqs: { q: string; a: string }[];
  updated_at?: string;
}

const EMPTY: { q: string; a: string }[] = [
  { q: "", a: "" },
  { q: "", a: "" },
  { q: "", a: "" },
  { q: "", a: "" },
];

export default function AdminFaqs() {
  const { toast } = useToast();
  const [token, setToken] = useState(() => sessionStorage.getItem("admin_token") || "");
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem("admin_token"));
  const [items, setItems] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [serviceSlug, setServiceSlug] = useState<string>("plumbing");
  const [stateSlug, setStateSlug] = useState<string>("");
  const [countySlug, setCountySlug] = useState<string>("");
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);

  const services = Object.keys(BASELINE_COSTS).sort();
  const states = Object.keys(LOCATION_MULTIPLIERS).sort();
  const counties = useMemo(
    () => (stateSlug ? Object.keys(LOCATION_MULTIPLIERS[stateSlug]?.counties ?? {}) : []),
    [stateSlug],
  );

  const auth = () => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(FN_URL, { headers: auth() });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setItems(j.items || []);
    } catch (e) {
      toast({ title: "Load failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    sessionStorage.setItem("admin_token", token.trim());
    setAuthed(true);
  };

  const reset = () => {
    setEditingId(null);
    setServiceSlug("plumbing");
    setStateSlug("");
    setCountySlug("");
    setFaqs(EMPTY);
  };

  const editRow = (r: FaqRow) => {
    setEditingId(r.id);
    setServiceSlug(r.service_slug);
    setStateSlug(r.state_slug ?? "");
    setCountySlug(r.county_slug ?? "");
    setFaqs(r.faqs.length ? r.faqs : EMPTY);
  };

  const save = async () => {
    const cleaned = faqs.filter((f) => f.q.trim() && f.a.trim());
    if (!cleaned.length) {
      toast({ title: "Add at least one FAQ", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: auth(),
        body: JSON.stringify({
          id: editingId,
          service_slug: serviceSlug,
          state_slug: stateSlug || null,
          county_slug: countySlug || null,
          faqs: cleaned,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Save failed");
      toast({ title: "Saved" });
      reset();
      load();
    } catch (e) {
      toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this FAQ override?")) return;
    try {
      const res = await fetch(`${FN_URL}?id=${id}`, { method: "DELETE", headers: auth() });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Delete failed");
      toast({ title: "Deleted" });
      load();
    } catch (e) {
      toast({ title: "Delete failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold">Admin FAQs</h1>
          <Input
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Admin — Service FAQs" description="Edit FAQs per service and location" path="/admin/faqs" />
      <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold">Service FAQs</h1>
              <p className="text-slate-400 text-sm mt-1">
                Override the auto-generated FAQs for a service, state, or county. Placeholders:{" "}
                <code className="text-slate-300">{"{service} {state} {county} {year} {range} {unit} {multiplier}"}</code>
              </p>
            </div>
            <Button variant="ghost" onClick={reset}>New override</Button>
          </header>

          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="text-sm space-y-1">
                <span className="text-slate-400">Service *</span>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2"
                  value={serviceSlug}
                  onChange={(e) => setServiceSlug(e.target.value)}
                >
                  {services.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="text-sm space-y-1">
                <span className="text-slate-400">State (optional)</span>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2"
                  value={stateSlug}
                  onChange={(e) => { setStateSlug(e.target.value); setCountySlug(""); }}
                >
                  <option value="">— all states —</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="text-sm space-y-1">
                <span className="text-slate-400">County (optional)</span>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2"
                  value={countySlug}
                  onChange={(e) => setCountySlug(e.target.value)}
                  disabled={!stateSlug}
                >
                  <option value="">— all counties —</option>
                  {counties.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </div>

            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="space-y-2 border-t border-slate-800 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase text-slate-500">FAQ {i + 1}</span>
                    {faqs.length > 1 && (
                      <button
                        type="button"
                        className="text-xs text-slate-500 hover:text-slate-300"
                        onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <Input
                    placeholder="Question"
                    value={f.q}
                    onChange={(e) => {
                      const copy = [...faqs];
                      copy[i] = { ...copy[i], q: e.target.value };
                      setFaqs(copy);
                    }}
                  />
                  <Textarea
                    placeholder="Answer"
                    rows={3}
                    value={f.a}
                    onChange={(e) => {
                      const copy = [...faqs];
                      copy[i] = { ...copy[i], a: e.target.value };
                      setFaqs(copy);
                    }}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={() => setFaqs([...faqs, { q: "", a: "" }])}>
                + Add FAQ
              </Button>
            </div>

            <div className="flex gap-3">
              <Button onClick={save}>{editingId ? "Update" : "Save"} override</Button>
              {editingId && <Button variant="ghost" onClick={reset}>Cancel</Button>}
            </div>
          </section>

          <PreviewSection serviceSlug={serviceSlug} stateSlug={stateSlug} countySlug={countySlug} faqs={faqs} />

          <section>
            <h2 className="text-xl font-semibold mb-4">Existing overrides {loading && "…"}</h2>
            <div className="space-y-2">
              {items.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center border border-slate-800 rounded-lg px-4 py-3 bg-slate-900/40"
                >
                  <div className="text-sm">
                    <div className="font-medium text-slate-100">
                      {r.service_slug}
                      {r.state_slug ? ` / ${r.state_slug}` : " / all states"}
                      {r.county_slug ? ` / ${r.county_slug}` : ""}
                    </div>
                    <div className="text-slate-500 text-xs">{r.faqs.length} FAQ(s)</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => editRow(r)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => del(r.id)}>Delete</Button>
                  </div>
                </div>
              ))}
              {!items.length && !loading && (
                <p className="text-sm text-slate-500">No overrides yet — pages use auto-generated FAQs.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );

function PreviewSection({
  serviceSlug,
  stateSlug,
  countySlug,
  faqs,
}: {
  serviceSlug: string;
  stateSlug: string;
  countySlug: string;
  faqs: { q: string; a: string }[];
}) {
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  const year = new Date().getFullYear();

  const { result, sampleNote } = useMemo(() => {
    const state = stateSlug ? LOCATION_MULTIPLIERS[stateSlug] : null;
    let effectiveState = stateSlug;
    let effectiveCounty = countySlug;
    let note = "";

    if (!effectiveState) {
      effectiveState = "california";
      note = "Previewing with sample state (California) — save applies to all states.";
    }
    if (!effectiveCounty) {
      const counties = LOCATION_MULTIPLIERS[effectiveState]?.counties ?? {};
      effectiveCounty = Object.keys(counties)[0] ?? "sample";
      if (!note) note = `Previewing with sample county (${effectiveCounty}) — save applies to all counties in ${effectiveState}.`;
    }
    return {
      result: calculateCost(serviceSlug, effectiveState, effectiveCounty),
      sampleNote: note,
    };
  }, [serviceSlug, stateSlug, countySlug]);

  if (!result) return null;

  const range = `${fmt(result.low)}–${fmt(result.high)}`;
  const cleaned = faqs.filter((f) => f.q.trim() && f.a.trim());
  const source = cleaned.length ? cleaned : buildDefaultFaqs(result, year, range);
  const rendered = source.map((f) => ({
    q: interpolate(f.q, result, year, range),
    a: interpolate(f.a, result, year, range),
  }));

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: rendered.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold">Live preview</h2>
          <p className="text-slate-500 text-xs mt-1">
            {result.serviceName} · {result.countyName} County, {result.stateName} · {range} {result.unit}
          </p>
        </div>
        {!cleaned.length && (
          <span className="text-xs text-slate-500">Showing auto-generated defaults</span>
        )}
      </div>
      {sampleNote && (
        <p className="text-xs text-slate-500 italic">{sampleNote}</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">Accordion</p>
          <div className="space-y-3">
            {rendered.map((f, i) => (
              <details key={i} className="group rounded-lg border border-slate-800 bg-slate-950/60 p-4 open:bg-slate-900/60">
                <summary className="cursor-pointer list-none flex justify-between items-start gap-4 text-slate-100 font-medium text-sm">
                  <span>{f.q}</span>
                  <span className="text-slate-500 text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">FAQPage JSON-LD</p>
          <pre className="text-[11px] leading-relaxed text-slate-300 overflow-auto max-h-[420px] whitespace-pre-wrap break-words">
{JSON.stringify(jsonld, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

