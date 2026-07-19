export interface CountyData {
  name: string;
  multiplier: number;
}

export interface StateData {
  name: string;
  baseMultiplier: number;
  counties: Record<string, CountyData>;
}

export interface ServiceBaseline {
  name: string;
  unit: string;
  low: number;
  high: number;
}

export const BASELINE_COSTS: Record<string, ServiceBaseline> = {
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

// Placeholder: 50 states x top 2 most-populous counties. Overwrite with 500-county JSON.
export const LOCATION_MULTIPLIERS: Record<string, StateData> = {
  alabama: { name: "Alabama", baseMultiplier: 0.90, counties: { jefferson: { name: "Jefferson", multiplier: 0.94 }, mobile: { name: "Mobile", multiplier: 0.90 } } },
  alaska: { name: "Alaska", baseMultiplier: 1.25, counties: { anchorage: { name: "Anchorage", multiplier: 1.28 }, "matanuska-susitna": { name: "Matanuska-Susitna", multiplier: 1.22 } } },
  arizona: { name: "Arizona", baseMultiplier: 1.05, counties: { maricopa: { name: "Maricopa", multiplier: 1.12 }, pima: { name: "Pima", multiplier: 1.02 } } },
  arkansas: { name: "Arkansas", baseMultiplier: 0.88, counties: { pulaski: { name: "Pulaski", multiplier: 0.92 }, benton: { name: "Benton", multiplier: 0.94 } } },
  california: { name: "California", baseMultiplier: 1.30, counties: { "los-angeles": { name: "Los Angeles", multiplier: 1.35 }, "san-diego": { name: "San Diego", multiplier: 1.28 } } },
  colorado: { name: "Colorado", baseMultiplier: 1.10, counties: { "el-paso": { name: "El Paso", multiplier: 1.08 }, denver: { name: "Denver", multiplier: 1.20 } } },
  connecticut: { name: "Connecticut", baseMultiplier: 1.20, counties: { fairfield: { name: "Fairfield", multiplier: 1.28 }, "new-haven": { name: "New Haven", multiplier: 1.18 } } },
  delaware: { name: "Delaware", baseMultiplier: 1.05, counties: { "new-castle": { name: "New Castle", multiplier: 1.10 }, sussex: { name: "Sussex", multiplier: 1.00 } } },
  florida: { name: "Florida", baseMultiplier: 1.05, counties: { "miami-dade": { name: "Miami-Dade", multiplier: 1.20 }, broward: { name: "Broward", multiplier: 1.15 } } },
  georgia: { name: "Georgia", baseMultiplier: 0.98, counties: { fulton: { name: "Fulton", multiplier: 1.10 }, gwinnett: { name: "Gwinnett", multiplier: 1.02 } } },
  hawaii: { name: "Hawaii", baseMultiplier: 1.40, counties: { honolulu: { name: "Honolulu", multiplier: 1.45 }, hawaii: { name: "Hawaii", multiplier: 1.32 } } },
  idaho: { name: "Idaho", baseMultiplier: 1.00, counties: { ada: { name: "Ada", multiplier: 1.05 }, canyon: { name: "Canyon", multiplier: 0.98 } } },
  illinois: { name: "Illinois", baseMultiplier: 1.05, counties: { cook: { name: "Cook", multiplier: 1.20 }, "dupage": { name: "DuPage", multiplier: 1.12 } } },
  indiana: { name: "Indiana", baseMultiplier: 0.92, counties: { marion: { name: "Marion", multiplier: 0.98 }, lake: { name: "Lake", multiplier: 0.95 } } },
  iowa: { name: "Iowa", baseMultiplier: 0.90, counties: { polk: { name: "Polk", multiplier: 0.95 }, linn: { name: "Linn", multiplier: 0.92 } } },
  kansas: { name: "Kansas", baseMultiplier: 0.90, counties: { johnson: { name: "Johnson", multiplier: 0.98 }, sedgwick: { name: "Sedgwick", multiplier: 0.90 } } },
  kentucky: { name: "Kentucky", baseMultiplier: 0.90, counties: { jefferson: { name: "Jefferson", multiplier: 0.95 }, fayette: { name: "Fayette", multiplier: 0.92 } } },
  louisiana: { name: "Louisiana", baseMultiplier: 0.92, counties: { "east-baton-rouge": { name: "East Baton Rouge", multiplier: 0.95 }, jefferson: { name: "Jefferson", multiplier: 0.98 } } },
  maine: { name: "Maine", baseMultiplier: 1.00, counties: { cumberland: { name: "Cumberland", multiplier: 1.08 }, york: { name: "York", multiplier: 1.02 } } },
  maryland: { name: "Maryland", baseMultiplier: 1.15, counties: { "montgomery": { name: "Montgomery", multiplier: 1.25 }, "prince-georges": { name: "Prince George's", multiplier: 1.18 } } },
  massachusetts: { name: "Massachusetts", baseMultiplier: 1.25, counties: { middlesex: { name: "Middlesex", multiplier: 1.32 }, worcester: { name: "Worcester", multiplier: 1.18 } } },
  michigan: { name: "Michigan", baseMultiplier: 0.95, counties: { wayne: { name: "Wayne", multiplier: 1.00 }, oakland: { name: "Oakland", multiplier: 1.05 } } },
  minnesota: { name: "Minnesota", baseMultiplier: 1.02, counties: { hennepin: { name: "Hennepin", multiplier: 1.12 }, ramsey: { name: "Ramsey", multiplier: 1.05 } } },
  mississippi: { name: "Mississippi", baseMultiplier: 0.85, counties: { hinds: { name: "Hinds", multiplier: 0.88 }, harrison: { name: "Harrison", multiplier: 0.86 } } },
  missouri: { name: "Missouri", baseMultiplier: 0.92, counties: { "st-louis": { name: "St. Louis", multiplier: 0.98 }, jackson: { name: "Jackson", multiplier: 0.95 } } },
  montana: { name: "Montana", baseMultiplier: 0.95, counties: { yellowstone: { name: "Yellowstone", multiplier: 0.96 }, "gallatin": { name: "Gallatin", multiplier: 1.05 } } },
  nebraska: { name: "Nebraska", baseMultiplier: 0.92, counties: { douglas: { name: "Douglas", multiplier: 0.96 }, lancaster: { name: "Lancaster", multiplier: 0.93 } } },
  nevada: { name: "Nevada", baseMultiplier: 1.10, counties: { clark: { name: "Clark", multiplier: 1.15 }, washoe: { name: "Washoe", multiplier: 1.08 } } },
  "new-hampshire": { name: "New Hampshire", baseMultiplier: 1.08, counties: { hillsborough: { name: "Hillsborough", multiplier: 1.12 }, rockingham: { name: "Rockingham", multiplier: 1.15 } } },
  "new-jersey": { name: "New Jersey", baseMultiplier: 1.20, counties: { bergen: { name: "Bergen", multiplier: 1.30 }, middlesex: { name: "Middlesex", multiplier: 1.22 } } },
  "new-mexico": { name: "New Mexico", baseMultiplier: 0.92, counties: { bernalillo: { name: "Bernalillo", multiplier: 0.95 }, "dona-ana": { name: "Doña Ana", multiplier: 0.88 } } },
  "new-york": { name: "New York", baseMultiplier: 1.30, counties: { kings: { name: "Kings", multiplier: 1.55 }, queens: { name: "Queens", multiplier: 1.48 } } },
  "north-carolina": { name: "North Carolina", baseMultiplier: 0.95, counties: { mecklenburg: { name: "Mecklenburg", multiplier: 1.05 }, wake: { name: "Wake", multiplier: 1.05 } } },
  "north-dakota": { name: "North Dakota", baseMultiplier: 0.95, counties: { cass: { name: "Cass", multiplier: 0.98 }, burleigh: { name: "Burleigh", multiplier: 0.96 } } },
  ohio: { name: "Ohio", baseMultiplier: 0.93, counties: { franklin: { name: "Franklin", multiplier: 1.00 }, cuyahoga: { name: "Cuyahoga", multiplier: 0.98 } } },
  oklahoma: { name: "Oklahoma", baseMultiplier: 0.88, counties: { oklahoma: { name: "Oklahoma", multiplier: 0.92 }, tulsa: { name: "Tulsa", multiplier: 0.90 } } },
  oregon: { name: "Oregon", baseMultiplier: 1.10, counties: { multnomah: { name: "Multnomah", multiplier: 1.20 }, washington: { name: "Washington", multiplier: 1.15 } } },
  pennsylvania: { name: "Pennsylvania", baseMultiplier: 1.02, counties: { philadelphia: { name: "Philadelphia", multiplier: 1.15 }, allegheny: { name: "Allegheny", multiplier: 1.05 } } },
  "rhode-island": { name: "Rhode Island", baseMultiplier: 1.12, counties: { providence: { name: "Providence", multiplier: 1.15 }, kent: { name: "Kent", multiplier: 1.10 } } },
  "south-carolina": { name: "South Carolina", baseMultiplier: 0.92, counties: { greenville: { name: "Greenville", multiplier: 0.96 }, richland: { name: "Richland", multiplier: 0.94 } } },
  "south-dakota": { name: "South Dakota", baseMultiplier: 0.90, counties: { minnehaha: { name: "Minnehaha", multiplier: 0.94 }, pennington: { name: "Pennington", multiplier: 0.92 } } },
  tennessee: { name: "Tennessee", baseMultiplier: 0.95, counties: { shelby: { name: "Shelby", multiplier: 0.98 }, davidson: { name: "Davidson", multiplier: 1.08 } } },
  texas: { name: "Texas", baseMultiplier: 1.00, counties: { harris: { name: "Harris", multiplier: 1.10 }, dallas: { name: "Dallas", multiplier: 1.08 } } },
  utah: { name: "Utah", baseMultiplier: 1.02, counties: { "salt-lake": { name: "Salt Lake", multiplier: 1.08 }, utah: { name: "Utah", multiplier: 1.02 } } },
  vermont: { name: "Vermont", baseMultiplier: 1.05, counties: { chittenden: { name: "Chittenden", multiplier: 1.12 }, rutland: { name: "Rutland", multiplier: 1.00 } } },
  virginia: { name: "Virginia", baseMultiplier: 1.05, counties: { fairfax: { name: "Fairfax", multiplier: 1.22 }, "prince-william": { name: "Prince William", multiplier: 1.15 } } },
  washington: { name: "Washington", baseMultiplier: 1.10, counties: { king: { name: "King", multiplier: 1.28 }, spokane: { name: "Spokane", multiplier: 1.05 } } },
  "west-virginia": { name: "West Virginia", baseMultiplier: 0.88, counties: { kanawha: { name: "Kanawha", multiplier: 0.90 }, berkeley: { name: "Berkeley", multiplier: 0.92 } } },
  wisconsin: { name: "Wisconsin", baseMultiplier: 0.98, counties: { milwaukee: { name: "Milwaukee", multiplier: 1.02 }, dane: { name: "Dane", multiplier: 1.05 } } },
  wyoming: { name: "Wyoming", baseMultiplier: 0.95, counties: { laramie: { name: "Laramie", multiplier: 0.95 }, natrona: { name: "Natrona", multiplier: 0.94 } } },
};

const titleCase = (slug: string) =>
  slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

export interface CostResult {
  serviceSlug: string;
  serviceName: string;
  unit: string;
  stateSlug: string;
  stateName: string;
  countySlug: string;
  countyName: string;
  multiplier: number;
  low: number;
  high: number;
  usedFallback: boolean;
}

export function calculateCost(
  serviceSlug: string,
  stateSlug: string,
  countySlug: string
): CostResult | null {
  const service = BASELINE_COSTS[serviceSlug];
  if (!service) return null;

  const state = LOCATION_MULTIPLIERS[stateSlug];
  let multiplier = 1.0;
  let stateName = titleCase(stateSlug);
  let countyName = titleCase(countySlug);
  let usedFallback = false;

  if (state) {
    stateName = state.name;
    const county = state.counties[countySlug];
    if (county) {
      multiplier = county.multiplier;
      countyName = county.name;
    } else {
      multiplier = state.baseMultiplier;
      usedFallback = true;
    }
  } else {
    usedFallback = true;
  }

  return {
    serviceSlug,
    serviceName: service.name,
    unit: service.unit,
    stateSlug,
    stateName,
    countySlug,
    countyName,
    multiplier,
    low: Math.round(service.low * multiplier),
    high: Math.round(service.high * multiplier),
    usedFallback,
  };
}
