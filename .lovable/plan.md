## Programmatic Cost Directory — 18 services, 50 states, county-fallback logic

Revised plan replacing the earlier 8-service draft. Local JSON only, no backend, no forms.

### 1. `src/lib/cost-directory.ts` — data & types

**Types** (ready for a 500-county JSON drop-in):
```ts
export interface CountyData { name: string; multiplier: number; }
export interface StateData {
  name: string;
  baseMultiplier: number;                     // used when county not found
  counties: Record<string, CountyData>;       // key = county slug
}
export interface ServiceBaseline {
  name: string;                               // display name, e.g. "Pressure Washing"
  unit: string;                               // "Per Sq Ft" | "Per Hour" | "Total Project" | ...
  low: number;
  high: number;
}
```

**`BASELINE_COSTS: Record<string, ServiceBaseline>`** — 18 services, national averages:

| slug | name | unit | low | high |
|---|---|---|---|---|
| plumbing | Plumbing | Per Hour | 75 | 200 |
| electrical | Electrical | Per Hour | 85 | 210 |
| hvac | HVAC | Total Project | 5500 | 12500 |
| roofing | Roofing | Total Project | 6000 | 18000 |
| painting | Painting | Per Sq Ft | 2 | 6 |
| landscaping | Landscaping | Total Project | 2500 | 12000 |
| fence | Fence | Per Linear Ft | 25 | 65 |
| deck | Deck | Per Sq Ft | 30 | 60 |
| pressure-washing | Pressure Washing | Total Project | 200 | 600 |
| handyman | Handyman | Per Hour | 60 | 125 |
| tree-service | Tree Service | Total Project | 400 | 2000 |
| water-damage | Water Damage Restoration | Total Project | 1200 | 5500 |
| concrete | Concrete | Per Sq Ft | 6 | 18 |
| windows | Windows | Per Window | 450 | 1400 |
| chimney | Chimney | Total Project | 250 | 1200 |
| garage-door | Garage Door | Total Project | 550 | 1800 |
| flooring | Flooring | Per Sq Ft | 6 | 14 |
| septic | Septic | Total Project | 3500 | 12000 |

**`LOCATION_MULTIPLIERS: Record<string, StateData>`** — all 50 states, top 2 most-populous counties each as placeholders (e.g., CA → los-angeles 1.35, san-diego 1.22; TX → harris 1.10, dallas 1.08; NY → kings 1.55, queens 1.48; ID → ada 1.05, canyon 0.98; etc.). `baseMultiplier` set per state (metro-heavy states ≈1.10–1.20, mid ≈1.00, rural ≈0.85). Structure is exactly what the 500-county JSON will overwrite.

### 2. `calculateCost` fallback logic
```ts
calculateCost(serviceSlug, stateSlug, countySlug) →
  { service, stateName, countyName, unit, low, high, multiplier, usedFallback } | null
```
- Service missing → `null` (page renders 404).
- State missing → multiplier = 1.0, `stateName` = title-cased slug, `usedFallback = true`.
- County missing but state exists → multiplier = `state.baseMultiplier`, `countyName` = title-cased slug, `usedFallback = true`.
- County exists → its multiplier, `usedFallback = false`.
- `low/high` = `round(baseline * multiplier)`.

### 3. `src/pages/ServiceLocationPage.tsx`
- Reads display name from `BASELINE_COSTS[serviceSlug].name` for H1: `"{Service} Costs in {County} County, {State}"`.
- Dark palette: `bg-slate-950`, `text-slate-200`, `border-slate-800`, discrete slate-900 cards.
- Large typographic `$low – $high` + unit line + small "Adjusted with a {multiplier}× regional index" note.
- When `usedFallback` is true, subtle line: "Using {state} state average — county-level data coming soon."
- Single CTA: `Call Local Contractor` (tel link to site number, or `/contact` if none — I'll use the existing contact route).
- No forms, no popups.

### 4. Route
`App.tsx`: append `<Route path="/:service/:state/:county" element={<ServiceLocationPage />} />` inside the `<Layout />` tree, positioned last so existing routes (`/blog`, `/calculators`, etc.) win.

### Notes on the original branding requests
Carrying forward from the earlier plan discussion:
- Badge already hidden via publish settings; I'll still add the `#lovable-badge { display:none !important; }` rule to `src/index.css` as requested.
- `index.html` has no Lovable meta/`gptengineer` script to remove; I won't strip the required security headers, SEO tags, or Vite entry script.

### Out of scope
Writing the full 500-county dataset (you'll drop that JSON in), ZIP modal, lead forms, external APIs.
