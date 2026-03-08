import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { product_type, product_name, bank_name, existing_data } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (product_type === "credit_card") {
      systemPrompt = `You are an expert financial product copywriter for Indian credit cards. Generate compelling, accurate product descriptions and features. Be specific to Indian market context (mention INR, Indian banks, local benefits). Keep language professional yet accessible.`;

      userPrompt = `Generate enhanced content for this credit card:

Card Name: ${product_name}
Bank: ${bank_name}
${existing_data?.annual_fee ? `Annual Fee: ₹${existing_data.annual_fee}` : ""}
${existing_data?.cashback_rate ? `Current Cashback: ${existing_data.cashback_rate}` : ""}
${existing_data?.reward_points ? `Current Rewards: ${existing_data.reward_points}` : ""}
${existing_data?.features?.length ? `Existing Features: ${existing_data.features.join(", ")}` : ""}

Please provide:
1. An enhanced cashback_rate description (max 25 chars, e.g., "5% on dining & travel")
2. An enhanced reward_points description (max 30 chars, e.g., "10X points on online shopping")
3. An enhanced welcome_bonus (max 30 chars, e.g., "₹2,000 Amazon voucher")
4. 5 compelling features (each max 40 chars, specific benefits)

Respond ONLY with valid JSON in this exact format:
{
  "cashback_rate": "string",
  "reward_points": "string", 
  "welcome_bonus": "string",
  "features": ["feature1", "feature2", "feature3", "feature4", "feature5"]
}`;
    } else if (product_type === "loan") {
      systemPrompt = `You are an expert financial product copywriter for Indian loan products. Generate compelling, accurate product descriptions and features. Be specific to Indian market context (mention INR, Indian regulations, local benefits). Keep language professional yet accessible.`;

      userPrompt = `Generate enhanced content for this loan product:

Loan Name: ${product_name}
Bank: ${bank_name}
${existing_data?.interest_rate ? `Interest Rate: ${existing_data.interest_rate}%` : ""}
${existing_data?.min_amount ? `Min Amount: ₹${existing_data.min_amount}` : ""}
${existing_data?.max_amount ? `Max Amount: ₹${existing_data.max_amount}` : ""}
${existing_data?.processing_fee ? `Processing Fee: ${existing_data.processing_fee}` : ""}
${existing_data?.features?.length ? `Existing Features: ${existing_data.features.join(", ")}` : ""}

Please provide:
1. An enhanced processing_fee description (max 30 chars, e.g., "0.5% or ₹5,000 max")
2. 5 compelling features (each max 50 chars, specific benefits like quick disbursal, minimal docs, etc.)

Respond ONLY with valid JSON in this exact format:
{
  "processing_fee": "string",
  "features": ["feature1", "feature2", "feature3", "feature4", "feature5"]
}`;
    } else {
      throw new Error("Invalid product_type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const enhanced = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ success: true, data: enhanced }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI enhance error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
