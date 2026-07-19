import { useEffect } from "react";
import { useParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { calculateCost } from "@/lib/cost-directory";
import NotFound from "./NotFound";

const fmt = (n: number) => `$${n.toLocaleString()}`;
const SITE_URL = "https://fixitnearme.com";
const JSONLD_ID = "svc-location-jsonld";
const FAQ_JSONLD_ID = "svc-location-faq-jsonld";

function buildFaqs(r: NonNullable<ReturnType<typeof calculateCost>>, year: number, range: string) {
  const svc = r.serviceName;
  const svcL = svc.toLowerCase();
  const loc = `${r.countyName} County, ${r.stateName}`;
  return [
    {
      q: `How much does ${svcL} cost in ${loc}?`,
      a: `In ${year}, ${svcL} in ${loc} typically runs ${range} ${r.unit}. Pricing reflects a ${r.multiplier}× regional labor and materials index applied to national baselines.`,
    },
    {
      q: `What drives ${svcL} pricing in ${r.stateName}?`,
      a: `Local labor rates, permit fees, material availability, and project scope are the main cost drivers. ${r.countyName} County uses a ${r.multiplier}× multiplier versus the national baseline.`,
    },
    {
      q: `Are these ${svcL} estimates guaranteed?`,
      a: `No. These are data-driven ranges for planning. Final quotes depend on site conditions, access, finishes, and contractor availability. Always collect 2–3 local bids before committing.`,
    },
    {
      q: `How can I get a firm quote for ${svcL} in ${r.countyName} County?`,
      a: `Contact a licensed local contractor for an on-site assessment. Share project scope, square footage or unit count, and timing to receive an accurate written estimate.`,
    },
  ];
}

export default function ServiceLocationPage() {
  const { service = "", state = "", county = "" } = useParams();
  const result = calculateCost(service.toLowerCase(), state.toLowerCase(), county.toLowerCase());

  const year = new Date().getFullYear();
  const path = `/${service}/${state}/${county}`;

  const svcLower = result?.serviceName.toLowerCase() ?? "";
  const unitLower = result?.unit.toLowerCase() ?? "";
  const range = result ? `${fmt(result.low)}–${fmt(result.high)}` : "";

  const title = result
    ? `${result.serviceName} Cost in ${result.countyName} County, ${result.stateName} (${year}): ${range} ${result.unit}`
    : "";
  const desc = result
    ? `${year} ${svcLower} cost in ${result.countyName} County, ${result.stateName}: ${range} ${unitLower}. Regional pricing adjusted with a ${result.multiplier}× local labor index.`
    : "";
  const ogImage = result
    ? `https://og-image.vercel.app/${encodeURIComponent(
        `${result.serviceName}%20Cost%20in%20${result.countyName}%20County%2C%20${result.stateName}%20**${range}**`
      )}.png?theme=dark&md=1&fontSize=75px`
    : undefined;

  useEffect(() => {
    if (!result) return;
    const jsonld = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${result.serviceName} in ${result.countyName} County, ${result.stateName}`,
      serviceType: result.serviceName,
      areaServed: {
        "@type": "AdministrativeArea",
        name: `${result.countyName} County, ${result.stateName}`,
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: result.low,
        highPrice: result.high,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          priceCurrency: "USD",
          minPrice: result.low,
          maxPrice: result.high,
          unitText: result.unit,
        },
      },
      url: `${SITE_URL}${path}`,
    };
    const faqs = buildFaqs(result, year, range);
    const faqJsonld = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    const upsert = (id: string, data: unknown) => {
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement("script");
        el.type = "application/ld+json";
        el.id = id;
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data);
    };
    upsert(JSONLD_ID, jsonld);
    upsert(FAQ_JSONLD_ID, faqJsonld);
    return () => {
      document.getElementById(JSONLD_ID)?.remove();
      document.getElementById(FAQ_JSONLD_ID)?.remove();
    };
  }, [result, path, year, range]);

  if (!result) return <NotFound />;

  const h1 = `${result.serviceName} Costs in ${result.countyName} County, ${result.stateName}`;
  const faqs = buildFaqs(result, year, range);

  return (
    <>
      <SEOHead title={title} description={desc} path={path} ogImage={ogImage} />

      <div className="min-h-screen bg-slate-950 text-slate-200">
        <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-6">
            {result.stateName} · {result.countyName} County
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 mb-6">
            {h1}
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
