import { Link } from "react-router-dom";
import BeehiivEmbed from "./BeehiivEmbed";

export default function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="flex justify-center mb-10">
          <BeehiivEmbed />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <span className="text-lg font-extrabold">
              FixIt<span className="text-accent">NearMe</span>
            </span>
            <p className="mt-3 text-sm text-primary-foreground/70">
              Free SEO tips and managed local marketing for contractors in the Pacific Northwest and beyond.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-foreground/80 mb-3">Pages</h4>
            <nav className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/blog", label: "Blog" },
                { to: "/free-checklist", label: "Free Resource" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary-foreground/80 mb-3">Contact</h4>
            <p className="text-sm text-primary-foreground/70">Serving contractors in CDA, Spokane, and the greater Pacific Northwest.</p>
            <Link to="/contact" className="inline-block mt-3 text-sm text-accent hover:underline">
              Work With Us →
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} FixItNearMe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
