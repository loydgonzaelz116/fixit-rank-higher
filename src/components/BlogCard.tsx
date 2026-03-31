import { Link } from "react-router-dom";
import type { BlogPost } from "@/lib/blog-data";
import { Calendar, Clock } from "lucide-react";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group rounded-lg border border-border bg-card overflow-hidden transition-shadow hover:shadow-md">
      <div className="h-40 bg-primary/5 flex items-center justify-center">
        <span className="text-3xl font-extrabold text-primary/20 select-none">
          FixIt<span className="text-accent/30">NearMe</span>
        </span>
      </div>
      <div className="p-5">
        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          {post.category}
        </span>
        <h3 className="mt-3 text-lg font-bold leading-snug group-hover:text-accent transition-colors">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}
