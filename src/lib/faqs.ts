import { supabase } from "@/integrations/supabase/client";
import type { CostResult } from "./cost-directory";

export interface Faq {
  q: string;
  a: string;
}

export function buildDefaultFaqs(r: CostResult, year: number, range: string): Faq[] {
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

/**
 * Look up FAQ override with fallback: county → state → service-wide.
 * Interpolates {service} {state} {county} {year} {range} {unit} {multiplier}.
 */
export async function fetchFaqOverride(
  r: CostResult,
): Promise<Faq[] | null> {
  const { data, error } = await supabase
    .from("service_location_faqs")
    .select("state_slug, county_slug, faqs")
    .eq("service_slug", r.serviceSlug)
    .or(
      `and(state_slug.eq.${r.stateSlug},county_slug.eq.${r.countySlug}),and(state_slug.eq.${r.stateSlug},county_slug.is.null),and(state_slug.is.null,county_slug.is.null)`,
    );
  if (error || !data?.length) return null;

  const score = (row: { state_slug: string | null; county_slug: string | null }) =>
    (row.state_slug ? 1 : 0) + (row.county_slug ? 2 : 0);
  const best = [...data].sort((a, b) => score(b) - score(a))[0];
  const faqs = Array.isArray(best.faqs) ? (best.faqs as unknown as Faq[]) : [];
  return faqs.length ? faqs : null;
}

export function interpolate(text: string, r: CostResult, year: number, range: string): string {
  return text
    .replace(/\{service\}/g, r.serviceName)
    .replace(/\{state\}/g, r.stateName)
    .replace(/\{county\}/g, r.countyName)
    .replace(/\{year\}/g, String(year))
    .replace(/\{range\}/g, range)
    .replace(/\{unit\}/g, r.unit)
    .replace(/\{multiplier\}/g, String(r.multiplier));
}
