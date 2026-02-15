import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_ROBOTS = `# =============================================
# robots.txt — Verified BM services
# =============================================

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /checkout
Disallow: /admin/login

User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /checkout

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout
Disallow: /api/

# Sitemap
Sitemap: https://verifiedbmservices.com/sitemap.xml`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "robots_txt")
    .single();

  const content = data?.value || DEFAULT_ROBOTS;

  return new Response(content, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
