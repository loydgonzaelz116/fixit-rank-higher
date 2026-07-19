import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { BASELINE_COSTS, LOCATION_MULTIPLIERS } from "@/lib/cost-directory";

// Rotate sample locations across services for variety.
const SAMPLE_LOCATIONS: Array<{ state: string; county: string }> = [
  { state: "washington", county: "spokane" },
  { state: "idaho", county: "kootenai" },
  { state: "california", county: "los-angeles" },
  { state: "texas", county: "harris" },
  { state: "florida", county: "miami-dade" },
  { state: "new-york", county: "kings" },
  { state: "illinois", county: "cook" },
];

const fmt = (n: number) => `$${n.toLocaleString()}`;

export default function Directory() {
  const services = Object.entries(BASELINE_COSTS);

  return (
    <>
      <SEOHead
        title="Home Service Cost Directory — Regional Pricing by County"
        description="Browse cost estimates for 18 home services across US counties. Regional pricing indexed by local labor and material rates."
        path="/directory"
      />
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-6">
            National Cost Directory
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 mb-6">
            Home Service Costs by Region
          </h1>
          <p className="text-slate-400 text-lg mb-16 max-w-2xl">
            18 service categories, indexed to local labor and material rates across US counties. Pick a service to see a sample regional estimate.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(([slug, svc], i) => {
              const sample = SAMPLE_LOCATIONS[i % SAMPLE_LOCATIONS.length];
              const state = LOCATION_MULTIPLIERS[sample.state];
              const county = state?.counties[sample.county];
              const multiplier = county?.multiplier ?? state?.baseMultiplier ?? 1;
              const low = Math.round(svc.low * multiplier);
              const high = Math.round(svc.high * multiplier);

              return (
                <Link
                  key={slug}
                  to={`/${slug}/${sample.state}/${sample.county}`}
                  className="group rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-slate-700 hover:bg-slate-900/70"
                >
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                    {svc.unit}
                  </p>
                  <h2 className="text-xl font-semibold text-slate-100 mb-2">
                    {svc.name}
                  </h2>
                  <p className="text-2xl font-bold text-slate-100 tabular-nums mb-4">
                    {fmt(low)} <span className="text-slate-600">–</span> {fmt(high)}
                  </p>
                  <p className="text-sm text-slate-500 group-hover:text-slate-400">
                    {county?.name ?? sample.county} County, {state?.name ?? sample.state} →
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 border-t border-slate-800 pt-8 text-sm text-slate-500">
            Sample links shown per service. Any US state and county slug works, e.g. <code className="text-slate-400">/roofing/texas/dallas</code>.
          </div>
        </section>
      </div>
    </>
  );
}
