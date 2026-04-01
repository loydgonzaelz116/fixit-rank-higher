import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image: string;
  meta_description: string;
  author: string;
  read_time: string;
  created_at: string;
}

export async function getPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, category, featured_image, meta_description, author, read_time, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, category, featured_image, meta_description, author, read_time, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }
  return data;
}

export async function addPost(
  post: Omit<BlogPost, "id" | "created_at">
): Promise<{ success: boolean; slug?: string; error?: string }> {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      featured_image: post.featured_image,
      meta_description: post.meta_description,
      author: post.author,
      read_time: post.read_time,
    })
    .select("slug")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, slug: data.slug };
}

export async function captureEmail(data: {
  first_name: string;
  email: string;
  trade?: string;
  source?: string;
}): Promise<boolean> {
  const { error } = await supabase.from("email_captures").insert({
    first_name: data.first_name,
    email: data.email,
    trade: data.trade || null,
    source: data.source || "checklist",
  });
  if (error) {
    console.error("Error capturing email:", error);
    return false;
  }

  // Also subscribe to Beehiiv
  try {
    await supabase.functions.invoke("subscribe-beehiiv", {
      body: { email: data.email },
    });
  } catch (e) {
    console.error("Beehiiv subscription error:", e);
  }

  return true;
}

export async function submitContact(data: {
  name: string;
  email: string;
  business_type?: string;
  city?: string;
  message?: string;
}): Promise<boolean> {
  const { error } = await supabase.from("contact_submissions").insert({
    name: data.name,
    email: data.email,
    business_type: data.business_type || null,
    city: data.city || null,
    message: data.message || null,
  });
  if (error) {
    console.error("Error submitting contact:", error);
    return false;
  }
  return true;
}

export function getCategories(): string[] {
  return ["SEO Tips", "Google Business", "Local Marketing", "Case Studies"];
}
