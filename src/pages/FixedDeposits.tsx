import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductHero from "@/components/ProductHero";
import PremiumProductCard from "@/components/PremiumProductCard";
import CategoryComingSoon from "@/components/CategoryComingSoon";
import { useCategoryComingSoon } from "@/hooks/useCategoryComingSoon";
import { Percent, LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BankLogo from "@/components/BankLogo";

const FixedDeposits = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { isComingSoon } = useCategoryComingSoon("fixed_deposits");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("fixed_deposits").select("*").eq("is_active", true).order("interest_rate", { ascending: false });
      setItems(data ?? []);
      setLoading(false);
    };
    fetch();
    const ch = supabase.channel("fd-rt").on("postgres_changes", { event: "*", schema: "public", table: "fixed_deposits" }, () => fetch()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Best Fixed Deposit Rates in India 2026 | KriyaPay" description="Compare FD interest rates from SBI, HDFC, ICICI & more." canonical="https://kriyapay.lovable.app/fixed-deposits" />
      <Navbar />
      {isComingSoon ? (
        <CategoryComingSoon title="Fixed Deposits" description="Best FD rate comparisons are coming soon!" />
      ) : (
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <ProductHero title="Best" highlight="Fixed Deposits" description="Compare FD rates from India's top banks — find the highest returns for your savings." count={items.length} icon={<Percent className="w-5 h-5 text-primary" />} />

          <div className="flex justify-end mb-6 gap-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")}><LayoutGrid className="w-4 h-4" /></Button>
            <Button variant={viewMode === "table" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("table")}><Table2 className="w-4 h-4" /></Button>
          </div>

          {loading ? <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div> : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p, i) => (
                <PremiumProductCard key={p.id} index={i} title={p.scheme_name} subtitle={p.bank_name} rating={p.rating}
                  stats={[
                    { label: "Interest Rate", value: `${p.interest_rate}% p.a.` },
                    ...(p.senior_citizen_rate ? [{ label: "Senior Citizen", value: `${p.senior_citizen_rate}%` }] : []),
                    ...(p.min_amount ? [{ label: "Min Amount", value: `₹${Number(p.min_amount).toLocaleString("en-IN")}` }] : []),
                    ...(p.min_tenure ? [{ label: "Min Tenure", value: p.min_tenure }] : []),
                  ]}
                  features={p.features || []} applyLink={p.apply_link} applyLabel="Invest Now" featureIcon={<Percent className="w-3 h-3" />} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/50">
                  <th className="p-3 text-left font-semibold">Scheme</th><th className="p-3 text-left font-semibold">Bank</th>
                  <th className="p-3 text-left font-semibold">Rate</th><th className="p-3 text-left font-semibold">Senior</th>
                  <th className="p-3 text-left font-semibold">Min Amount</th><th className="p-3 text-left font-semibold">Tenure</th><th className="p-3"></th>
                </tr></thead>
                <tbody>{items.map(p => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{p.scheme_name}</td>
                    <td className="p-3 text-muted-foreground flex items-center gap-1"><BankLogo bankName={p.bank_name} size="sm" />{p.bank_name}</td>
                    <td className="p-3 font-bold text-primary">{p.interest_rate}%</td>
                    <td className="p-3 text-foreground">{p.senior_citizen_rate ? `${p.senior_citizen_rate}%` : "N/A"}</td>
                    <td className="p-3 text-foreground">{p.min_amount ? `₹${Number(p.min_amount).toLocaleString("en-IN")}` : "N/A"}</td>
                    <td className="p-3 text-muted-foreground">{p.min_tenure || "N/A"} - {p.max_tenure || "N/A"}</td>
                    <td className="p-3">{p.apply_link && <Button size="sm" variant="outline" className="rounded-xl" asChild><a href={p.apply_link} target="_blank" rel="noopener noreferrer">Invest</a></Button>}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {!loading && items.length === 0 && <p className="text-center text-muted-foreground py-10">No fixed deposits available yet.</p>}
        </div>
      </section>
      )}
      <Footer />
    </div>
  );
};

export default FixedDeposits;
