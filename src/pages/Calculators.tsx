import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { TRADES, TradeCalculator } from "@/lib/calculator-config";
import CalculatorModal from "@/components/CalculatorModal";

export default function Calculators() {
  const [active, setActive] = useState<TradeCalculator | null>(null);
  const [open, setOpen] = useState(false);

  const openFor = (t: TradeCalculator) => { setActive(t); setOpen(true); };

  return (
    <>
      <SEOHead
        title="Home Service Cost Estimators | Instant Regional Pricing"
        description="Instant home service cost estimators with accurate regional pricing models so you're never caught off guard."
        path="/calculators"
      />
      <section className="container py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-3">
          Home Service Cost Estimators
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          Instant Home Service Cost Estimators. Accurate regional pricing models so you're never caught off guard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TRADES.map((t) => (
            <div
              key={t.slug}
              className="rounded-lg border border-border bg-card p-6 flex flex-col gap-3"
            >
              <h2 className="text-lg font-bold text-card-foreground">{t.name}</h2>
              <p className="text-sm text-muted-foreground flex-1">{t.desc}</p>
              <Button className="w-full mt-auto" onClick={() => openFor(t)}>
                Get Estimate
              </Button>
            </div>
          ))}
        </div>
      </section>

      <CalculatorModal trade={active} open={open} onOpenChange={setOpen} />
    </>
  );
}
