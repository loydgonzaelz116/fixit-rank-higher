import { useParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { calculateCost } from "@/lib/cost-directory";
import NotFound from "./NotFound";

const fmt = (n: number) => `$${n.toLocaleString()}`;

export default function ServiceLocationPage() {
  const { service = "", state = "", county = "" } = useParams();
  const result = calculateCost(service.toLowerCase(), state.toLowerCase(), county.toLowerCase());

  if (!result) return <NotFound />;

  const title = `${result.serviceName} Costs in ${result.countyName} County, ${result.stateName}`;
  const desc = `Estimated ${result.serviceName.toLowerCase()} cost in ${result.countyName} County, ${result.stateName}: ${fmt(result.low)}–${fmt(result.high)} ${result.unit.toLowerCase()}. Regional pricing adjusted with a ${result.multiplier}× index.`;

  return (
    <>
      <SEOHead title={title} description={desc} path={`/${service}/${state}/${county}`} />
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-6">
            {result.stateName} · {result.countyName} County
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 mb-6">
            {title}
          </h1>
          <p className="text-slate-400 text-lg mb-14 max-w-2xl">
            Regional cost estimate for {result.serviceName.toLowerCase()} in {result.countyName} County, based on national baselines adjusted for local labor and material variables.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 md:p-10 mb-8">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">
              Estimated Cost Range · {result.unit}
            </p>
            <div className="text-5xl md:text-6xl font-extrabold text-slate-100 tabular-nums">
              {fmt(result.low)} <span className="text-slate-600">–</span> {fmt(result.high)}
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Adjusted with a {result.multiplier}× regional index.
              {result.usedFallback && (
                <> Using {result.stateName} state average — county-level data coming soon.</>
              )}
            </p>
          </div>

          <a
            href="tel:+15550000000"
            className="inline-flex items-center justify-center rounded-md bg-slate-100 px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-white"
          >
            Call Local Contractor
          </a>

          <div className="mt-16 border-t border-slate-800 pt-8 text-sm text-slate-500 leading-relaxed">
            <p>
              Estimates combine national {result.serviceName.toLowerCase()} averages with a regional multiplier reflecting local labor rates, permit costs, and material availability. Final quotes vary by project scope and site conditions.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
