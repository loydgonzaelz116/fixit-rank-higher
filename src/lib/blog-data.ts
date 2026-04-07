import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  city: string | null;
  status: string;
  featured_image: string;
  meta_title: string | null;
  meta_description: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export async function getPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, category, city, status, featured_image, meta_title, meta_description, author, created_at, updated_at")
    .eq("status", "published")
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
    .select("id, title, slug, excerpt, content, category, city, status, featured_image, meta_title, meta_description, author, created_at, updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }
  return data;
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
