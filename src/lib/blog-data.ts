export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  metaDescription: string;
  author: string;
  date: string;
  readTime: string;
}

const STORAGE_KEY = "fixitnearme_posts";

const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 Google Business Profile Mistakes Costing You Leads",
    slug: "google-business-profile-mistakes",
    excerpt: "Your GBP is your #1 lead source. Here are the most common mistakes contractors make — and how to fix them today.",
    content: `<h2 id="intro">Why Your Google Business Profile Matters</h2>
<p>For local contractors, your Google Business Profile (GBP) is often the first thing a homeowner sees. If it's incomplete or poorly optimized, you're handing leads to your competition.</p>
<h2 id="mistake-1">Mistake #1: Incomplete Business Information</h2>
<p>Every field in your GBP matters. Hours, service area, categories — fill them all out. Google rewards complete profiles with higher visibility.</p>
<h2 id="mistake-2">Mistake #2: No Photos</h2>
<p>Profiles with photos get 42% more requests for directions and 35% more click-throughs. Upload photos of your work, your team, and your trucks.</p>
<h2 id="mistake-3">Mistake #3: Ignoring Reviews</h2>
<p>Respond to every review — good or bad. It shows Google (and customers) that you're active and engaged.</p>
<h2 id="mistake-4">Mistake #4: Wrong Categories</h2>
<p>Choose your primary category carefully. "Plumber" and "Plumbing Service" are different. Pick the one that matches what customers search for.</p>
<h2 id="mistake-5">Mistake #5: No Posts</h2>
<p>Google Business Posts are free advertising. Share updates, offers, and tips weekly to stay top of mind.</p>`,
    category: "Google Business",
    featuredImage: "",
    metaDescription: "Avoid these 5 common Google Business Profile mistakes that cost local contractors leads every day.",
    author: "FixItNearMe Team",
    date: "2025-03-15",
    readTime: "4 min",
  },
  {
    id: "2",
    title: "Local SEO for Plumbers: A Complete Guide",
    slug: "local-seo-for-plumbers",
    excerpt: "Rank higher than the franchises in your area with these proven local SEO strategies built for plumbing contractors.",
    content: `<h2 id="why-seo">Why Local SEO Matters for Plumbers</h2>
<p>When a pipe bursts at 2 AM, homeowners grab their phone and search "plumber near me." If you're not in the top 3 results, you don't exist.</p>
<h2 id="keywords">Finding the Right Keywords</h2>
<p>Start with service + location keywords: "emergency plumber Spokane," "drain cleaning CDA," "water heater repair near me." Use Google's autocomplete to find more.</p>
<h2 id="on-page">On-Page SEO Basics</h2>
<p>Every service page needs: a unique title tag, meta description, H1 with your keyword, and at least 500 words of helpful content.</p>
<h2 id="citations">Building Citations</h2>
<p>Get listed on Yelp, Angi, HomeAdvisor, BBB, and local directories. Keep your NAP (Name, Address, Phone) consistent everywhere.</p>
<h2 id="reviews">The Review Strategy</h2>
<p>Ask every happy customer for a Google review. Make it easy — text them a direct link. Aim for 5+ new reviews per month.</p>`,
    category: "SEO Tips",
    featuredImage: "",
    metaDescription: "Complete local SEO guide for plumbers. Rank higher on Google and get more calls from homeowners in your area.",
    author: "FixItNearMe Team",
    date: "2025-03-10",
    readTime: "6 min",
  },
  {
    id: "3",
    title: "How One HVAC Company 3x'd Their Leads in 90 Days",
    slug: "hvac-case-study-3x-leads",
    excerpt: "A real case study showing how a small HVAC company in Spokane went from 10 to 35 leads per month using local SEO.",
    content: `<h2 id="background">The Starting Point</h2>
<p>Northwest Heating & Air had been in business for 12 years but relied entirely on word-of-mouth. Their website was outdated, they had 8 Google reviews, and they weren't showing up in map results.</p>
<h2 id="strategy">The Strategy</h2>
<p>We focused on three things: optimizing their Google Business Profile, building service-area pages for each city they served, and implementing a review generation system.</p>
<h2 id="results">The Results</h2>
<p>Within 90 days: Google reviews went from 8 to 47. Website traffic increased 280%. Monthly leads jumped from 10 to 35. They hired two new technicians to handle the volume.</p>
<h2 id="takeaways">Key Takeaways</h2>
<p>You don't need a massive budget to compete. Consistent effort on the fundamentals — GBP, reviews, and local content — beats paid ads for long-term growth.</p>`,
    category: "Case Studies",
    featuredImage: "",
    metaDescription: "Case study: How a Spokane HVAC company tripled their leads in 90 days with local SEO strategies.",
    author: "FixItNearMe Team",
    date: "2025-03-01",
    readTime: "5 min",
  },
  {
    id: "4",
    title: "Google Ads vs SEO for Contractors: Where to Spend Your Money",
    slug: "google-ads-vs-seo-contractors",
    excerpt: "Should you invest in Google Ads or organic SEO? Here's the honest breakdown for contractors with limited budgets.",
    content: `<h2 id="overview">The Big Question</h2>
<p>Every contractor asks: should I run Google Ads or invest in SEO? The answer depends on your timeline, budget, and goals.</p>
<h2 id="ads">Google Ads: Fast but Expensive</h2>
<p>Ads get you to the top immediately, but you pay for every click — $15-80+ per click for contractor keywords. Stop paying, leads stop.</p>
<h2 id="seo">SEO: Slow but Sustainable</h2>
<p>SEO takes 3-6 months to show results, but once you rank, you get free clicks 24/7. The ROI compounds over time.</p>
<h2 id="recommendation">Our Recommendation</h2>
<p>Start with SEO as your foundation. Use ads strategically for seasonal pushes or new service launches. Never rely on ads alone.</p>`,
    category: "Local Marketing",
    featuredImage: "",
    metaDescription: "Google Ads vs SEO for contractors: an honest comparison to help you decide where to invest your marketing budget.",
    author: "FixItNearMe Team",
    date: "2025-02-20",
    readTime: "4 min",
  },
];

export function getPosts(): BlogPost[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as BlogPost[];
      return parsed.length > 0 ? parsed : defaultPosts;
    }
  } catch {}
  return defaultPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function addPost(post: Omit<BlogPost, "id">): BlogPost {
  const posts = getPosts();
  const newPost: BlogPost = { ...post, id: crypto.randomUUID() };
  posts.unshift(newPost);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return newPost;
}

export function getCategories(): string[] {
  return ["SEO Tips", "Google Business", "Local Marketing", "Case Studies"];
}
