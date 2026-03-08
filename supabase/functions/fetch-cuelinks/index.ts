import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CUELINKS_BASE = "https://www.cuelinks.com/api/v2";
const FINANCE_CATEGORY_ID = "5";

interface CuelinksOffer {
  id: number;
  title: string;
  store?: string;
  merchant_name?: string;
  campaign_name?: string;
  description?: string;
  offer_type?: string;
  url?: string;
  tracking_url?: string;
  coupon_code?: string;
  cashback?: string;
  discount?: string;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  category?: string;
}

interface CuelinksCampaign {
  id: number;
  name: string;
  url?: string;
  tracking_url?: string;
  payout?: string;
  category?: string;
  status?: string;
}

async function fetchCuelinksOffers(apiKey: string, page = 1): Promise<any[]> {
  const url = `${CUELINKS_BASE}/offers.json?categories=${FINANCE_CATEGORY_ID}&per_page=100&page=${page}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Token token="${apiKey}"`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cuelinks Offers API error [${res.status}]: ${body}`);
  }
  const data = await res.json();
  return data.offers || data || [];
}

async function fetchCuelinksCampaigns(apiKey: string, page = 1): Promise<any[]> {
  const url = `${CUELINKS_BASE}/campaigns.json?categories=${FINANCE_CATEGORY_ID}&per_page=100&page=${page}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Token token="${apiKey}"`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cuelinks Campaigns API error [${res.status}]: ${body}`);
  }
  const data = await res.json();
  return data.campaigns || data || [];
}

function categorizeFinanceDeal(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("credit card") || text.includes("card")) return "credit_cards";
  if (text.includes("loan") || text.includes("personal loan") || text.includes("business loan")) return "loans";
  if (text.includes("insurance") || text.includes("life insurance") || text.includes("health insurance")) return "insurance";
  return "financial_offers";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("CUELINKS_API_KEY");
    if (!apiKey) throw new Error("CUELINKS_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let allDeals: any[] = [];

    // Fetch offers (paginated)
    for (let page = 1; page <= 5; page++) {
      try {
        const offers = await fetchCuelinksOffers(apiKey, page);
        if (!offers.length) break;
        for (const o of offers) {
          const title = o.title || o.name || "";
          const desc = o.description || "";
          allDeals.push({
            deal_id: `offer_${o.id}`,
            title,
            merchant: o.store || o.merchant_name || o.campaign_name || "Unknown",
            category: "finance",
            subcategory: categorizeFinanceDeal(title, desc),
            cashback: o.cashback || o.discount || o.coupon_code || null,
            description: desc,
            tracking_link: o.url || o.tracking_url || null,
            expiry_date: o.end_date || o.expiry_date || null,
            offer_type: o.offer_type || "deal",
            last_updated: new Date().toISOString(),
            is_active: true,
          });
        }
      } catch (e) {
        console.error(`Offers page ${page} error:`, e);
        break;
      }
    }

    // Fetch campaigns
    for (let page = 1; page <= 5; page++) {
      try {
        const campaigns = await fetchCuelinksCampaigns(apiKey, page);
        if (!campaigns.length) break;
        for (const c of campaigns) {
          const name = c.name || "";
          allDeals.push({
            deal_id: `campaign_${c.id}`,
            title: name,
            merchant: name,
            category: "finance",
            subcategory: categorizeFinanceDeal(name, ""),
            cashback: c.payout || null,
            description: `Finance campaign from ${name}`,
            tracking_link: c.url || c.tracking_url || null,
            expiry_date: null,
            offer_type: "campaign",
            last_updated: new Date().toISOString(),
            is_active: true,
          });
        }
      } catch (e) {
        console.error(`Campaigns page ${page} error:`, e);
        break;
      }
    }

    // Upsert deals
    let inserted = 0;
    let updated = 0;

    for (const deal of allDeals) {
      const { data: existing } = await supabase
        .from("finance_deals")
        .select("id")
        .eq("deal_id", deal.deal_id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("finance_deals")
          .update(deal)
          .eq("deal_id", deal.deal_id);
        updated++;
      } else {
        await supabase.from("finance_deals").insert(deal);
        inserted++;
      }
    }

    // Mark expired deals as inactive
    const { count: deactivated } = await supabase
      .from("finance_deals")
      .update({ is_active: false })
      .lt("expiry_date", new Date().toISOString().split("T")[0])
      .not("expiry_date", "is", null)
      .select("id", { count: "exact", head: true });

    const result = {
      success: true,
      total_fetched: allDeals.length,
      inserted,
      updated,
      deactivated: deactivated || 0,
      timestamp: new Date().toISOString(),
    };

    console.log("Cuelinks sync result:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cuelinks fetch error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
