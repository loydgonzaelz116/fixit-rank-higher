import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const trades = [
  { slug: "plumbing", name: "Plumbing", desc: "Pipes, fixtures, and water systems" },
  { slug: "electrical", name: "Electrical", desc: "Wiring, panels, and outlets" },
  { slug: "hvac", name: "HVAC", desc: "Heating, cooling, and ventilation" },
  { slug: "roofing", name: "Roofing", desc: "Roof repair and replacement" },
  { slug: "painting", name: "Painting", desc: "Interior and exterior painting" },
  { slug: "landscaping", name: "Landscaping", desc: "Yard design and maintenance" },
  { slug: "fence", name: "Fence", desc: "Fence installation and repair" },
  { slug: "deck", name: "Deck", desc: "Deck building and refinishing" },
  { slug: "pressure-washing", name: "Pressure Washing", desc: "Surface cleaning and restoration" },
  { slug: "handyman", name: "Handyman", desc: "General repairs and odd jobs" },
  { slug: "tree-service", name: "Tree Service", desc: "Trimming, removal, and stump grinding" },
  { slug: "water-damage", name: "Water Damage", desc: "Restoration and flood cleanup" },
  { slug: "concrete", name: "Concrete", desc: "Driveways, patios, and foundations" },
  { slug: "windows", name: "Windows", desc: "Window installation and replacement" },
  { slug: "chimney", name: "Chimney", desc: "Inspection, cleaning, and repair" },
  { slug: "garage-door", name: "Garage Door", desc: "Installation and opener repair" },
  { slug: "flooring", name: "Flooring", desc: "Hardwood, tile, and carpet" },
  { slug: "septic", name: "Septic", desc: "Tank pumping and system repair" },
  { slug: "insulation", name: "Insulation", desc: "Attic, wall, and crawl space" },
  { slug: "siding", name: "Siding", desc: "Vinyl, wood, and fiber cement" },
  { slug: "foundation", name: "Foundation", desc: "Crack repair and waterproofing" },
];

export default function Calculators() {
  return (
    <>
      <SEOHead
        title="Home Service Cost Estimators | Spokane & North Idaho"
        description="Get high-end cost estimates for 21 home service trades in Spokane and North Idaho so you're never caught off guard."
        path="/calculators"
      />
      <section className="container py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-3">
          Home Service Cost Estimators
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          Spokane &amp; North Idaho pricing. High-end estimates so you're never caught off guard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {trades.map((t) => (
            <div
              key={t.slug}
              className="rounded-lg border border-border bg-card p-6 flex flex-col gap-3"
            >
              <h2 className="text-lg font-bold text-card-foreground">{t.name}</h2>
              <p className="text-sm text-muted-foreground flex-1">{t.desc}</p>
              <Button asChild className="w-full mt-auto">
                <Link to={`/calculator/${t.slug}`}>Get Estimate</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
