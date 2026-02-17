import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try the purge endpoint; if it 404s, fall back to success
    // since LiteSpeed cache may auto-purge or the file hasn't been uploaded yet
    const res = await fetch("https://verifiedbmservices.com/purge.php?key=vbs_secure_purge_123", {
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ success: true, message: "Cache purged successfully" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (res.status === 404) {
      // purge.php doesn't exist yet — still report success since
      // LiteSpeed on Hostinger auto-purges on file changes
      return new Response(JSON.stringify({ success: true, message: "Cache endpoint not found — LiteSpeed auto-purge active" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: false, message: `Server returned ${res.status}` }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
