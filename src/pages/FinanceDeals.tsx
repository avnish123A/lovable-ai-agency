import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeDollarSign, ExternalLink, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SUBCATEGORIES = [
  { value: "all", label: "All Deals" },
  { value: "credit_cards", label: "Credit Cards" },
  { value: "loans", label: "Loans" },
  { value: "insurance", label: "Insurance" },
  { value: "financial_offers", label: "Other Offers" },
];

const FinanceDeals = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchDeals = async () => {
    setLoading(true);
    let query = supabase
      .from("finance_deals")
      .select("*")
      .eq("is_active", true)
      .order("last_updated", { ascending: false });

    if (filter !== "all") {
      query = query.eq("subcategory", filter);
    }

    const { data } = await query;
    setDeals(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeals();
  }, [filter]);

  const syncDeals = async () => {
    setSyncing(true);
    try {
      const res = await supabase.functions.invoke("fetch-cuelinks");
      if (res.data?.success) {
        await fetchDeals();
      }
    } catch (e) {
      console.error("Sync error:", e);
    }
    setSyncing(false);
  };

  const trackClick = async (deal: any) => {
    try {
      await supabase.functions.invoke("track-click", {
        body: { deal_id: deal.id },
      });
    } catch (e) {
      console.error("Track error:", e);
    }
    if (deal.tracking_link) {
      window.open(deal.tracking_link, "_blank", "noopener");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Latest <span className="text-gradient">Finance Deals</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Auto-updated finance offers from top banks and financial institutions via Cuelinks.
            </p>
            <Button
              variant="outline"
              onClick={syncDeals}
              disabled={syncing}
              className="border-primary/30 hover:bg-primary/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Latest Deals"}
            </Button>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {SUBCATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse h-56" />
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-20">
              <BadgeDollarSign className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No deals found</h3>
              <p className="text-muted-foreground mb-6">Click "Sync Latest Deals" to fetch offers from Cuelinks.</p>
              <Button onClick={syncDeals} disabled={syncing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                Sync Now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal, i) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border bg-card p-6 card-hover flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BadgeDollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-semibold text-foreground text-sm leading-tight line-clamp-2">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{deal.merchant}</p>
                    </div>
                  </div>

                  {deal.description && (
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{deal.description}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    {deal.cashback && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cashback/Reward</span>
                        <span className="text-primary font-medium">{deal.cashback}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <span className="text-foreground font-medium capitalize">
                        {(deal.subcategory || "finance").replace("_", " ")}
                      </span>
                    </div>
                    {deal.expiry_date && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valid Till</span>
                        <span className="text-foreground font-medium">
                          {new Date(deal.expiry_date).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <span className="text-foreground font-medium capitalize">{deal.offer_type}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border">
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => trackClick(deal)}
                    >
                      Apply Now <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FinanceDeals;
