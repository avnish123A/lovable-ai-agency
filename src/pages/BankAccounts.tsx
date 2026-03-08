import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductHero from "@/components/ProductHero";
import PremiumProductCard from "@/components/PremiumProductCard";
import CategoryComingSoon from "@/components/CategoryComingSoon";
import { useCategoryComingSoon } from "@/hooks/useCategoryComingSoon";
import { Landmark, LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BankLogo from "@/components/BankLogo";

const BankAccounts = () => {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { isComingSoon } = useCategoryComingSoon("bank_accounts");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("bank_accounts").select("*").eq("is_active", true).order("rating", { ascending: false });
      setItems(data ?? []);
      setLoading(false);
    };
    fetch();
    const ch = supabase.channel("ba-rt").on("postgres_changes", { event: "*", schema: "public", table: "bank_accounts" }, () => fetch()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const types = ["all", ...new Set(items.map(p => p.account_type))];
  const filtered = filter === "all" ? items : items.filter(p => p.account_type === filter);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Best Bank Accounts in India 2026 | ApniNivesh" description="Compare savings, current & salary accounts from top banks." canonical="https://apninivesh.in/bank-accounts" />
      <Navbar />
      {isComingSoon ? (
        <CategoryComingSoon title="Bank Accounts" description="Best bank account comparisons are on the way!" />
      ) : (
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <ProductHero title="Best" highlight="Bank Accounts" description="Compare savings, current & salary accounts from India's top banks. Zero balance accounts, high interest rates & more." count={items.length} icon={<Landmark className="w-5 h-5 text-primary" />} />

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2 flex-wrap">
              {types.map(t => <Button key={t} variant={filter === t ? "default" : "outline"} size="sm" onClick={() => setFilter(t)} className="rounded-xl capitalize">{t}</Button>)}
            </div>
            <div className="flex gap-1">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")}><LayoutGrid className="w-4 h-4" /></Button>
              <Button variant={viewMode === "table" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("table")}><Table2 className="w-4 h-4" /></Button>
            </div>
          </div>

          {loading ? <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div> : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <PremiumProductCard key={p.id} index={i} title={p.account_name} subtitle={p.bank_name} badge={p.account_type} rating={p.rating}
                  stats={[
                    ...(p.min_balance ? [{ label: "Min Balance", value: p.min_balance }] : []),
                    ...(p.interest_rate ? [{ label: "Interest Rate", value: `${p.interest_rate}%` }] : []),
                  ]}
                  features={p.features || []} applyLink={p.apply_link} applyLabel="Open Account" featureIcon={<Landmark className="w-3 h-3" />} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/50">
                  <th className="p-3 text-left font-semibold">Account</th><th className="p-3 text-left font-semibold">Bank</th>
                  <th className="p-3 text-left font-semibold">Type</th><th className="p-3 text-left font-semibold">Min Balance</th>
                  <th className="p-3 text-left font-semibold">Interest</th><th className="p-3 text-left font-semibold">Rating</th><th className="p-3"></th>
                </tr></thead>
                <tbody>{filtered.map(p => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{p.account_name}</td>
                    <td className="p-3 text-muted-foreground flex items-center gap-1"><BankLogo bankName={p.bank_name} size="sm" />{p.bank_name}</td>
                    <td className="p-3 capitalize text-muted-foreground">{p.account_type}</td>
                    <td className="p-3 text-foreground">{p.min_balance || "N/A"}</td>
                    <td className="p-3 text-foreground">{p.interest_rate ? `${p.interest_rate}%` : "N/A"}</td>
                    <td className="p-3">{p.rating ? `⭐ ${p.rating}` : "—"}</td>
                    <td className="p-3">{p.apply_link && <Button size="sm" variant="outline" className="rounded-xl" asChild><a href={p.apply_link} target="_blank" rel="noopener noreferrer">Open</a></Button>}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length === 0 && <p className="text-center text-muted-foreground py-10">No bank accounts available yet.</p>}
        </div>
      </section>
      )}
      <Footer />
    </div>
  );
};

export default BankAccounts;
