import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductHero from "@/components/ProductHero";
import PremiumProductCard from "@/components/PremiumProductCard";
import CategoryComingSoon from "@/components/CategoryComingSoon";
import { useCategoryComingSoon } from "@/hooks/useCategoryComingSoon";
import { motion } from "framer-motion";
import { Shield, LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Insurance = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { isComingSoon } = useCategoryComingSoon("insurance");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("insurance_products").select("*").eq("is_active", true).order("rating", { ascending: false });
      setProducts(data ?? []);
      setLoading(false);
    };
    fetch();
    const ch = supabase.channel("ins-rt").on("postgres_changes", { event: "*", schema: "public", table: "insurance_products" }, () => fetch()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const types = ["all", ...new Set(products.map(p => p.insurance_type))];
  const filtered = filter === "all" ? products : products.filter(p => p.insurance_type === filter);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Best Insurance Plans in India 2026 | KriyaPay" description="Compare top health, life, motor insurance plans from India's leading insurers." canonical="https://kriyapay.lovable.app/insurance" />
      <Navbar />
      {isComingSoon ? (
        <CategoryComingSoon title="Insurance" description="Best insurance comparison platform coming soon!" />
      ) : (
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <ProductHero title="Best" highlight="Insurance Plans" description="Compare health, life & motor insurance from top insurers in India. Find the best coverage at lowest premiums." count={products.length} icon={<Shield className="w-5 h-5 text-primary" />} />

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2 flex-wrap">
              {types.map(t => (
                <Button key={t} variant={filter === t ? "default" : "outline"} size="sm" onClick={() => setFilter(t)} className="rounded-xl capitalize">{t}</Button>
              ))}
            </div>
            <div className="flex gap-1">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")}><LayoutGrid className="w-4 h-4" /></Button>
              <Button variant={viewMode === "table" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("table")}><Table2 className="w-4 h-4" /></Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <PremiumProductCard key={p.id} index={i} title={p.product_name} subtitle={p.company_name} badge={p.insurance_type} rating={p.rating}
                  stats={[
                    ...(p.premium_starting ? [{ label: "Premium From", value: p.premium_starting }] : []),
                    ...(p.coverage_amount ? [{ label: "Coverage", value: p.coverage_amount }] : []),
                  ]}
                  features={p.features || []} applyLink={p.apply_link} featureIcon={<Shield className="w-3 h-3" />} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/50">
                  <th className="p-3 text-left font-semibold">Product</th><th className="p-3 text-left font-semibold">Company</th>
                  <th className="p-3 text-left font-semibold">Type</th><th className="p-3 text-left font-semibold">Premium</th>
                  <th className="p-3 text-left font-semibold">Coverage</th><th className="p-3 text-left font-semibold">Rating</th><th className="p-3"></th>
                </tr></thead>
                <tbody>{filtered.map(p => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{p.product_name}</td>
                    <td className="p-3 text-muted-foreground">{p.company_name}</td>
                    <td className="p-3 capitalize text-muted-foreground">{p.insurance_type}</td>
                    <td className="p-3 text-foreground">{p.premium_starting || "N/A"}</td>
                    <td className="p-3 text-foreground">{p.coverage_amount || "N/A"}</td>
                    <td className="p-3">{p.rating ? `⭐ ${p.rating}` : "—"}</td>
                    <td className="p-3">{p.apply_link && <Button size="sm" variant="outline" className="rounded-xl" asChild><a href={p.apply_link} target="_blank" rel="noopener noreferrer">Apply</a></Button>}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {!loading && filtered.length === 0 && <p className="text-center text-muted-foreground py-10">No insurance products available yet.</p>}
        </div>
      </section>
      )}
      <Footer />
    </div>
  );
};

export default Insurance;
