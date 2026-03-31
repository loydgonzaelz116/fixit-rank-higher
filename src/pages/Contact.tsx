import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/SEOHead";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", business: "", city: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Webhook integration point
    console.log("Contact form submitted:", form);
    setSubmitted(true);
  };

  return (
    <>
      <SEOHead
        title="Contact / Work With Us"
        description="Want us to handle your local SEO? We work with contractors in CDA, Spokane, and surrounding areas. Starting at $150/month."
        path="/contact"
      />

      <section className="container py-16 md:py-24 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold">Work With Us</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Want us to handle your local SEO automatically? We work with contractors in CDA, Spokane, and surrounding areas.
        </p>

        <div className="mt-4 inline-block rounded-lg bg-accent/10 px-4 py-2">
          <p className="text-sm font-semibold text-accent">
            Starting at $150/month — fully managed, no contracts
          </p>
        </div>

        {submitted ? (
          <div className="mt-10 rounded-lg bg-secondary p-8 text-center">
            <p className="text-lg font-semibold text-primary">🎉 Thanks for reaching out!</p>
            <p className="mt-2 text-muted-foreground">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                placeholder="Business type (e.g. Plumbing)"
                value={form.business}
                onChange={(e) => setForm({ ...form, business: e.target.value })}
              />
              <Input
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Tell us about your business and goals (optional)"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
            />
            <Button type="submit" variant="cta" size="lg" className="w-full sm:w-auto">
              Send Message
            </Button>
          </form>
        )}
      </section>
    </>
  );
}
