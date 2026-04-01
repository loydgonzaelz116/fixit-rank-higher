import SEOHead from "@/components/SEOHead";
import BeehiivEmbed from "@/components/BeehiivEmbed";
import { CheckCircle2 } from "lucide-react";


const checklistItems = [
  "Google Business Profile audit",
  "On-page SEO quick wins",
  "Review generation strategy",
  "Local citation checklist",
  "Competitor keyword analysis",
  "Content calendar template",
  "Monthly tracking dashboard",
];

export default function FreeChecklist() {
  return (
    <>
      <SEOHead
        title="Free 7-Point Local SEO Audit Checklist"
        description="Download the free 7-point local SEO audit checklist built for contractors. Rank higher, get more calls, beat the competition."
        path="/free-checklist"
      />

      <section className="container py-16 md:py-24 max-w-4xl mx-auto">
        <div className="grid gap-12 md:grid-cols-2 items-start">
          <div>
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent uppercase tracking-wider">
              Free Resource
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">
              The 7-Point Local SEO Audit Checklist for Contractors
            </h1>
            <p className="mt-4 text-muted-foreground">
              Stop guessing why you're not showing up on Google. This checklist walks you through the exact steps to audit and fix your local SEO — no agency required.
            </p>

            <ul className="mt-6 space-y-3">
              {checklistItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs text-muted-foreground">
              Built by contractors, for contractors. No fluff, no upsell traps.
            </p>
          </div>

          <div className="md:sticky md:top-24">
            <BeehiivEmbed />
          </div>
        </div>
      </section>
    </>
  );
}
