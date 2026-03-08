import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: "Query too short" }),
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all active products for AI to search through
    const [cardsResult, loansResult, dealsResult] = await Promise.all([
      supabase.from("credit_cards").select("*").eq("is_active", true).limit(50),
      supabase.from("loan_products").select("*").eq("is_active", true).limit(50),
      supabase.from("finance_deals").select("*").eq("is_active", true).limit(50),
    ]);

    const cards = cardsResult.data || [];
    const loans = loansResult.data || [];
    const deals = dealsResult.data || [];

    // Create a product catalog for AI
    const catalogSummary = `
CREDIT CARDS (${cards.length} available):
${cards.map((c: any) => `- ID:${c.id} | ${c.card_name} by ${c.bank_name} | Type: ${c.card_type} | Fee: ₹${c.annual_fee} | Cashback: ${c.cashback_rate || "N/A"} | Rewards: ${c.reward_points || "N/A"} | Min Salary: ₹${c.min_salary}`).join("\n")}

LOAN PRODUCTS (${loans.length} available):
${loans.map((l: any) => `- ID:${l.id} | ${l.loan_name} by ${l.bank_name} | Rate: ${l.interest_rate}% | Amount: ₹${l.min_amount}-₹${l.max_amount} | Tenure: ${l.min_tenure}-${l.max_tenure} months`).join("\n")}

FINANCE DEALS (${deals.length} available):
${deals.map((d: any) => `- ID:${d.id} | ${d.title} from ${d.merchant} | Category: ${d.subcategory} | Cashback: ${d.cashback || "N/A"}`).join("\n")}
    `.trim();

    // Use AI to understand user intent and find matching products
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
            content: `You are a smart search AI for a fintech platform. Given a user's natural language query and a product catalog, identify the most relevant products.

Return a JSON response with this exact structure:
{
  "intent": "brief description of what user is looking for",
  "matched_cards": ["id1", "id2"],
  "matched_loans": ["id1", "id2"],
  "matched_deals": ["id1", "id2"],
  "summary": "1-2 sentence explanation of results"
}

Match products based on:
- Keywords (cashback, travel, low interest, no fee, etc.)
- Product type (credit card, loan, insurance)
- Bank names
- Features mentioned

Return max 5 products per category. Return empty arrays if no matches.
ONLY return valid JSON, no markdown or extra text.`,
          },
          {
            role: "user",
            content: `User Query: "${query}"\n\nProduct Catalog:\n${catalogSummary}`,
          },
        ],
      }),
    });

    if (aiResponse.status === 429) {
      return new Response(
        JSON.stringify({ success: false, error: "Rate limit exceeded. Try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (aiResponse.status === 402) {
      return new Response(
        JSON.stringify({ success: false, error: "Payment required. Please add AI credits." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI search error:", aiResponse.status, errText);
      return new Response(
        JSON.stringify({ success: false, error: "AI search failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse AI response
    let parsed: any = { matched_cards: [], matched_loans: [], matched_deals: [], intent: "", summary: "" };
    try {
      // Clean up potential markdown wrapping
      const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
    }

    // Fetch matched products by ID
    const matchedCards = cards.filter((c: any) => parsed.matched_cards?.includes(c.id));
    const matchedLoans = loans.filter((l: any) => parsed.matched_loans?.includes(l.id));
    const matchedDeals = deals.filter((d: any) => parsed.matched_deals?.includes(d.id));

    return new Response(
      JSON.stringify({
        success: true,
        query,
        intent: parsed.intent || "Product search",
        summary: parsed.summary || `Found ${matchedCards.length + matchedLoans.length + matchedDeals.length} results`,
        results: {
          cards: matchedCards,
          loans: matchedLoans,
          deals: matchedDeals,
        },
        total: matchedCards.length + matchedLoans.length + matchedDeals.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Search error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Search failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
