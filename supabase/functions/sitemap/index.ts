import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/xml; charset=utf-8",
};

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const siteUrl = "https://vbbstore.com";

  // Load sitemap settings from site_settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value")
    .like("key", "sitemap_%");

  const settingsMap: Record<string, string> = {};
  if (settings) {
    for (const s of settings) settingsMap[s.key] = s.value;
  }

  const defaultPriority = settingsMap["sitemap_default_priority"] || "0.6";
  const defaultChangefreq = settingsMap["sitemap_default_changefreq"] || "weekly";

  const staticPages = [
    { loc: "/", priority: settingsMap["sitemap_priority_home"] || "1.0", changefreq: "daily" },
    { loc: "/shop", priority: settingsMap["sitemap_priority_shop"] || "0.9", changefreq: "daily" },
    { loc: "/blog", priority: settingsMap["sitemap_priority_blog"] || "0.8", changefreq: "daily" },
    { loc: "/contact", priority: settingsMap["sitemap_priority_contact"] || "0.7", changefreq: "monthly" },
    { loc: "/about", priority: settingsMap["sitemap_priority_about"] || "0.7", changefreq: "monthly" },
  ];

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at")
    .order("created_at", { ascending: false });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${siteUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  if (posts) {
    for (const post of posts) {
      xml += `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.published_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>${defaultChangefreq}</changefreq>
    <priority>${defaultPriority}</priority>
  </url>`;
    }
  }

  if (products) {
    const productPriority = settingsMap["sitemap_product_priority"] || "0.7";
    for (const product of products) {
      xml += `
  <url>
    <loc>${siteUrl}/product/${product.slug}</loc>
    <lastmod>${new Date(product.created_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>${defaultChangefreq}</changefreq>
    <priority>${productPriority}</priority>
  </url>`;
    }
  }

  xml += `
</urlset>`;

  return new Response(xml, { headers: corsHeaders });
});
