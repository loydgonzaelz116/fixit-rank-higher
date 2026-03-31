import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/SEOHead";
import { addPost, getCategories } from "@/lib/blog-data";

export default function AdminNewPost() {
  const categories = getCategories();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    category: categories[0],
    featuredImage: "",
    metaDescription: "",
    excerpt: "",
  });
  const [result, setResult] = useState<{ success: boolean; slug?: string; error?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      setResult({ success: false, error: "Title, slug, and content are required." });
      return;
    }

    try {
      const post = addPost({
        title: form.title,
        slug: form.slug,
        content: form.content,
        category: form.category,
        featuredImage: form.featuredImage,
        metaDescription: form.metaDescription || form.excerpt,
        excerpt: form.excerpt || form.title,
        author: "FixItNearMe Team",
        date: new Date().toISOString().split("T")[0],
        readTime: `${Math.max(2, Math.ceil(form.content.split(/\s+/).length / 200))} min`,
      });
      setResult({ success: true, slug: post.slug });
      setForm({ title: "", slug: "", content: "", category: categories[0], featuredImage: "", metaDescription: "", excerpt: "" });
    } catch {
      setResult({ success: false, error: "Failed to create post." });
    }
  };

  const autoSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  return (
    <>
      <SEOHead title="Admin - New Post" description="Create a new blog post." path="/admin/new-post" />

      <section className="container py-12 max-w-2xl mx-auto">
        <h1 className="text-2xl font-extrabold">New Blog Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create and publish a new article.</p>

        {result && (
          <div className={`mt-4 rounded-lg p-4 text-sm ${result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {result.success ? (
              <>✅ Post created! Slug: <code className="font-mono">{result.slug}</code></>
            ) : (
              <>❌ {result.error}</>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) });
              }}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Slug</label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium">Excerpt</label>
            <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Content (HTML)</label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              required
              className="font-mono text-xs"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Featured Image URL (optional)</label>
            <Input value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Meta Description</label>
            <Input value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
          </div>
          <Button type="submit" variant="cta" size="lg">
            Publish Post
          </Button>
        </form>
      </section>
    </>
  );
}
