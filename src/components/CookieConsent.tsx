import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const STORAGE_KEY = "cookie-consent-v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  timestamp: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __onAnalyticsConsent?: (granted: boolean) => void;
  }
}

function applyConsent(consent: Consent) {
  // Google Consent Mode v2 (no-op if gtag isn't loaded)
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
    });
  }
  // Custom hook for app-level analytics initialization
  if (typeof window !== "undefined" && typeof window.__onAnalyticsConsent === "function") {
    window.__onAnalyticsConsent(consent.analytics);
  }
}

function saveConsent(analytics: boolean) {
  const consent: Consent = { necessary: true, analytics, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  applyConsent(consent);
  return consent;
}

export function getStoredConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    if (existing) {
      applyConsent(existing);
    } else {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAcceptAll = () => {
    saveConsent(true);
    setVisible(false);
  };
  const handleReject = () => {
    saveConsent(false);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card text-card-foreground shadow-lg">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="text-sm text-muted-foreground">
            We use cookies for essential site functionality and, with your consent,
            analytics to improve your experience.{" "}
            <Link to="/about" className="underline hover:text-foreground">
              Learn more
            </Link>
            .
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={handleReject}>
              Reject
            </Button>
            <Button size="sm" onClick={handleAcceptAll}>
              Accept all
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
