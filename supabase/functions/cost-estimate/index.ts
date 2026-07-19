import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface CountyData { name: string; multiplier: number; }
interface StateData { name: string; baseMultiplier: number; counties: Record<string, CountyData>; }
interface ServiceBaseline { name: string; unit: string; low: number; high: number; }

const BASELINE_COSTS: Record<string, ServiceBaseline> = {
  plumbing: { name: "Plumbing", unit: "Per Hour", low: 75, high: 200 },
  electrical: { name: "Electrical", unit: "Per Hour", low: 85, high: 210 },
  hvac: { name: "HVAC", unit: "Total Project", low: 5500, high: 12500 },
  roofing: { name: "Roofing", unit: "Total Project", low: 6000, high: 18000 },
  painting: { name: "Painting", unit: "Per Sq Ft", low: 2, high: 6 },
  landscaping: { name: "Landscaping", unit: "Total Project", low: 2500, high: 12000 },
  fence: { name: "Fence", unit: "Per Linear Ft", low: 25, high: 65 },
  deck: { name: "Deck", unit: "Per Sq Ft", low: 30, high: 60 },
  "pressure-washing": { name: "Pressure Washing", unit: "Total Project", low: 200, high: 600 },
  handyman: { name: "Handyman", unit: "Per Hour", low: 60, high: 125 },
  "tree-service": { name: "Tree Service", unit: "Total Project", low: 400, high: 2000 },
  "water-damage": { name: "Water Damage Restoration", unit: "Total Project", low: 1200, high: 5500 },
  concrete: { name: "Concrete", unit: "Per Sq Ft", low: 6, high: 18 },
  windows: { name: "Windows", unit: "Per Window", low: 450, high: 1400 },
  chimney: { name: "Chimney", unit: "Total Project", low: 250, high: 1200 },
  "garage-door": { name: "Garage Door", unit: "Total Project", low: 550, high: 1800 },
  flooring: { name: "Flooring", unit: "Per Sq Ft", low: 6, high: 14 },
  septic: { name: "Septic", unit: "Total Project", low: 3500, high: 12000 },
};

const LOCATION_MULTIPLIERS: Record<string, StateData> = {
  california: { name: "California", baseMultiplier: 1.25, counties: { "los-angeles": { name: "Los Angeles", multiplier: 1.35 }, "san-diego": { name: "San Diego", multiplier: 1.30 }, orange: { name: "Orange", multiplier: 1.32 }, riverside: { name: "Riverside", multiplier: 1.15 } } },
  texas: { name: "Texas", baseMultiplier: 0.95, counties: { harris: { name: "Harris", multiplier: 1.05 }, dallas: { name: "Dallas", multiplier: 1.08 }, tarrant: { name: "Tarrant", multiplier: 1.02 }, bexar: { name: "Bexar", multiplier: 0.98 } } },
  florida: { name: "Florida", baseMultiplier: 1.00, counties: { "miami-dade": { name: "Miami-Dade", multiplier: 1.15 }, broward: { name: "Broward", multiplier: 1.10 }, "palm-beach": { name: "Palm Beach", multiplier: 1.12 }, hillsborough: { name: "Hillsborough", multiplier: 1.05 } } },
  "new-york": { name: "New York", baseMultiplier: 1.20, counties: { kings: { name: "Kings (Brooklyn)", multiplier: 1.45 }, queens: { name: "Queens", multiplier: 1.40 }, "new-york": { name: "New York (Manhattan)", multiplier: 1.60 }, suffolk: { name: "Suffolk", multiplier: 1.25 } } },
  illinois: { name: "Illinois", baseMultiplier: 1.05, counties: { cook: { name: "Cook", multiplier: 1.20 }, dupage: { name: "DuPage", multiplier: 1.15 }, lake: { name: "Lake", multiplier: 1.12 } } },
  washington: { name: "Washington", baseMultiplier: 1.10, counties: { king: { name: "King", multiplier: 1.30 }, pierce: { name: "Pierce", multiplier: 1.15 }, snohomish: { name: "Snohomish", multiplier: 1.18 }, spokane: { name: "Spokane", multiplier: 1.05 } } },
  idaho: { name: "Idaho", baseMultiplier: 0.90, counties: { ada: { name: "Ada", multiplier: 1.05 }, canyon: { name: "Canyon", multiplier: 0.98 }, kootenai: { name: "Kootenai", multiplier: 1.02 } } },
};

const titleCase = (s: string) => s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
const SLUG = /^[a-z0-9-]{1,60}$/;

function calculate(serviceSlug: string, stateSlug: string, countySlug: string) {
  const service = BASELINE_COSTS[serviceSlug];
  if (!service) return null;
  const state = LOCATION_MULTIPLIERS[stateSlug];
  let multiplier = 1.0, stateName = titleCase(stateSlug), countyName = titleCase(countySlug), usedFallback = false;
  if (state) {
    stateName = state.name;
    const county = state.counties[countySlug];
    if (county) { multiplier = county.multiplier; countyName = county.name; }
    else { multiplier = state.baseMultiplier; usedFallback = true; }
  } else { usedFallback = true; }
  return {
    serviceSlug, serviceName: service.name, unit: service.unit,
    stateSlug, stateName, countySlug, countyName,
    multiplier, low: Math.round(service.low * multiplier), high: Math.round(service.high * multiplier),
    usedFallback,
  };
}

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const serviceSlug = (url.searchParams.get("service") ?? "").toLowerCase().trim();
  const stateSlug = (url.searchParams.get("state") ?? "").toLowerCase().trim();
  const countySlug = (url.searchParams.get("county") ?? "").toLowerCase().trim();

  if (!SLUG.test(serviceSlug) || !SLUG.test(stateSlug) || !SLUG.test(countySlug)) {
    return new Response(JSON.stringify({ error: "Missing or invalid slugs. Required: service, state, county (lowercase, a-z0-9-)." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const result = calculate(serviceSlug, stateSlug, countySlug);
  if (!result) {
    return new Response(JSON.stringify({ error: `Unknown service slug: ${serviceSlug}` }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
  });
});
