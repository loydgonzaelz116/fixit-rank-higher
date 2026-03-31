import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { captureEmail } from "@/lib/blog-data";

interface EmailCaptureProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  showTrade?: boolean;
  source?: string;
  compact?: boolean;
}

export default function EmailCapture({
  heading = "Get the Free Checklist",
  subheading = "Join 500+ contractors getting weekly SEO tips.",
  buttonText = "Send It To Me",
  showTrade = false,
  source = "checklist",
  compact = false,
}: EmailCaptureProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [trade, setTrade] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    const ok = await captureEmail({
      first_name: name.trim(),
      email: email.trim(),
      trade: trade.trim() || undefined,
      source,
    });
    setLoading(false);
    if (ok) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={`rounded-lg bg-secondary p-6 text-center ${compact ? "" : "p-8"}`}>
        <p className="text-lg font-semibold text-primary">🎉 You're in!</p>
        <p className="mt-2 text-sm text-muted-foreground">Check your inbox for the checklist.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-secondary ${compact ? "p-5" : "p-8"}`}>
      {heading && <h3 className="text-lg font-bold text-primary">{heading}</h3>}
      {subheading && <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>}
      <form onSubmit={handleSubmit} className={`mt-4 space-y-3 ${compact ? "" : "max-w-md"}`}>
        <Input placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-background" />
        <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background" />
        {showTrade && (
          <Input placeholder="What trade are you in? (optional)" value={trade} onChange={(e) => setTrade(e.target.value)} className="bg-background" />
        )}
        <Button type="submit" variant="cta" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : buttonText}
        </Button>
      </form>
    </div>
  );
}
