import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby8ZDFlqzGg_zLQbbJIewSJlJh6xRgLoqHkY_wBuX9PcgCe7r2n6yXZFsmnzgjFciw/exec";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, phone, email, city, income, product } = body;

    if (!name || !phone || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = {
      name,
      phone,
      email,
      city: city || "",
      income: income || "",
      product: product || "",
      source: "kriyapay.co.in",
      user_agent: req.headers.get("user-agent") || "",
      ip: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "",
    };

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("Google Sheet response:", res.status, text);

    return new Response(JSON.stringify({ success: true, status: res.status }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error sending to Google Sheet:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
