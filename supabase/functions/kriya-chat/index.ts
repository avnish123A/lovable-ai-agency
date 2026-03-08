import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are KriyaAI, a premium financial assistant for kriyapay.co.in by Inspirex Technologies.

ROLE: Help Indian users discover, compare, and apply for credit cards, loans, insurance, and cashback offers.

KNOWLEDGE:
- Indian credit cards (HDFC, ICICI, Axis, SBI, Kotak, IndusInd, Yes Bank, RBL, AU, IDFC First)
- Personal/business loans, insurance, EMI offers
- KYC requirements (PAN, Aadhaar, address proof, income proof)
- Cashback, rewards, travel points systems

SMART RECOMMENDATIONS:
When users ask for recommendations, ask about:
1. Monthly income range
2. Primary spending category (travel, dining, shopping, fuel, bills)
3. Preference (cashback vs rewards vs travel)
Then recommend specific products.

RESPONSE RULES:
- Keep responses under 150 words unless detailed comparison needed
- Use bullet points and ₹ for currency
- If user speaks Hindi/Hinglish, respond in same language
- When recommending, mention "Visit kriyapay.co.in to compare and apply"
- NEVER ask for OTPs, passwords, or full bank details
- Add relevant emoji for engagement (💳 🏦 💰 📊)

TOOLS: You have access to search the product database. Use it when users ask about specific products or deals.

DISCLAIMER: Clarify you provide general info, not financial advice. Users should verify with banks.`;

async function searchProducts(supabase: any, query: string) {
  const q = query.toLowerCase();
  const results: any = { credit_cards: [], loans: [], deals: [] };

  // Search credit cards
  if (q.includes("card") || q.includes("cashback") || q.includes("reward") || q.includes("credit")) {
    const { data } = await supabase
      .from("credit_cards")
      .select("card_name, bank_name, annual_fee, cashback_rate, reward_points, welcome_bonus, features, min_salary, card_type, rating")
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .limit(5);
    results.credit_cards = data || [];
  }

  // Search loans
  if (q.includes("loan") || q.includes("emi") || q.includes("interest")) {
    const { data } = await supabase
      .from("loan_products")
      .select("loan_name, bank_name, interest_rate, min_amount, max_amount, processing_fee, min_salary, features")
      .eq("is_active", true)
      .order("interest_rate", { ascending: true })
      .limit(5);
    results.loans = data || [];
  }

  // Search deals
  if (q.includes("deal") || q.includes("offer") || q.includes("latest") || q.includes("insurance")) {
    const { data } = await supabase
      .from("finance_deals")
      .select("title, merchant, cashback, subcategory, ai_description, tracking_link")
      .eq("is_active", true)
      .order("clicks", { ascending: false })
      .limit(5);
    results.deals = data || [];
  }

  return results;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle quick actions that need data
    if (action === "fetch_products") {
      const lastUserMsg = messages[messages.length - 1]?.content || "";
      const products = await searchProducts(supabase, lastUserMsg);
      
      // Build context from database
      let dbContext = "";
      if (products.credit_cards.length > 0) {
        dbContext += "\n\nAVAILABLE CREDIT CARDS FROM DATABASE:\n" + 
          products.credit_cards.map((c: any) => 
            `• ${c.card_name} (${c.bank_name}) - Annual Fee: ₹${c.annual_fee}, Cashback: ${c.cashback_rate || 'N/A'}, Rewards: ${c.reward_points || 'N/A'}, Rating: ${c.rating}/5`
          ).join("\n");
      }
      if (products.loans.length > 0) {
        dbContext += "\n\nAVAILABLE LOANS FROM DATABASE:\n" +
          products.loans.map((l: any) =>
            `• ${l.loan_name} (${l.bank_name}) - Interest: ${l.interest_rate}%, Amount: ₹${l.min_amount}-₹${l.max_amount}, Processing: ${l.processing_fee || 'N/A'}`
          ).join("\n");
      }
      if (products.deals.length > 0) {
        dbContext += "\n\nLATEST DEALS FROM DATABASE:\n" +
          products.deals.map((d: any) =>
            `• ${d.title} (${d.merchant}) - Cashback: ${d.cashback || 'N/A'}, Category: ${d.subcategory || 'finance'}`
          ).join("\n");
      }

      const augmentedMessages = [
        { role: "system", content: SYSTEM_PROMPT + dbContext + "\n\nUse the above database information to give accurate, specific recommendations. Reference actual product names and details." },
        ...messages,
      ];

      const response = await fetch(AI_GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: augmentedMessages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please try later." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
    }

    // Default: simple streaming chat
    const response = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please try later." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("KriyaAI error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
