import { useMemo, useState } from "react";
import { z } from "zod";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { regionForZip, isValidZip, formatUSD } from "@/lib/calculator-config";
import { cn } from "@/lib/utils";

type FoamType = "open" | "closed";

const FOAM_RATES: Record<FoamType, { low: number; high: number; label: string; desc: string }> = {
  open: { low: 0.44, high: 0.65, label: "Open Cell", desc: "Lighter, ideal for interior walls & sound dampening." },
  closed: { low: 1.0, high: 1.5, label: "Closed Cell", desc: "Higher R-value, structural rigidity, moisture barrier." },
};

const leadSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  email: z.string().trim().email("Enter a valid email").max(120),
});

export default function SprayFoamCalculator() {
  const [zip, setZip] = useState("");
  const [area, setArea] = useState(1000);
  const [foam, setFoam] = useState<FoamType>("open");
  const [thickness, setThickness] = useState(3);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const zipValid = isValidZip(zip);
  const region = zipValid ? regionForZip(zip) : null;

  const calc = useMemo(() => {
    if (!area || !thickness) return null;
    const boardFeet = area * thickness;
    const rate = FOAM_RATES[foam];
    const mod = region?.modifier ?? 1;
    const low = boardFeet * rate.low * mod;
    const high = boardFeet * rate.high * mod;
    return { boardFeet, low, high };
  }, [area, thickness, foam, region]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipValid) {
      toast({ title: "Zip code required", description: "Enter a 5-digit US ZIP code first.", variant: "destructive" });
      return;
    }
    const parsed = leadSchema.safeParse({ full_name: name, phone, email });
    if (!parsed.success) {
      toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("programmatic_calculator_leads").insert({
      industry: "spray-foam",
      zip_code: zip,
      region_tier: region?.tier ?? null,
      modifier: region?.modifier ?? null,
      area_sqft: area,
      project_type: foam === "open" ? "Open Cell Spray Foam" : "Closed Cell Spray Foam",
      thickness_inches: thickness,
      board_feet: calc?.boardFeet ?? null,
      estimate_low: calc ? Math.round(calc.low) : null,
      estimate_high: calc ? Math.round(calc.high) : null,
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't submit", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Locked in", description: "Verified local crews will reach out shortly." });
  };

  return (
    <>
      <SEOHead
        title="Free Spray Foam Insulation Cost Calculator"
        description="Calculate accurate regional material volume and estimated project costs for open and closed cell spray foam insulation in seconds."
        path="/spray-foam-insulation-cost-calculator"
      />

      <section className="bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container max-w-6xl py-20 md:py-28 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Insulation · Cost Estimator</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Free <span className="text-primary">Spray Foam Insulation</span> Cost Calculator
          </h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate accurate regional material volume and estimated project costs in seconds.
          </p>
        </div>
      </section>

      <section className="container max-w-6xl pb-24">
        <Card className="grid md:grid-cols-2 gap-0 overflow-hidden border-border/60 shadow-sm">
          {/* LEFT — Inputs */}
          <div className="p-8 md:p-10 space-y-8 bg-card">
            <header>
              <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Project Details</h2>
              <p className="text-2xl font-semibold mt-2">Tell us about the job</p>
            </header>

            <div className="space-y-2">
              <Label htmlFor="zip">Project Location · 5-digit ZIP <span className="text-destructive">*</span></Label>
              <Input
                id="zip"
                inputMode="numeric"
                maxLength={5}
                placeholder="98101"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                className="text-lg"
              />
              {zip && !zipValid && <p className="text-xs text-destructive">Enter a 5-digit ZIP.</p>}
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label>Total Area</Label>
                <span className="text-sm tabular-nums text-muted-foreground">{area.toLocaleString()} sq ft</span>
              </div>
              <Slider value={[area]} min={100} max={10000} step={50} onValueChange={(v) => setArea(v[0])} />
              <Input
                type="number"
                min={100}
                step={50}
                value={area}
                onChange={(e) => setArea(Math.max(0, Number(e.target.value) || 0))}
                className="h-9"
              />
            </div>

            <div className="space-y-3">
              <Label>Project Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(FOAM_RATES) as FoamType[]).map((k) => {
                  const active = foam === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setFoam(k)}
                      className={cn(
                        "text-left rounded-lg border p-4 transition-all",
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="font-medium">{FOAM_RATES[k].label}</div>
                      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {FOAM_RATES[k].desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label>Cured Thickness</Label>
                <span className="text-sm tabular-nums text-muted-foreground">{thickness} in</span>
              </div>
              <Slider value={[thickness]} min={1} max={10} step={0.5} onValueChange={(v) => setThickness(v[0])} />
            </div>
          </div>

          {/* RIGHT — Results */}
          <div className="p-8 md:p-10 bg-muted/30 border-t md:border-t-0 md:border-l border-border/60 space-y-8">
            <header>
              <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Live Estimate</h2>
              <p className="text-2xl font-semibold mt-2">Your project at a glance</p>
            </header>

            {!zipValid ? (
              <div className="rounded-xl border border-dashed border-border bg-background/50 p-8 text-center text-muted-foreground">
                Enter a 5-digit ZIP code to unlock your localized estimate.
              </div>
            ) : (
              <>
                <div className="rounded-xl bg-background border border-border/60 p-6">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Board Feet Required</div>
                  <div className="mt-2 text-4xl font-semibold tabular-nums">
                    {calc?.boardFeet.toLocaleString()}<span className="text-base font-normal text-muted-foreground ml-2">bd ft</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {area.toLocaleString()} sq ft × {thickness} in · {FOAM_RATES[foam].label}
                  </div>
                </div>

                <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
                  <div className="text-xs uppercase tracking-wider text-primary/80">Estimated Local Cost</div>
                  <div className="mt-2 text-4xl font-semibold tabular-nums text-primary">
                    {calc && `${formatUSD(calc.low)} – ${formatUSD(calc.high)}`}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Estimate adjusted for regional labor variables in zip code {zip}. ({region?.label})
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* LEAD CAPTURE */}
        <Card className="mt-8 p-8 md:p-10 border-border/60">
          {submitted ? (
            <div className="text-center py-6">
              <p className="text-2xl font-semibold">You're locked in.</p>
              <p className="text-muted-foreground mt-2">
                Verified insulation crews in {zip} will reach out with competitive bids within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold">
                  Lock In This Price & Receive Bids From Verified Local Insulation Crews
                </h3>
                <p className="text-muted-foreground mt-1">Free, no-obligation. Up to 3 vetted local bids.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" size="lg" disabled={submitting || !zipValid} className="w-full md:w-auto">
                {submitting ? "Sending…" : "Get My Verified Bids"}
              </Button>
              {!zipValid && (
                <p className="text-xs text-muted-foreground">Enter a valid ZIP above to enable submission.</p>
              )}
            </form>
          )}
        </Card>
      </section>
    </>
  );
}
