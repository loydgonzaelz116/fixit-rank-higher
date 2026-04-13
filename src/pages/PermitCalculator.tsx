import SEOHead from "@/components/SEOHead";

export default function PermitCalculator() {
  return (
    <>
      <SEOHead
        title="Permit Calculator"
        description="Estimate permit costs for your construction project in Spokane."
        path="/permit-calculator"
      />
      <section className="container py-10 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">
          Permit Calculator
        </h1>
        <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden border border-border">
          <iframe
            src="https://asset-manager-loydgonzalez111.replit.app/calculator?trade=plumbing"
            width="100%"
            height="600"
            style={{ border: "none" }}
            title="Spokane Permit Calculator"
          />
        </div>
      </section>
    </>
  );
}
