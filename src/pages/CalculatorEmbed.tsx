import { useParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

export default function CalculatorEmbed() {
  const { trade } = useParams<{ trade: string }>();

  const label = (trade || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <>
      <SEOHead
        title={`${label} Cost Estimator`}
        description={`Estimate ${label.toLowerCase()} costs for your project in Spokane & North Idaho.`}
        path={`/calculator/${trade}`}
      />
      <section className="container py-6 md:py-10">
        <div className="w-full max-w-5xl mx-auto rounded-lg overflow-hidden border border-border">
          <iframe
            src={`https://asset-manager-loydgonzalez111.replit.app/calculator?trade=${trade}`}
            width="100%"
            height="800"
            style={{ border: "none", borderRadius: "8px" }}
            title={`${label} Cost Estimator`}
          />
        </div>
      </section>
    </>
  );
}
