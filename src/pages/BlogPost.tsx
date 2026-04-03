import { useParams, Link } from "react-router-dom";
import { getPostBySlug, type BlogPost } from "@/lib/blog-data";
import SEOHead from "@/components/SEOHead";
import EmailCapture from "@/components/EmailCapture";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<BlogPost | null>({
    queryKey: ["post", slug],
    queryFn: () => (slug ? getPostBySlug(slug) : Promise.resolve(null)),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-accent hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const headingRegex = /<h2 id="([^"]+)">([^<]+)<\/h2>/g;
  const toc: { id: string; text: string }[] = [];
  let match;
  while ((match = headingRegex.exec(post.content)) !== null) {
    toc.push({ id: match[1], text: match[2] });
  }

  return (
    <>
      <SEOHead title={post.title} description={post.meta_description} path={`/blog/${post.slug}`} />

      <article className="container py-12 md:py-16 max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          {post.category}
        </span>

        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">{post.title}</h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.read_time} read
          </span>
        </div>

        {toc.length > 0 && (
          <nav className="mt-8 rounded-lg bg-secondary p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">In This Article</h3>
            <ul className="space-y-2">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="text-sm text-primary hover:text-accent transition-colors">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div
          className="mt-8 prose prose-slate max-w-none prose-headings:text-primary prose-a:text-accent"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-8 rounded-lg bg-secondary p-5 border border-border">
          <p className="text-sm text-primary">
            Catching a game this weekend? Find the best sports bars and watch guides in Spokane at{" "}
            <a href="https://eventdayguide.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">
              EventDayGuide.com
            </a>.
          </p>
        </div>

        <div className="mt-12 rounded-lg bg-secondary p-6 flex gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shrink-0">
            F
          </div>
          <div>
            <p className="font-semibold text-primary">{post.author}</p>
            <p className="text-sm text-muted-foreground">
              Helping local contractors get found online. Based in the Pacific Northwest.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <EmailCapture
            heading="Want more tips like this?"
            subheading="Get the free 7-Point Local SEO Checklist and weekly contractor marketing tips."
            showTrade
            source="blog-inline"
            compact
          />
        </div>
      </article>
    </>
  );
}
