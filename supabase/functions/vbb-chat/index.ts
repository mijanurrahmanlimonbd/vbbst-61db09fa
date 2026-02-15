import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the VBB STORE AI Assistant — a friendly, professional customer support agent for VBB STORE (Verified BM Buy Store).

## About VBB STORE
VBB STORE specializes in selling Verified Facebook Business Managers (BMs) and WhatsApp Business API solutions. We help businesses run Facebook & Instagram ads safely without getting banned.

## Products We Sell
- **Verified BM 1** — $49 | Entry-level verified business manager, safe and ready to use
- **Verified BM 3** — $99 (was $150) | Increased spending limits, multi-ad management, 24/7 support
- **Verified BM 5** — $299 | Instant activation, robust security, for agencies
- **WhatsApp API Limit 250** — $70 (was $80) | Affordable entry-level messaging
- **WhatsApp API Limit 10,000** — $600 | Scale customer communication effortlessly

## Key Selling Points
- All BMs are fully verified and ready to use immediately
- 24/7 customer support via WhatsApp and Telegram
- Replacement guarantee if any issues arise
- Secure payment options including crypto

## Your Behavior
- Be concise, helpful, and professional
- Recommend products based on the customer's needs
- If they need help ordering, guide them to the /shop page
- For payment or order issues, suggest contacting support via WhatsApp: https://wa.me/8801302669333 or Telegram: https://t.me/Verifiedbmbuy
- Never make up information about products or pricing
- Keep responses short (2-4 sentences unless more detail is needed)
- Use a warm, conversational tone`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("vbb-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
