import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check — admin only
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleData } = await supabaseClient.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { topic, focusKeyword, category, tone } = await req.json();

    if (!topic || !focusKeyword) {
      return new Response(JSON.stringify({ error: "Topic and focus keyword are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch products for Related Products section
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: products } = await sb
      .from("products")
      .select("title, slug, price, sale_price, short_description, category, image_url")
      .eq("stock_status", "in_stock")
      .order("sort_order")
      .limit(6);

    const productListings = (products || []).map(
      (p: any) => `- ${p.title} ($${p.sale_price || p.price}) — ${p.short_description || p.category} — URL: /shop/${p.slug}`
    ).join("\n");

    const systemPrompt = `You are an expert blog writer and SEO specialist for "Verified BM services" (verifiedbmservices.com). You write professional, human-like blog posts that rank on Google.

## STRICT WRITING RULES (Human-Centric)
- Use a natural, conversational tone. Write like a knowledgeable friend explaining things.
- Use common, everyday words. NEVER use jargon, corporate fluff, or AI-sounding phrases.
- Keep sentences SHORT and punchy — maximum 15-20 words each.
- Use active voice. Avoid passive voice entirely.
- Use transition words (However, Moreover, In fact, Here's the thing, That said) to flow naturally.
- Vary sentence length. Mix short punchy sentences with slightly longer ones.
- Use "you" and "your" to address the reader directly.
- NEVER use these AI clichés: "In today's digital landscape", "It's important to note", "In conclusion", "Furthermore", "Delve into", "Navigating the", "Robust", "Leverage", "Streamline", "Holistic approach".

## SEO ARCHITECTURE (MANDATORY)
- The H1 title MUST contain the focus keyword.
- The FIRST paragraph MUST contain the focus keyword within the first 2 sentences.
- At least ONE H2 subheading MUST contain the focus keyword.
- Keyword density: 1.0-1.5% throughout the content.
- Internal links to products where relevant.

## REQUIRED STRUCTURE
The blog post MUST follow this exact structure:

1. **Key Takeaway Box** — A highlighted summary box (3-4 bullet points) at the very top
2. **Table of Contents** — Linked list of all H2 sections
3. **Introduction** — Hook the reader, state the problem, preview the solution (include focus keyword)
4. **Main Body** — 3-5 H2 sections with clear bullet points and actionable advice
5. **FAQ Section** — 3-5 questions targeting "People Also Ask" snippets, each answer 2-3 sentences
6. **Related Products** — Widget linking to relevant Verified BM products

## AVAILABLE PRODUCTS FOR INTERNAL LINKING
${productListings}

## OUTPUT FORMAT
Respond ONLY with valid JSON (no markdown fences). The JSON must have these exact fields:
{
  "title": "SEO-optimized H1 title with a power word + number (under 60 chars)",
  "slug": "seo-friendly-url-slug",
  "content": "Full HTML content of the blog post",
  "excerpt": "2-3 sentence summary for previews",
  "metaTitle": "SEO title under 60 chars with power word + number",
  "metaDescription": "Meta description under 155 chars with CTA",
  "readTime": "X min read",
  "featuredImageSlug": "branded-image-slug"
}`;

    const userPrompt = `Write a complete blog post about: "${topic}"

Focus Keyword: "${focusKeyword}"
Category: "${category || "Verified BM"}"
Tone: "${tone || "Professional and conversational"}"

Remember:
- Title MUST have a power word AND a number (e.g., "7 Proven Ways to..." or "5 Best...")
- Focus keyword "${focusKeyword}" MUST appear in: H1, first paragraph, at least one H2
- Meta description MUST be under 155 chars with a clear call-to-action
- Include the Key Takeaway box, Table of Contents, FAQ section, and Related Products widget
- Content should be 800-1200 words
- Featured image slug format: ${focusKeyword.toLowerCase().replace(/\s+/g, "-")}-guide.webp
- Related Products widget should link to: https://verifiedbmservices.com/shop/[product-slug]

For the Related Products section, use this HTML format:
<div class="related-products">
<h2>Related Products from Verified BM Services</h2>
<div class="product-grid">
[Include 2-3 most relevant products from the available list with links]
</div>
</div>

For the FAQ section, format each Q&A as:
<div class="faq-item">
<h3>Question here?</h3>
<p>Answer here (2-3 sentences).</p>
</div>

For the Key Takeaway box:
<div class="key-takeaway">
<h3>🔑 Key Takeaway</h3>
<ul>
<li>Point 1</li>
<li>Point 2</li>
<li>Point 3</li>
</ul>
</div>`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      parsed = { error: "Failed to parse AI response", raw: content };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-blog-post error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
