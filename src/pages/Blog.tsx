import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import SEOHead from "@/components/SEOHead";
import { getPosts, getCategories, type BlogPost } from "@/lib/blog-data";
import { useQuery } from "@tanstack/react-query";

export default function Blog() {
  const { data: posts = [] } = useQuery<BlogPost[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  const categories = getCategories();
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      <SEOHead
        title="Blog - Local SEO Tips for Contractors"
        description="Actionable SEO tips, case studies, and local marketing guides for plumbers, HVAC, electricians, and roofers."
        path="/blog"
      />

      <section className="container py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold">Blog</h1>
        <p className="mt-2 text-muted-foreground">Actionable SEO tips for contractors who want more leads.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active === cat
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">No posts in this category yet.</p>
        )}
      </section>
    </>
  );
}
