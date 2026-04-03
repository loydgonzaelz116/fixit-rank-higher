import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Bell } from "lucide-react";

const TRADES = [
  "Plumbing",
  "HVAC",
  "Roofing",
  "Electrical",
  "Painting",
  "Landscaping",
  "Fencing",
  "Flooring",
  "Deck/Patio",
  "Other",
];

export default function ComingSoon() {
  const [form, setForm] = useState({ name: "", email: "", city: "", trade: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: dbError } = await supabase.from("contractor_waitlist").insert({
      name: form.name,
      email: form.email,
      city: form.city,
      trade: form.trade || null,
    });

    if (dbError) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <>
      <SEOHead
        title="Coming Soon — Get Notified When We Launch in Your City"
        description="Join the FixItNearMe waitlist. Be the first to know when we launch local SEO tools in your city."
        path="/coming-soon"
      />

      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 md:py-24 text-center max-w-2xl mx-auto">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <MapPin className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-primary-foreground">
            We're <span className="text-accent">Coming to Your City</span>
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            FixItNearMe is expanding. Join the waitlist and be the first contractor in your area to get found.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16 max-w-lg mx-auto">
        {submitted ? (
          <div className="rounded-lg bg-accent/10 border border-accent/20 p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
              <Bell className="h-7 w-7 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">You're on the list!</h2>
            <p className="mt-3 text-muted-foreground">
              Thanks <span className="font-semibold text-primary">{form.name}</span> — you're on the list for{" "}
              <span className="font-semibold text-primary">{form.city}</span>. When FixItNearMe launches there,
              you'll hear from us first.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-xl font-bold text-center">Join the Waitlist</h2>
            <p className="text-sm text-muted-foreground text-center">
              Tell us where you work — we'll let you know as soon as we launch there.
            </p>

            <div>
              <label className="text-sm font-medium" htmlFor="wl-name">Full Name *</label>
              <Input
                id="wl-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="wl-email">Email *</label>
              <Input
                id="wl-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="wl-city">City *</label>
              <Input
                id="wl-city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                placeholder="Spokane, WA"
              />
            </div>

            <div>
              <label className="text-sm font-medium" htmlFor="wl-trade">Trade / Service Type</label>
              <select
                id="wl-trade"
                value={form.trade}
                onChange={(e) => setForm({ ...form, trade: e.target.value })}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— Select (optional) —</option>
                {TRADES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" variant="cta" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Joining..." : "Join the Waitlist"}
            </Button>
          </form>
        )}
      </section>
    </>
  );
}
