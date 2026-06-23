// Configuration for the 18 industry calculators.
// Each trade defines its input fields and a compute() that returns a base [low, high] range
// in USD BEFORE the regional zip-code modifier is applied.

export type FieldType = "select" | "number" | "toggle";

export interface CalcField {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  helper?: string;
}

export interface TradeCalculator {
  slug: string;
  name: string;
  desc: string;
  fields: CalcField[];
  /** Returns base [low, high] in USD before regional modifier. */
  compute: (v: Record<string, any>) => [number, number] | null;
  /** Optional fine print shown under inputs. */
  note?: string;
}

const r = (low: number, high: number): [number, number] => [low, high];

export const TRADES: TradeCalculator[] = [
  {
    slug: "plumbing",
    name: "Plumbing",
    desc: "Pipes, fixtures, and water systems",
    note: "Includes $99 base service fee.",
    fields: [
      {
        key: "task",
        label: "Task",
        type: "select",
        required: true,
        options: [
          { value: "water_heater", label: "Water Heater Replacement" },
          { value: "leak", label: "Leak Repair" },
          { value: "drain", label: "Clogged Drain" },
          { value: "toilet", label: "Toilet Install" },
        ],
      },
    ],
    compute: (v) => {
      const base = 99;
      const map: Record<string, [number, number]> = {
        water_heater: [1200, 2500],
        leak: [250, 600],
        drain: [150, 400],
        toilet: [200, 450],
      };
      const t = map[v.task];
      return t ? r(t[0] + base, t[1] + base) : null;
    },
  },
  {
    slug: "electrical",
    name: "Electrical",
    desc: "Wiring, panels, and outlets",
    note: "Includes $120 diagnostics fee.",
    fields: [
      {
        key: "task",
        label: "Task",
        type: "select",
        required: true,
        options: [
          { value: "outlet", label: "Outlet / Switch Replacement" },
          { value: "fan", label: "Ceiling Fan Install" },
          { value: "panel", label: "Main Panel Upgrade" },
          { value: "ev", label: "EV Charger Circuit" },
        ],
      },
    ],
    compute: (v) => {
      const base = 120;
      const map: Record<string, [number, number]> = {
        outlet: [100, 200],
        fan: [250, 500],
        panel: [2500, 5000],
        ev: [600, 1400],
      };
      const t = map[v.task];
      return t ? r(t[0] + base, t[1] + base) : null;
    },
  },
  {
    slug: "hvac",
    name: "HVAC",
    desc: "Heating, cooling, and ventilation",
    fields: [
      {
        key: "service",
        label: "Service",
        type: "select",
        required: true,
        options: [
          { value: "tuneup", label: "Tune-Up / Diagnostic ($89 flat)" },
          { value: "system", label: "AC / Heat Pump System Replacement" },
        ],
      },
      {
        key: "tons",
        label: "System Capacity",
        type: "select",
        options: [
          { value: "2", label: "2 Ton" },
          { value: "3", label: "3 Ton" },
          { value: "4", label: "4 Ton" },
          { value: "5", label: "5 Ton" },
        ],
      },
      { key: "ductwork", label: "Include full ductwork replacement (+25%)", type: "toggle" },
    ],
    compute: (v) => {
      if (v.service === "tuneup") return r(89, 89);
      if (v.service !== "system" || !v.tons) return null;
      const tons = parseInt(v.tons, 10);
      const base = 4000 + 1200 * tons;
      const mult = v.ductwork ? 1.25 : 1;
      // ±10% range
      return r(base * 0.9 * mult, base * 1.1 * mult);
    },
  },
  {
    slug: "roofing",
    name: "Roofing",
    desc: "Roof repair and replacement",
    fields: [
      { key: "sqft", label: "Roof square footage", type: "number", min: 100, step: 50, required: true, placeholder: "2000" },
      {
        key: "material",
        label: "Material",
        type: "select",
        required: true,
        options: [
          { value: "asphalt", label: "Asphalt Shingles" },
          { value: "metal", label: "Metal" },
        ],
      },
      { key: "steep", label: "Steep pitch / multi-story (+15%)", type: "toggle" },
    ],
    compute: (v) => {
      const sqft = Number(v.sqft);
      if (!sqft) return null;
      const rates: Record<string, [number, number]> = {
        asphalt: [5, 7.5],
        metal: [10, 15],
      };
      const m = rates[v.material];
      if (!m) return null;
      const mult = v.steep ? 1.15 : 1;
      return r(sqft * m[0] * mult, sqft * m[1] * mult);
    },
  },
  {
    slug: "painting",
    name: "Painting",
    desc: "Interior and exterior painting",
    fields: [
      {
        key: "scope",
        label: "Scope",
        type: "select",
        required: true,
        options: [
          { value: "interior", label: "Interior (per sq ft wall space)" },
          { value: "ext_small", label: "Exterior — Small Home" },
          { value: "ext_med", label: "Exterior — Medium Home" },
          { value: "ext_large", label: "Exterior — Large Home" },
        ],
      },
      { key: "sqft", label: "Wall sq ft (interior only)", type: "number", min: 50, step: 50, placeholder: "1200" },
    ],
    compute: (v) => {
      if (v.scope === "interior") {
        const sqft = Number(v.sqft);
        if (!sqft) return null;
        return r(sqft * 3, sqft * 5);
      }
      const tiers: Record<string, [number, number]> = {
        ext_small: [2500, 4000],
        ext_med: [4000, 6500],
        ext_large: [6500, 11000],
      };
      return tiers[v.scope] || null;
    },
  },
  {
    slug: "landscaping",
    name: "Landscaping",
    desc: "Yard design and maintenance",
    fields: [
      {
        key: "service",
        label: "Service",
        type: "select",
        required: true,
        options: [
          { value: "maint", label: "Maintenance Visit" },
          { value: "cleanup", label: "Seasonal Yard Clean-Up" },
          { value: "sod", label: "Sod Installation (per sq ft)" },
          { value: "mulch", label: "Mulch Placement (per cubic yard)" },
        ],
      },
      { key: "qty", label: "Quantity (sq ft for sod, cu yd for mulch)", type: "number", min: 1, step: 1, placeholder: "500" },
    ],
    compute: (v) => {
      if (v.service === "maint") return r(50, 90);
      if (v.service === "cleanup") return r(300, 700);
      const qty = Number(v.qty);
      if (!qty) return null;
      if (v.service === "sod") return r(qty * 2, qty * 4);
      if (v.service === "mulch") return r(qty * 80, qty * 80);
      return null;
    },
  },
  {
    slug: "fence",
    name: "Fence",
    desc: "Fence installation and repair",
    fields: [
      { key: "ft", label: "Linear footage", type: "number", min: 10, step: 5, required: true, placeholder: "100" },
      {
        key: "material",
        label: "Material",
        type: "select",
        required: true,
        options: [
          { value: "wood", label: "Wood Privacy" },
          { value: "vinyl", label: "Vinyl / PVC" },
          { value: "chain", label: "Chain Link" },
        ],
      },
    ],
    compute: (v) => {
      const ft = Number(v.ft);
      if (!ft) return null;
      const rates: Record<string, [number, number]> = {
        wood: [30, 45],
        vinyl: [40, 60],
        chain: [18, 30],
      };
      const m = rates[v.material];
      return m ? r(ft * m[0], ft * m[1]) : null;
    },
  },
  {
    slug: "deck",
    name: "Deck",
    desc: "Deck building and refinishing",
    fields: [
      { key: "sqft", label: "Deck square footage", type: "number", min: 20, step: 10, required: true, placeholder: "300" },
      {
        key: "material",
        label: "Material",
        type: "select",
        required: true,
        options: [
          { value: "pt", label: "Pressure-Treated Wood" },
          { value: "composite", label: "Composite / Trex" },
        ],
      },
      { key: "stairs", label: "Include stairs & railings (+$1,500)", type: "toggle" },
    ],
    compute: (v) => {
      const sqft = Number(v.sqft);
      if (!sqft) return null;
      const rates: Record<string, [number, number]> = {
        pt: [30, 45],
        composite: [70, 100],
      };
      const m = rates[v.material];
      if (!m) return null;
      const add = v.stairs ? 1500 : 0;
      return r(sqft * m[0] + add, sqft * m[1] + add);
    },
  },
  {
    slug: "pressure-washing",
    name: "Pressure Washing",
    desc: "Surface cleaning and restoration",
    fields: [
      {
        key: "service",
        label: "Service",
        type: "select",
        required: true,
        options: [
          { value: "drive", label: "Driveway / Sidewalk" },
          { value: "roof", label: "Roof Soft-Wash" },
          { value: "gutter", label: "Gutter Cleaning" },
          { value: "siding_1", label: "House Siding — 1 Story" },
          { value: "siding_2", label: "House Siding — 2 Story" },
        ],
      },
    ],
    compute: (v) => {
      const map: Record<string, [number, number]> = {
        drive: [150, 350],
        roof: [450, 850],
        gutter: [150, 300],
        siding_1: [250, 400],
        siding_2: [400, 700],
      };
      return map[v.service] || null;
    },
  },
  {
    slug: "handyman",
    name: "Handyman",
    desc: "General repairs and odd jobs",
    note: "Hourly jobs include $75 base visit fee.",
    fields: [
      {
        key: "task",
        label: "Task",
        type: "select",
        required: true,
        options: [
          { value: "hourly", label: "Hourly work ($60–$90/hr)" },
          { value: "tv", label: "TV Wall Mounting" },
          { value: "lock", label: "Door Lock Replacement" },
          { value: "drywall", label: "Drywall Patching" },
        ],
      },
      { key: "hours", label: "Estimated hours (hourly only)", type: "number", min: 1, step: 1, placeholder: "2" },
    ],
    compute: (v) => {
      if (v.task === "hourly") {
        const h = Number(v.hours);
        if (!h) return null;
        return r(75 + 60 * h, 75 + 90 * h);
      }
      const map: Record<string, [number, number]> = {
        tv: [120, 200],
        lock: [90, 150],
        drywall: [150, 300],
      };
      return map[v.task] || null;
    },
  },
  {
    slug: "tree-service",
    name: "Tree Service",
    desc: "Trimming, removal, and stump grinding",
    fields: [
      {
        key: "height",
        label: "Tree height",
        type: "select",
        required: true,
        options: [
          { value: "small", label: "Small — under 30 ft" },
          { value: "med", label: "Medium — 30–60 ft" },
          { value: "large", label: "Large — 60–100 ft" },
        ],
      },
      { key: "stump", label: "Add stump grinding (+$200–$500)", type: "toggle" },
      { key: "hazard", label: "Hazard — near power lines / structures (+30%)", type: "toggle" },
    ],
    compute: (v) => {
      const map: Record<string, [number, number]> = {
        small: [450, 800],
        med: [800, 1500],
        large: [1500, 3000],
      };
      const m = map[v.height];
      if (!m) return null;
      let low = m[0], high = m[1];
      if (v.stump) { low += 200; high += 500; }
      if (v.hazard) { low *= 1.3; high *= 1.3; }
      return r(low, high);
    },
  },
  {
    slug: "water-damage",
    name: "Water Damage",
    desc: "Restoration and flood cleanup",
    fields: [
      {
        key: "scope",
        label: "Damage scope",
        type: "select",
        required: true,
        options: [
          { value: "single", label: "Single Room Dryout" },
          { value: "multi", label: "Multi-Room / Flooded Basement" },
          { value: "full", label: "Full Pack-Out & Structural Remediation" },
        ],
      },
    ],
    compute: (v) => {
      const map: Record<string, [number, number]> = {
        single: [1000, 2500],
        multi: [3000, 7000],
        full: [8000, 18000],
      };
      return map[v.scope] || null;
    },
  },
  {
    slug: "concrete",
    name: "Concrete",
    desc: "Driveways, patios, and foundations",
    fields: [
      { key: "sqft", label: "Project square footage", type: "number", min: 20, step: 10, required: true, placeholder: "400" },
      {
        key: "type",
        label: "Project type",
        type: "select",
        required: true,
        options: [
          { value: "standard", label: "Standard Driveway / Patio" },
          { value: "stamped", label: "Stamped / Decorative" },
          { value: "foundation", label: "Foundation Slab" },
        ],
      },
    ],
    compute: (v) => {
      const sqft = Number(v.sqft);
      if (!sqft) return null;
      const rates: Record<string, [number, number]> = {
        standard: [8, 13],
        stamped: [14, 22],
        foundation: [6, 10],
      };
      const m = rates[v.type];
      return m ? r(sqft * m[0], sqft * m[1]) : null;
    },
  },
  {
    slug: "windows",
    name: "Windows",
    desc: "Window installation and replacement",
    fields: [
      { key: "qty", label: "Number of windows", type: "number", min: 1, step: 1, required: true, placeholder: "8" },
      {
        key: "style",
        label: "Window style",
        type: "select",
        required: true,
        options: [
          { value: "dh", label: "Standard Double-Hung Vinyl" },
          { value: "casement", label: "Large Casement / Picture" },
        ],
      },
    ],
    compute: (v) => {
      const qty = Number(v.qty);
      if (!qty) return null;
      const rates: Record<string, [number, number]> = {
        dh: [650, 1100],
        casement: [1200, 2200],
      };
      const m = rates[v.style];
      return m ? r(qty * m[0], qty * m[1]) : null;
    },
  },
  {
    slug: "chimney",
    name: "Chimney",
    desc: "Inspection, cleaning, and repair",
    fields: [
      {
        key: "service",
        label: "Service",
        type: "select",
        required: true,
        options: [
          { value: "sweep", label: "Sweep & Safety Inspection" },
          { value: "cap", label: "Chimney Cap Installation" },
          { value: "tuck", label: "Tuckpointing / Masonry Leak Repair" },
        ],
      },
    ],
    compute: (v) => {
      const map: Record<string, [number, number]> = {
        sweep: [175, 350],
        cap: [250, 500],
        tuck: [600, 2000],
      };
      return map[v.service] || null;
    },
  },
  {
    slug: "garage-door",
    name: "Garage Door",
    desc: "Installation and opener repair",
    fields: [
      {
        key: "service",
        label: "Service",
        type: "select",
        required: true,
        options: [
          { value: "spring", label: "Torsion Spring Replacement" },
          { value: "opener", label: "Automated Opener Installation" },
          { value: "single", label: "Full Replacement — Single Car Door" },
          { value: "double", label: "Full Replacement — Double Car Door" },
        ],
      },
    ],
    compute: (v) => {
      const map: Record<string, [number, number]> = {
        spring: [200, 400],
        opener: [450, 850],
        single: [1000, 1800],
        double: [1800, 3500],
      };
      return map[v.service] || null;
    },
  },
  {
    slug: "flooring",
    name: "Flooring",
    desc: "Hardwood, tile, and carpet",
    fields: [
      { key: "sqft", label: "Floor square footage", type: "number", min: 20, step: 10, required: true, placeholder: "500" },
      {
        key: "material",
        label: "Material (incl. install)",
        type: "select",
        required: true,
        options: [
          { value: "carpet", label: "Carpet" },
          { value: "lvp", label: "Luxury Vinyl Plank (LVP)" },
          { value: "hardwood", label: "Solid Hardwood" },
          { value: "tile", label: "Ceramic / Porcelain Tile" },
        ],
      },
    ],
    compute: (v) => {
      const sqft = Number(v.sqft);
      if (!sqft) return null;
      const rates: Record<string, [number, number]> = {
        carpet: [4, 8],
        lvp: [6, 11],
        hardwood: [12, 20],
        tile: [14, 25],
      };
      const m = rates[v.material];
      return m ? r(sqft * m[0], sqft * m[1]) : null;
    },
  },
  {
    slug: "septic",
    name: "Septic",
    desc: "Tank pumping and system repair",
    fields: [
      {
        key: "service",
        label: "Service",
        type: "select",
        required: true,
        options: [
          { value: "pump", label: "Standard Tank Pumping Maintenance" },
          { value: "inspect", label: "Diagnostic / Camera Inspection" },
          { value: "drainfield", label: "Full Drain Field / Leach Field Replacement" },
        ],
      },
    ],
    compute: (v) => {
      const map: Record<string, [number, number]> = {
        pump: [400, 750],
        inspect: [250, 500],
        drainfield: [5000, 15000],
      };
      return map[v.service] || null;
    },
  },
];

// ---- Regional modifier ----------------------------------------------------

export type RegionTier = "metro" | "mid" | "rural";

export interface RegionResult {
  tier: RegionTier;
  modifier: number;
  label: string;
}

// 3-digit ZCTA prefix heuristics. Not exhaustive but covers major buckets.
const METRO_PREFIXES = new Set<string>([
  // NYC metro
  "100", "101", "102", "103", "104", "111", "112", "113", "114", "116",
  // Boston metro
  "021", "022",
  // DC metro
  "200", "202", "220",
  // Miami
  "331", "332", "333",
  // Chicago
  "606",
  // Seattle metro
  "980", "981", "982",
  // San Francisco / Oakland / San Jose
  "940", "941", "943", "944", "945", "950",
  // Los Angeles / Orange County / San Diego
  "900", "902", "903", "904", "905", "906", "907", "908", "917", "918", "920", "921", "922",
  // Honolulu
  "968",
]);

const RURAL_PREFIXES = new Set<string>([
  // Sparse Mountain / Plains / Deep South pockets
  "59", "82", "83", "57", "58", "68", "69", "67", "66",
  "38", "39", "71", "72", "36", "35",
  "24", "25", "26",
  "04", "05",
  "99", // most of Alaska (excluding metro Seattle handled above by 3-digit)
]);

export function regionForZip(zip: string): RegionResult {
  const z = (zip || "").trim();
  const p3 = z.slice(0, 3);
  const p2 = z.slice(0, 2);
  if (METRO_PREFIXES.has(p3)) {
    return { tier: "metro", modifier: 1.25, label: "Metro tier (1.25×)" };
  }
  if (RURAL_PREFIXES.has(p2)) {
    return { tier: "rural", modifier: 0.85, label: "Rural tier (0.85×)" };
  }
  return { tier: "mid", modifier: 1.0, label: "Mid tier (1.0×)" };
}

export function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test((zip || "").trim());
}

export function getTrade(slug: string): TradeCalculator | undefined {
  return TRADES.find((t) => t.slug === slug);
}

export function formatUSD(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
