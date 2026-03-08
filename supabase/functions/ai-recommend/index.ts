import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { salary, age, employment_type, credit_score, spending_category } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rule-based filtering: get eligible cards
    const { data: allCards } = await supabase
      .from("credit_cards")
      .select("*")
      .eq("is_active", true)
      .lte("min_salary", salary || 0)
      .lte("min_age", age || 18)
      .order("rating", { ascending: false });

    // Rule-based filtering: get eligible loans
    let loansQuery = supabase
      .from("loan_products")
      .select("*")
      .eq("is_active", true)
      .lte("min_salary", salary || 0)
      .lte("min_age", age || 18)
      .order("interest_rate", { ascending: true });

    const { data: allLoans } = await loansQuery;

    // Filter loans by employment type
    const eligibleLoans = (allLoans || []).filter((loan: any) =>
      loan.employment_type.includes(employment_type || "salaried")
    );

    // Rule-based card type prioritization
    let prioritizedCards = [...(allCards || [])];
    if (spending_category) {
      const categoryMap: Record<string, string[]> = {
        travel: ["travel", "premium"],
        shopping: ["shopping", "cashback"],
        dining: ["rewards", "premium"],
        fuel: ["fuel", "cashback"],
        general: ["cashback", "rewards"],
      };
      const preferredTypes = categoryMap[spending_category] || ["rewards"];
      prioritizedCards.sort((a: any, b: any) => {
        const aMatch = preferredTypes.includes(a.card_type) ? 0 : 1;
        const bMatch = preferredTypes.includes(b.card_type) ? 0 : 1;
        return aMatch - bMatch || b.rating - a.rating;
      });
    }

    // Credit score based filtering
    if (credit_score && credit_score < 650) {
      prioritizedCards = prioritizedCards.filter((c: any) => c.annual_fee === 0 || c.card_type === "cashback");
    }

    const topCards = prioritizedCards.slice(0, 3);
    const topLoans = eligibleLoans.slice(0, 3);

    // Now use AI for personalized explanation
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      // Return results without AI explanation
      return new Response(JSON.stringify({
        cards: topCards,
        loans: topLoans,
        explanation: "Based on your profile, here are the best matches.",
        ai_powered: false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userProfile = `Age: ${age}, Monthly Salary: ₹${salary}, Employment: ${employment_type}, Credit Score: ${credit_score || "Not provided"}, Spending Focus: ${spending_category || "General"}`;

    const cardsSummary = topCards.map((c: any) => `${c.card_name} (${c.bank_name}) - Fee: ₹${c.annual_fee}, Cashback: ${c.cashback_rate}, Rating: ${c.rating}`).join("\n");
    const loansSummary = topLoans.map((l: any) => `${l.loan_name} (${l.bank_name}) - Rate: ${l.interest_rate}%, Amount: ₹${l.min_amount}-₹${l.max_amount}`).join("\n");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: `You are a financial advisor AI for ApniNivesh, India's trusted finance comparison platform by Inspirex Technologies INC. Given a user's financial profile and pre-filtered product recommendations, provide a brief, personalized explanation (2-3 sentences) of why these products are the best fit. Be specific about how the products match their spending patterns and financial situation. Use a friendly, professional tone. Respond in plain text, no markdown.`,
          },
          {
            role: "user",
            content: `User Profile:\n${userProfile}\n\nRecommended Credit Cards:\n${cardsSummary}\n\nRecommended Loans:\n${loansSummary}\n\nExplain why these are the best picks for this user.`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({
          cards: topCards,
          loans: topLoans,
          explanation: "Based on your profile, these are the best matches for your financial needs.",
          ai_powered: false,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI service requires payment. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI error:", aiResponse.status);
      return new Response(JSON.stringify({
        cards: topCards,
        loans: topLoans,
        explanation: "Based on your profile, these products offer the best value.",
        ai_powered: false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const explanation = aiData.choices?.[0]?.message?.content || "These are your best matches based on your profile.";

    return new Response(JSON.stringify({
      cards: topCards,
      loans: topLoans,
      explanation,
      ai_powered: true,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("recommendation error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
