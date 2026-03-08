import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { product_name, bank_name, product_type, annual_fee, interest_rate, cashback, features, generate_type } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const productDetails = `
Product Name: ${product_name || "N/A"}
Bank: ${bank_name || "N/A"}
Type: ${product_type || "N/A"}
Annual Fee: ${annual_fee || "N/A"}
Interest Rate: ${interest_rate || "N/A"}
Cashback: ${cashback || "N/A"}
Features: ${features || "N/A"}
    `.trim();

    let systemPrompt = "";

    switch (generate_type) {
      case "description":
        systemPrompt = "You are a fintech copywriter for ApniNivesh. Generate a concise, compelling product description (2-3 sentences) that highlights key benefits. Use professional yet approachable tone. No markdown formatting.";
        break;
      case "benefits":
        systemPrompt = "You are a fintech advisor for ApniNivesh. List 5-6 key benefits of this financial product as bullet points. Each bullet should be one clear sentence. Start each with a relevant emoji. No markdown headers.";
        break;
      case "eligibility":
        systemPrompt = "You are a fintech advisor for ApniNivesh. Based on the product details, generate realistic eligibility requirements as bullet points. Include age, income, credit score, employment type, and documentation. Start each with ✓. No markdown headers.";
        break;
      case "terms":
        systemPrompt = "You are a fintech compliance writer for ApniNivesh. Generate a brief terms & conditions summary (4-5 key points) for this financial product. Be factual and clear. Start each with a number. No markdown headers.";
        break;
      case "all":
        systemPrompt = `You are a fintech content writer for ApniNivesh. Generate ALL of the following for this financial product. Use this exact format:

DESCRIPTION:
(2-3 sentence compelling description)

BENEFITS:
(5-6 bullet points starting with relevant emoji)

ELIGIBILITY:
(4-5 bullet points starting with ✓)

TERMS:
(4-5 numbered key terms & conditions points)

Be professional, accurate, and helpful. No markdown headers or formatting beyond what's specified.`;
        break;
      default:
        systemPrompt = "You are a fintech copywriter. Generate a short product description.";
    }

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
          { role: "user", content: `Generate content for this product:\n\n${productDetails}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Failed to generate content.";

    // If "all", parse sections
    if (generate_type === "all") {
      const sections: Record<string, string> = {};
      const parts = content.split(/\n(?=DESCRIPTION:|BENEFITS:|ELIGIBILITY:|TERMS:)/i);
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.toUpperCase().startsWith("DESCRIPTION:")) {
          sections.description = trimmed.replace(/^DESCRIPTION:\s*/i, "").trim();
        } else if (trimmed.toUpperCase().startsWith("BENEFITS:")) {
          sections.benefits = trimmed.replace(/^BENEFITS:\s*/i, "").trim();
        } else if (trimmed.toUpperCase().startsWith("ELIGIBILITY:")) {
          sections.eligibility = trimmed.replace(/^ELIGIBILITY:\s*/i, "").trim();
        } else if (trimmed.toUpperCase().startsWith("TERMS:")) {
          sections.terms = trimmed.replace(/^TERMS:\s*/i, "").trim();
        }
      }
      return new Response(JSON.stringify({ sections, raw: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("ai-content-generate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
