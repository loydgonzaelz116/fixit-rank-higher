import SEOHead from "@/components/SEOHead";
import { MapPin, Wrench } from "lucide-react";

const cities = ["Coeur d'Alene", "Spokane", "Post Falls", "Hayden", "Liberty Lake", "Moscow", "Pullman"];
const trades = ["Plumbers", "HVAC Technicians", "Electricians", "Roofers", "General Contractors", "Landscapers"];

export default function About() {
  return (
    <>
      <SEOHead
        title="About FixItNearMe"
        description="FixItNearMe was built for contractors who show up every day and do the work — but struggle to get found online."
        path="/about"
      />

      <section className="container py-16 md:py-24 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold">About FixItNearMe</h1>

        <div className="mt-8 space-y-4 text-foreground/80 leading-relaxed">
          <p>
            FixItNearMe was built for the guys who show up every day and do the work — but struggle to get found online.
          </p>
          <p>
            We know the trades. We know that most contractors don't have time to learn SEO, write blog posts, or manage their Google listing. But we also know that the ones who do are winning all the calls.
          </p>
          <p>
            Our mission is simple: give contractors the tools and knowledge to compete online without needing an expensive agency. And for those who want hands-off help, we offer affordable managed SEO starting at $150/month.
          </p>
        </div>

        {/* Trust signals */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg bg-secondary p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-accent" />
              <h3 className="font-bold">Cities We Serve</h3>
            </div>
            <ul className="space-y-1.5">
              {cities.map((city) => (
                <li key={city} className="text-sm text-muted-foreground">{city}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-secondary p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="h-5 w-5 text-accent" />
              <h3 className="font-bold">Trades We Work With</h3>
            </div>
            <ul className="space-y-1.5">
              {trades.map((trade) => (
                <li key={trade} className="text-sm text-muted-foreground">{trade}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
