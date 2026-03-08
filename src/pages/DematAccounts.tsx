import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductHero from "@/components/ProductHero";
import PremiumProductCard from "@/components/PremiumProductCard";
import CategoryComingSoon from "@/components/CategoryComingSoon";
import { useCategoryComingSoon } from "@/hooks/useCategoryComingSoon";
import { TrendingUp, LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DematAccounts = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { isComingSoon } = useCategoryComingSoon("demat_accounts");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("demat_accounts").select("*").eq("is_active", true).order("rating", { ascending: false });
      setItems(data ?? []);
      setLoading(false);
    };
    fetch();
    const ch = supabase.channel("demat-rt").on("postgres_changes", { event: "*", schema: "public", table: "demat_accounts" }, () => fetch()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Best Demat Accounts in India 2026 | KriyaPay" description="Compare top demat & trading accounts - Zerodha, Groww, Upstox & more." canonical="https://kriyapay.lovable.app/demat-accounts" />
      <Navbar />
      {isComingSoon ? (
        <CategoryComingSoon title="Demat Accounts" description="Top trading & demat account comparisons coming soon!" />
      ) : (
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <ProductHero title="Best" highlight="Demat Accounts" description="Compare trading & demat accounts from India's top brokers. Zero brokerage, free account opening & more." count={items.length} icon={<TrendingUp className="w-5 h-5 text-primary" />} />

          <div className="flex justify-end mb-6 gap-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")}><LayoutGrid className="w-4 h-4" /></Button>
            <Button variant={viewMode === "table" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("table")}><Table2 className="w-4 h-4" /></Button>
          </div>

          {loading ? <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div> : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p, i) => (
                <PremiumProductCard key={p.id} index={i} title={p.platform_name} subtitle={p.account_type} badge={p.account_type} rating={p.rating}
                  stats={[
                    { label: "Opening Fee", value: p.account_opening_fee || "₹0" },
                    ...(p.annual_maintenance ? [{ label: "AMC", value: p.annual_maintenance }] : []),
                    ...(p.brokerage ? [{ label: "Brokerage", value: p.brokerage }] : []),
                  ]}
                  features={p.features || []} applyLink={p.apply_link} applyLabel="Open Account" featureIcon={<TrendingUp className="w-3 h-3" />} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/50">
                  <th className="p-3 text-left font-semibold">Platform</th><th className="p-3 text-left font-semibold">Type</th>
                  <th className="p-3 text-left font-semibold">Opening Fee</th><th className="p-3 text-left font-semibold">AMC</th>
                  <th className="p-3 text-left font-semibold">Brokerage</th><th className="p-3 text-left font-semibold">Rating</th><th className="p-3"></th>
                </tr></thead>
                <tbody>{items.map(p => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{p.platform_name}</td>
                    <td className="p-3 capitalize text-muted-foreground">{p.account_type}</td>
                    <td className="p-3 text-foreground">{p.account_opening_fee}</td>
                    <td className="p-3 text-foreground">{p.annual_maintenance || "N/A"}</td>
                    <td className="p-3 text-foreground">{p.brokerage || "N/A"}</td>
                    <td className="p-3">{p.rating ? `⭐ ${p.rating}` : "—"}</td>
                    <td className="p-3">{p.apply_link && <Button size="sm" variant="outline" className="rounded-xl" asChild><a href={p.apply_link} target="_blank" rel="noopener noreferrer">Open</a></Button>}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {!loading && items.length === 0 && <p className="text-center text-muted-foreground py-10">No demat accounts available yet.</p>}
        </div>
      </section>
      )}
      <Footer />
    </div>
  );
};

export default DematAccounts;
