import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Phone, Trophy } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import EmailCapture from "@/components/EmailCapture";
import SEOHead from "@/components/SEOHead";
import { getPosts, type BlogPost } from "@/lib/blog-data";
import { useQuery } from "@tanstack/react-query";

const features = [
  {
    icon: Search,
    title: "Rank Higher on Google",
    description: "Show up in the Map Pack and organic results when homeowners search for your services locally.",
  },
  {
    icon: Phone,
    title: "Get More Calls",
    description: "Convert searchers into booked jobs with optimized profiles, reviews, and landing pages.",
  },
  {
    icon: Trophy,
    title: "Beat the Big Agencies",
    description: "You don't need a $5K/month agency. Smart local SEO beats big budgets every time.",
  },
];

export default function Home() {
  const { data: posts = [] } = useQuery<BlogPost[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const recentPosts = posts.slice(0, 3);

  return (
    <>
      <SEOHead
        title="Local SEO for Contractors"
        description="Free SEO tips and tools for local contractors. Rank higher on Google, get more calls, and grow your business."
        path="/"
      />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 md:py-28 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-primary-foreground">
            Get Found. Get Hired.{" "}
            <span className="text-accent">Dominate Local Search.</span>
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Free SEO tips and tools for local contractors in the Pacific Northwest and beyond.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" asChild>
              <Link to="/free-checklist">Get the Free Checklist</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-auto py-3 px-8" asChild>
              <Link to="/blog">Read the Blog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="text-center p-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10">
                <f.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="bg-secondary/50">
          <div className="container py-16 md:py-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Latest from the Blog</h2>
              <Link to="/blog" className="text-sm font-medium text-accent hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container py-16 md:py-20 max-w-2xl mx-auto">
        <EmailCapture
          heading="Get the 7-Point Local SEO Audit Checklist"
          subheading="Free. No fluff. Built for contractors who want more calls."
          showTrade
        />
      </section>
    </>
  );
}
