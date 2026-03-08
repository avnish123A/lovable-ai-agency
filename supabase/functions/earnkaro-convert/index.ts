const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// EarnKaro affiliate link conversion
// Note: EarnKaro uses a smart-link approach where you can construct affiliate URLs

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, source } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const EARNKARO_ID = Deno.env.get("EARNKARO_AFFILIATE_ID");
    
    // EarnKaro smart link format
    // Format: https://ekaro.in/enkr{timestamp}{affiliate_id}?url={encoded_url}
    const timestamp = Date.now().toString(36);
    const affiliateId = EARNKARO_ID || "apninivesh";
    
    // Encode the original URL
    const encodedUrl = encodeURIComponent(url);
    
    // Construct EarnKaro affiliate link
    const affiliateLink = `https://ekaro.in/enkr${timestamp}${affiliateId}?s=${source || "web"}&url=${encodedUrl}`;

    return new Response(
      JSON.stringify({
        success: true,
        original_url: url,
        affiliate_url: affiliateLink,
        platform: "earnkaro",
        source: source || "web",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("EarnKaro conversion error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Conversion failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
