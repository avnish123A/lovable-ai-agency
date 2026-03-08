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
      systemPrompt = `You are an official bank content writer for Indian financial institutions. Generate OFFICIAL-sounding terms, conditions, and offer details that sound like they come directly from the bank. Use formal banking language. Include specific regulatory references where appropriate (RBI guidelines, card network terms). Be precise with numbers and percentages.`;

      userPrompt = `Generate official bank-style content for this credit card:

Card Name: ${product_name}
Bank: ${bank_name}
${existing_data?.annual_fee ? `Annual Fee: ₹${existing_data.annual_fee}` : ""}
${existing_data?.cashback_rate ? `Current Cashback: ${existing_data.cashback_rate}` : ""}
${existing_data?.reward_points ? `Current Rewards: ${existing_data.reward_points}` : ""}

Generate OFFICIAL bank-style content:
1. cashback_rate - Official rate description (e.g., "Up to 5% cashback on select categories*")
2. reward_points - Official rewards description (e.g., "Earn 10 Reward Points per ₹100 spent")
3. welcome_bonus - Official welcome offer (e.g., "Welcome Bonus of 2,500 Reward Points on first spend")
4. features - 5 official bank features with T&C style language
5. terms_conditions - 3 important T&Cs in official bank language

Respond ONLY with valid JSON:
{
  "cashback_rate": "string",
  "reward_points": "string",
  "welcome_bonus": "string",
  "features": ["feature1", "feature2", "feature3", "feature4", "feature5"],
  "terms_conditions": ["T&C 1", "T&C 2", "T&C 3"]
}`;
    } else if (product_type === "loan") {
      systemPrompt = `You are an official bank content writer for Indian financial institutions. Generate OFFICIAL-sounding terms, conditions, and offer details that sound like they come directly from the bank. Use formal banking language. Include specific regulatory references where appropriate (RBI guidelines). Be precise with numbers and percentages.`;

      userPrompt = `Generate official bank-style content for this loan product:

Loan Name: ${product_name}
Bank: ${bank_name}
${existing_data?.interest_rate ? `Interest Rate: ${existing_data.interest_rate}%` : ""}
${existing_data?.min_amount ? `Min Amount: ₹${existing_data.min_amount}` : ""}
${existing_data?.max_amount ? `Max Amount: ₹${existing_data.max_amount}` : ""}
${existing_data?.processing_fee ? `Processing Fee: ${existing_data.processing_fee}` : ""}

Generate OFFICIAL bank-style content:
1. processing_fee - Official fee description (e.g., "Processing fee: 1% of loan amount or ₹10,000, whichever is lower")
2. features - 5 official bank features with proper T&C language
3. terms_conditions - 3 important T&Cs in official bank language

Respond ONLY with valid JSON:
{
  "processing_fee": "string",
  "features": ["feature1", "feature2", "feature3", "feature4", "feature5"],
  "terms_conditions": ["T&C 1", "T&C 2", "T&C 3"]
}`;
    } else if (product_type === "deal" || product_type === "finance_deal") {
      systemPrompt = `You are an official bank/merchant content writer for Indian financial offers. Generate OFFICIAL-sounding offer descriptions, benefits, eligibility criteria, and terms & conditions that sound like they come directly from the bank or merchant. Use formal language with specific details. Include asterisks (*) for terms that apply.`;

      userPrompt = `Generate official bank/merchant-style content for this financial offer:

Offer Title: ${product_name}
Merchant/Bank: ${bank_name}
${existing_data?.cashback ? `Cashback: ${existing_data.cashback}` : ""}
${existing_data?.description ? `Current Description: ${existing_data.description}` : ""}
${existing_data?.offer_type ? `Offer Type: ${existing_data.offer_type}` : ""}

Generate OFFICIAL content in formal bank/merchant language:
1. ai_description - 2-3 sentences official description of the offer
2. ai_benefits - 5 bullet points of key benefits (official language)
3. ai_eligibility - 4 eligibility criteria (official language)
4. ai_terms - 4 terms & conditions (official legal language with *)

Respond ONLY with valid JSON:
{
  "ai_description": "string",
  "ai_benefits": "• Benefit 1\\n• Benefit 2\\n• Benefit 3\\n• Benefit 4\\n• Benefit 5",
  "ai_eligibility": "• Criteria 1\\n• Criteria 2\\n• Criteria 3\\n• Criteria 4",
  "ai_terms": "• *T&C 1\\n• *T&C 2\\n• *T&C 3\\n• *T&C 4"
}`;
    } else {
      throw new Error("Invalid product_type. Use: credit_card, loan, or deal");
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
