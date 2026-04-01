import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/SEOHead";
import { getPosts, type BlogPost } from "@/lib/blog-data";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminBlogEditor() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", category: "", content: "", featured_image: "", meta_description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  const handleSelect = (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    setSelectedId(id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      content: post.content,
      featured_image: post.featured_image,
      meta_description: post.meta_description,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);

    const { error } = await supabase
      .from("blog_posts")
      .update({
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        category: form.category,
        content: form.content,
        featured_image: form.featured_image,
        meta_description: form.meta_description,
      })
      .eq("id", selectedId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Post updated successfully." });
      const refreshed = await getPosts();
      setPosts(refreshed);
    }
    setSaving(false);
  };

  return (
    <>
      <SEOHead title="Blog Editor" description="Edit blog posts" path="/admin/blog-editor" />
      <section className="container py-12 max-w-2xl mx-auto">
        <h1 className="text-2xl font-extrabold">Edit Blog Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">Select a post to edit.</p>

        <select
          value={selectedId}
          onChange={(e) => handleSelect(e.target.value)}
          className="mt-4 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">— Select a post —</option>
          {posts.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>

        {selectedId && (
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
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
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Content (HTML)</label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={16} required className="font-mono text-xs" />
            </div>
            <div>
              <label className="text-sm font-medium">Featured Image URL</label>
              <Input value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Meta Description</label>
              <Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
            </div>
            <Button type="submit" variant="cta" size="lg" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        )}
      </section>
    </>
  );
}
