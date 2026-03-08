import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const productPrompts: Record<string, (name: string, bank: string, data: any) => { system: string; user: string }> = {
  credit_card: (name, bank, data) => ({
    system: "You are an official bank content writer for Indian financial institutions. Generate OFFICIAL-sounding content. Use formal banking language. Be precise with numbers.",
    user: `Generate official content for credit card:
Card: ${name}, Bank: ${bank}
${data?.annual_fee ? `Annual Fee: ₹${data.annual_fee}` : ""}
${data?.cashback_rate ? `Cashback: ${data.cashback_rate}` : ""}

Generate JSON ONLY:
{"cashback_rate":"string","reward_points":"string","welcome_bonus":"string","features":["f1","f2","f3","f4","f5"]}`
  }),
  loan: (name, bank, data) => ({
    system: "You are an official bank content writer for Indian financial institutions.",
    user: `Generate official content for loan:
Loan: ${name}, Bank: ${bank}
${data?.interest_rate ? `Rate: ${data.interest_rate}%` : ""}
${data?.processing_fee ? `Fee: ${data.processing_fee}` : ""}

Generate JSON ONLY:
{"processing_fee":"string","features":["f1","f2","f3","f4","f5"]}`
  }),
  insurance: (name, company, data) => ({
    system: "You are an official insurance content writer for Indian insurance companies. Generate professional, trustworthy descriptions.",
    user: `Generate official content for insurance product:
Product: ${name}, Company: ${company}
Type: ${data?.insurance_type || "health"}
${data?.premium_starting ? `Premium: ${data.premium_starting}` : ""}
${data?.coverage_amount ? `Coverage: ${data.coverage_amount}` : ""}

Generate JSON ONLY:
{"description":"2-3 sentences official description","premium_starting":"starting premium text","coverage_amount":"coverage text","features":["f1","f2","f3","f4","f5"]}`
  }),
  bank_account: (name, bank, data) => ({
    system: "You are an official bank content writer for Indian banks. Generate professional account descriptions.",
    user: `Generate official content for bank account:
Account: ${name}, Bank: ${bank}
Type: ${data?.account_type || "savings"}
${data?.min_balance ? `Min Balance: ${data.min_balance}` : ""}
${data?.interest_rate ? `Interest: ${data.interest_rate}%` : ""}

Generate JSON ONLY:
{"description":"2-3 sentences","min_balance":"formatted min balance","features":["f1","f2","f3","f4","f5"]}`
  }),
  demat_account: (name, _bank, data) => ({
    system: "You are a financial content writer specializing in Indian stock brokers and trading platforms.",
    user: `Generate official content for demat/trading platform:
Platform: ${name}
Type: ${data?.account_type || "trading"}
${data?.brokerage ? `Brokerage: ${data.brokerage}` : ""}
${data?.account_opening_fee ? `Opening Fee: ${data.account_opening_fee}` : ""}

Generate JSON ONLY:
{"description":"2-3 sentences","brokerage":"brokerage description","annual_maintenance":"AMC description","features":["f1","f2","f3","f4","f5"]}`
  }),
  fixed_deposit: (name, bank, data) => ({
    system: "You are an official bank content writer for Indian banks. Generate professional FD scheme descriptions.",
    user: `Generate official content for fixed deposit:
Scheme: ${name}, Bank: ${bank}
${data?.interest_rate ? `Rate: ${data.interest_rate}%` : ""}
${data?.senior_citizen_rate ? `Senior Rate: ${data.senior_citizen_rate}%` : ""}
${data?.min_tenure ? `Min Tenure: ${data.min_tenure}` : ""}

Generate JSON ONLY:
{"description":"2-3 sentences","features":["f1","f2","f3","f4","f5"]}`
  }),
  cashback: (name, _bank, data) => ({
    system: "You are a deals/offers content writer for Indian e-commerce and finance platforms.",
    user: `Generate compelling content for cashback offer:
Store: ${name}
${data?.category ? `Category: ${data.category}` : ""}
${data?.cashback_value ? `Cashback: ${data.cashback_value}` : ""}

Generate JSON ONLY:
{"description":"2-3 sentences compelling offer description","claim_instructions":"step by step claim instructions in 3-4 lines"}`
  }),
  deal: (name, bank, data) => ({
    system: "You are an official bank/merchant content writer for Indian financial offers.",
    user: `Generate official content for financial offer:
Title: ${name}, Merchant: ${bank}
${data?.cashback ? `Cashback: ${data.cashback}` : ""}
${data?.description ? `Description: ${data.description}` : ""}

Generate JSON ONLY:
{"ai_description":"2-3 sentences","ai_benefits":"• B1\\n• B2\\n• B3\\n• B4\\n• B5","ai_eligibility":"• E1\\n• E2\\n• E3\\n• E4","ai_terms":"• *T1\\n• *T2\\n• *T3\\n• *T4"}`
  }),
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { product_type, product_name, bank_name, existing_data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const type = product_type === "finance_deal" ? "deal" : product_type;
    const promptFn = productPrompts[type];
    if (!promptFn) throw new Error(`Invalid product_type: ${product_type}`);

    const { system, user } = promptFn(product_name, bank_name, existing_data);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse AI response");

    return new Response(JSON.stringify({ success: true, data: JSON.parse(jsonMatch[0]) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI enhance error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
