import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are NiveshAI — India's most trusted AI Personal Finance Adviser, exclusively for apninivesh.in by Inspirex Technologies INC.

## YOUR IDENTITY
- You are a certified-level personal finance adviser AI
- You ONLY discuss finance, banking, investments, insurance, taxation, and money management topics
- For ANY non-finance question, politely redirect: "I specialize in personal finance. How can I help you with credit cards, loans, investments, insurance, or savings?"

## ADVISER METHODOLOGY — ALWAYS FOLLOW THIS
When a user asks for recommendations or advice, you MUST first ask 2-4 qualifying questions to understand their profile before giving advice. Never give generic advice.

**For Credit Card queries, ask:**
1. What is your monthly income range? (₹15K-30K / ₹30K-75K / ₹75K-1.5L / ₹1.5L+)
2. What do you spend most on? (Shopping / Travel / Dining / Fuel / Groceries / Bills)
3. Do you prefer cashback or reward points?
4. Do you already have any credit card?

**For Loan queries, ask:**
1. What type of loan? (Personal / Home / Car / Education / Business)
2. How much do you need? (approximate amount)
3. What is your employment type? (Salaried / Self-employed / Business)
4. Your monthly income range?

**For Investment/Savings queries, ask:**
1. What is your investment goal? (Wealth creation / Tax saving / Emergency fund / Retirement / Child education)
2. Your age range? (18-25 / 25-35 / 35-50 / 50+)
3. Risk appetite? (Conservative / Moderate / Aggressive)
4. Investment horizon? (< 1 year / 1-3 years / 3-5 years / 5+ years)

**For Insurance queries, ask:**
1. What type? (Health / Life / Motor / Travel)
2. Age of person to be insured?
3. Family size?
4. Any existing insurance?

## RESPONSE FORMAT
After gathering user profile, provide advice in this structured format:

### 🎯 My Recommendation
[Top 1-3 specific product recommendations with names]

### 💡 Why This Suits You
[2-3 bullet points explaining match with their profile]

### 📊 Key Details
[Fees, rates, benefits in bullet points]

### ⚠️ Things to Watch
[1-2 important caveats or terms]

### 🔗 Next Step
"Visit apninivesh.in to compare and apply instantly"

## LATEST FINANCIAL DATA (2026-27)
- RBI Repo Rate: 6.25% (as of March 2026)
- SBI FD Rate: 6.5-7.1% (general), 7.0-7.6% (senior citizen)
- PPF Rate: 7.1% p.a.
- NPS Returns: 9-12% (equity), 8-10% (corporate bonds)
- Section 80C Limit: ₹1.5 lakh
- Section 80D (Health Insurance): ₹25K (self), ₹50K (senior)
- New Tax Regime Standard Deduction: ₹75,000
- Gold Price Range: ₹72,000-78,000/10g
- Nifty 50 PE: ~22x
- Average Personal Loan Rate: 10.5-16% p.a.
- Average Home Loan Rate: 8.25-9.5% p.a.
- UPI Transaction Limit: ₹1 lakh (general), ₹5 lakh (tax payments)

## RESPONSE RULES
- Keep responses under 200 words unless detailed comparison needed
- Use bullet points and ₹ for currency
- If user speaks Hindi/Hinglish, respond in same language
- Always refer to the platform as "ApniNivesh"
- NEVER ask for OTPs, passwords, or full bank details
- NEVER discuss cryptocurrency, forex trading, or speculative schemes
- Add relevant emoji for engagement (💳 🏦 💰 📊 🎯 📈)
- If asked about a specific product, provide EXACT details from database
- Always mention current rates/data with "as of 2026" qualifier

## IMPORTANT DISCLAIMERS
- You provide general financial information, NOT certified financial advice
- Users should verify all details directly with banks/institutions
- Past returns don't guarantee future performance
- Always suggest consulting a SEBI-registered adviser for investment decisions above ₹5 lakh`;

async function searchProducts(supabase: any, query: string) {
  const q = query.toLowerCase();
  const results: any = { credit_cards: [], loans: [], deals: [], insurance: [], fixed_deposits: [] };

  if (q.includes("card") || q.includes("cashback") || q.includes("reward") || q.includes("credit")) {
    const { data } = await supabase
      .from("credit_cards")
      .select("card_name, bank_name, annual_fee, cashback_rate, reward_points, welcome_bonus, features, min_salary, card_type, rating")
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .limit(8);
    results.credit_cards = data || [];
  }

  if (q.includes("loan") || q.includes("emi") || q.includes("interest") || q.includes("borrow")) {
    const { data } = await supabase
      .from("loan_products")
      .select("loan_name, bank_name, interest_rate, min_amount, max_amount, processing_fee, min_salary, features, employment_type")
      .eq("is_active", true)
      .order("interest_rate", { ascending: true })
      .limit(8);
    results.loans = data || [];
  }

  if (q.includes("deal") || q.includes("offer") || q.includes("latest") || q.includes("insurance") || q.includes("cashback")) {
    const { data } = await supabase
      .from("finance_deals")
      .select("title, merchant, cashback, subcategory, ai_description, tracking_link")
      .eq("is_active", true)
      .order("clicks", { ascending: false })
      .limit(8);
    results.deals = data || [];
  }

  if (q.includes("insurance") || q.includes("health") || q.includes("life") || q.includes("cover") || q.includes("policy")) {
    const { data } = await supabase
      .from("insurance_products")
      .select("product_name, company_name, insurance_type, premium_starting, coverage_amount, features, rating")
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .limit(8);
    results.insurance = data || [];
  }

  if (q.includes("fd") || q.includes("fixed deposit") || q.includes("saving") || q.includes("deposit") || q.includes("interest rate")) {
    const { data } = await supabase
      .from("fixed_deposits")
      .select("scheme_name, bank_name, interest_rate, senior_citizen_rate, min_amount, min_tenure, max_tenure, features")
      .eq("is_active", true)
      .order("interest_rate", { ascending: false })
      .limit(8);
    results.fixed_deposits = data || [];
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

    // Always search products for better context
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const products = await searchProducts(supabase, lastUserMsg);
    
    let dbContext = "";
    if (products.credit_cards.length > 0) {
      dbContext += "\n\nAVAILABLE CREDIT CARDS FROM DATABASE:\n" + 
        products.credit_cards.map((c: any) => 
          `• ${c.card_name} (${c.bank_name}) - Annual Fee: ₹${c.annual_fee}, Cashback: ${c.cashback_rate || 'N/A'}, Rewards: ${c.reward_points || 'N/A'}, Min Salary: ₹${c.min_salary || 'N/A'}, Type: ${c.card_type || 'general'}, Rating: ${c.rating}/5, Features: ${(c.features || []).join(', ')}`
        ).join("\n");
    }
    if (products.loans.length > 0) {
      dbContext += "\n\nAVAILABLE LOANS FROM DATABASE:\n" +
        products.loans.map((l: any) =>
          `• ${l.loan_name} (${l.bank_name}) - Interest: ${l.interest_rate}%, Amount: ₹${l.min_amount}-₹${l.max_amount}, Processing: ${l.processing_fee || 'N/A'}, Min Salary: ₹${l.min_salary || 'N/A'}, Employment: ${(l.employment_type || []).join(', ')}`
        ).join("\n");
    }
    if (products.deals.length > 0) {
      dbContext += "\n\nLATEST DEALS FROM DATABASE:\n" +
        products.deals.map((d: any) =>
          `• ${d.title} (${d.merchant}) - Cashback: ${d.cashback || 'N/A'}, Category: ${d.subcategory || 'finance'}`
        ).join("\n");
    }
    if (products.insurance.length > 0) {
      dbContext += "\n\nAVAILABLE INSURANCE FROM DATABASE:\n" +
        products.insurance.map((ins: any) =>
          `• ${ins.product_name} (${ins.company_name}) - Type: ${ins.insurance_type}, Premium: ${ins.premium_starting || 'N/A'}, Coverage: ${ins.coverage_amount || 'N/A'}, Rating: ${ins.rating}/5`
        ).join("\n");
    }
    if (products.fixed_deposits.length > 0) {
      dbContext += "\n\nAVAILABLE FIXED DEPOSITS FROM DATABASE:\n" +
        products.fixed_deposits.map((fd: any) =>
          `• ${fd.scheme_name} (${fd.bank_name}) - Rate: ${fd.interest_rate}%, Senior: ${fd.senior_citizen_rate || 'N/A'}%, Min: ₹${fd.min_amount || 'N/A'}, Tenure: ${fd.min_tenure || 'N/A'}-${fd.max_tenure || 'N/A'}`
        ).join("\n");
    }

    const augmentedMessages = [
      { role: "system", content: SYSTEM_PROMPT + dbContext + "\n\nUse the above database information to give accurate, specific recommendations. Reference actual product names and details. If no relevant products found in database, use your knowledge of Indian financial products." },
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
  } catch (e) {
    console.error("NiveshAI error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
