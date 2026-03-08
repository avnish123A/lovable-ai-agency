import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const LOGO_API = "https://img.logo.dev";

// Bank domain mappings for logo fetching
const BANK_DOMAINS: Record<string, string> = {
  hdfc: "hdfcbank.com",
  icici: "icicibank.com",
  sbi: "sbi.co.in",
  axis: "axisbank.com",
  kotak: "kotak.com",
  indusind: "indusind.com",
  yes: "yesbank.in",
  idfc: "idfcfirstbank.com",
  rbl: "rblbank.com",
  federal: "federalbank.co.in",
  au: "aubank.in",
  hsbc: "hsbc.co.in",
  sc: "sc.com",
  citi: "citibank.co.in",
  amex: "americanexpress.com",
};

function getBankLogoUrl(bankName: string): string {
  const normalized = bankName.toLowerCase().replace(/\s+/g, "");
  for (const [key, domain] of Object.entries(BANK_DOMAINS)) {
    if (normalized.includes(key)) {
      return `${LOGO_API}/${domain}?token=pk_JYl8RBL1SAOv-3Yj0dPG3g`;
    }
  }
  // Fallback: try to construct from bank name
  const domain = `${normalized.replace("bank", "")}.com`;
  return `${LOGO_API}/${domain}?token=pk_JYl8RBL1SAOv-3Yj0dPG3g`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product_name, bank_name, product_type, url } = await req.json();

    if (!product_name || !bank_name) {
      return new Response(
        JSON.stringify({ success: false, error: "product_name and bank_name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get bank logo
    const logoUrl = getBankLogoUrl(bank_name);

    // Use AI to generate comprehensive product data
    const aiResponse = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a financial product data generator for Indian banks. Given a product name and bank, generate realistic and accurate product information.

Return ONLY valid JSON with this structure:
{
  "description": "2-3 sentence compelling description",
  "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
  "benefits": "Bullet point list of 4-5 key benefits",
  "eligibility": {
    "min_age": 21,
    "max_age": 60,
    "min_salary": 25000,
    "employment_types": ["salaried", "self-employed"],
    "documents": ["ID proof", "Address proof", "Income proof"]
  },
  "fees": {
    "joining_fee": 0,
    "annual_fee": 500,
    "interest_rate": 10.5,
    "processing_fee": "1%"
  },
  "rewards": {
    "cashback_rate": "1.5%",
    "reward_points": "2 points per ₹100",
    "welcome_bonus": "5000 bonus points"
  },
  "terms_summary": "Brief terms and conditions"
}

Use realistic values based on actual Indian banking products. Return ONLY JSON.`,
          },
          {
            role: "user",
            content: `Generate product data for:\nProduct Name: ${product_name}\nBank: ${bank_name}\nType: ${product_type || "credit card"}\nURL: ${url || "N/A"}`,
          },
        ],
      }),
    });

    if (aiResponse.status === 429) {
      return new Response(
        JSON.stringify({ success: false, error: "Rate limit exceeded" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (aiResponse.status === 402) {
      return new Response(
        JSON.stringify({ success: false, error: "Payment required for AI" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!aiResponse.ok) {
      console.error("AI scrape error:", aiResponse.status);
      return new Response(
        JSON.stringify({ success: false, error: "AI generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    let productData: any = {};
    try {
      const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
      productData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI product data:", content);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to parse product data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Construct final product object
    const product = {
      product_name,
      bank_name,
      product_type: product_type || "credit_card",
      logo_url: logoUrl,
      description: productData.description,
      features: productData.features,
      benefits_summary: productData.benefits,
      eligibility: productData.eligibility,
      fees: productData.fees,
      rewards: productData.rewards,
      terms_summary: productData.terms_summary,
      source_url: url || null,
      generated_at: new Date().toISOString(),
      ai_generated: true,
    };

    return new Response(
      JSON.stringify({
        success: true,
        product,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scrape error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Scraping failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
