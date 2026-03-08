const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are KriyaAI, a financial assistant created for the fintech platform kriyapay.co.in by Inspirex Technologies.

Your job is to help users understand and compare financial products in India including credit cards, personal loans, insurance, and cashback offers. You provide clear, simple, and trustworthy financial guidance for Indian users.

KNOWLEDGE DOMAIN:
- Indian credit cards, personal loans, business loans, insurance products
- Cashback offers, reward programs, EMI offers
- Financial regulations & KYC requirements in India (PAN, Aadhaar, address proof, income verification)

BANKS YOU KNOW:
HDFC Bank, ICICI Bank, Axis Bank, SBI, Kotak Mahindra Bank, IndusInd Bank, Yes Bank, RBL Bank, AU Small Finance Bank, IDFC First Bank

PRODUCT COMPARISON FACTORS:
Annual fees, cashback rewards, interest rates, eligibility, benefits, reward points, travel rewards, shopping benefits

RESPONSE STYLE:
- Always respond in simple language. Keep answers short and helpful (under 200 words unless detailed comparison needed).
- Use bullet points for comparisons. Use ₹ for Indian currency.
- If the user speaks Hindi or Hinglish, respond in the same language.
- When recommending products, suggest users visit kriyapay.co.in to compare and apply.

DISCLAIMER: If users ask for financial advice, clarify that you provide general information and users should verify details with the official bank or institution.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("KriyaAI chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
