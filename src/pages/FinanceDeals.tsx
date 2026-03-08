import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeDollarSign, ExternalLink, RefreshCw, Sparkles, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";
import TrustBadge from "@/components/TrustBadge";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";
import { getBankLogo } from "@/lib/bank-utils";

const SUBCATEGORIES = [
  { value: "all", label: "All Deals" },
  { value: "credit_cards", label: "Credit Cards" },
  { value: "loans", label: "Loans" },
  { value: "insurance", label: "Insurance" },
  { value: "financial_offers", label: "Other Offers" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "cashback", label: "Highest Cashback" },
];

const FinanceDeals = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [leadDeal, setLeadDeal] = useState<any>(null);
  const [leadOpen, setLeadOpen] = useState(false);

  const fetchDeals = async () => {
    setLoading(true);
    let query = supabase
      .from("finance_deals")
      .select("*")
      .eq("is_active", true);

    if (filter !== "all") {
      query = query.eq("subcategory", filter);
    }

    if (sort === "newest") {
      query = query.order("last_updated", { ascending: false });
    } else if (sort === "popular") {
      query = query.order("clicks", { ascending: false });
    } else if (sort === "cashback") {
      query = query.order("cashback", { ascending: false });
    }

    const { data } = await query;
    setDeals(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeals();
  }, [filter, sort]);

  const syncDeals = async () => {
    setSyncing(true);
    try {
      const res = await supabase.functions.invoke("fetch-cuelinks");
      if (res.data?.success) await fetchDeals();
    } catch (e) {
      console.error("Sync error:", e);
    }
    setSyncing(false);
  };

  const handleApply = (deal: any) => {
    setLeadDeal({ ...deal, is_finance_deal: true });
    setLeadOpen(true);
  };

  const handleLeadSuccess = () => {
    if (leadDeal) {
      supabase.functions.invoke("track-click", { body: { deal_id: leadDeal.id } }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Latest <span className="text-gradient">Finance Deals</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">
              Auto-updated finance offers with AI-powered descriptions from top banks and financial institutions.
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <TrustBadge variant="verified" />
              <TrustBadge variant="secure" />
            </div>
            <Button variant="outline" onClick={syncDeals} disabled={syncing} className="border-primary/30 hover:bg-primary/10 rounded-xl">
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Latest Deals"}
            </Button>
          </motion.div>

          <AffiliateDisclaimer variant="banner" className="mb-8" />

          {/* Filter + Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
            <div className="flex flex-wrap justify-center gap-2">
              {SUBCATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === cat.value
                      ? "bg-primary text-primary-foreground shadow-glow-sm"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sort === opt.value
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse h-56" />
              ))}
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-20">
              <BadgeDollarSign className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No deals found</h3>
              <p className="text-muted-foreground mb-6">Click "Sync Latest Deals" to fetch offers.</p>
              <Button onClick={syncDeals} disabled={syncing} className="rounded-xl">
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} /> Sync Now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal, i) => {
                const logoUrl = getBankLogo(deal.merchant);
                return (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl border border-border bg-card shadow-card card-hover flex flex-col p-6"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={logoUrl}
                          alt={deal.merchant}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).parentElement!.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M6 12h12"/></svg>`;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading font-semibold text-foreground text-sm leading-tight line-clamp-2">
                          {deal.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{deal.merchant}</p>
                      </div>
                      <TrustBadge variant="verified" />
                    </div>

                    {(deal.ai_description || deal.description) && (
                      <div className="mb-4">
                        {deal.ai_description && (
                          <div className="flex items-center gap-1 mb-1">
                            <Sparkles className="w-3 h-3 text-accent" />
                            <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">AI Summary</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {deal.ai_description || (deal.description || "").replace(/<[^>]*>/g, "")}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      {deal.cashback && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cashback/Reward</span>
                          <span className="text-primary font-semibold">{deal.cashback}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <span className="text-foreground font-medium capitalize">{(deal.subcategory || "finance").replace("_", " ")}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border flex gap-2">
                      <Button asChild variant="outline" className="flex-1 rounded-xl" size="sm">
                        <Link to={`/deal/${deal.id}`}>View Details</Link>
                      </Button>
                      <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl" size="sm" onClick={() => handleApply(deal)}>
                        Apply <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <AffiliateDisclaimer variant="inline" className="mt-8" />
        </div>
      </section>
      <Footer />

      <LeadCaptureDialog open={leadOpen} onOpenChange={setLeadOpen} deal={leadDeal} onSuccess={handleLeadSuccess} />
    </div>
  );
};

export default FinanceDeals;
