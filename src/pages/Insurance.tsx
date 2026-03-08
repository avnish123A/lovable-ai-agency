import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Shield, Star, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BankLogo from "@/components/BankLogo";

const Insurance = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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
      <SEOHead title="Best Insurance Plans in India 2026 | KriyaPay" description="Compare top health, life, motor insurance plans from India's leading insurers. Find the best coverage at lowest premiums." canonical="https://kriyapay.lovable.app/insurance" />
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Best <span className="text-gradient">Insurance</span> Plans
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Compare health, life & motor insurance from top insurers in India</p>
          </motion.div>

          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {types.map(t => (
              <Button key={t} variant={filter === t ? "default" : "outline"} size="sm" onClick={() => setFilter(t)} className="rounded-xl capitalize">
                {t}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="secondary" className="mb-2 capitalize">{p.insurance_type}</Badge>
                          <h3 className="text-lg font-heading font-bold text-foreground">{p.product_name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1"><BankLogo bankName={p.company_name} size="sm" /> {p.company_name}</p>
                        </div>
                        {p.rating && <div className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /><span className="text-sm font-semibold">{p.rating}</span></div>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {p.premium_starting && <div><p className="text-muted-foreground text-xs">Premium From</p><p className="font-semibold text-foreground">{p.premium_starting}</p></div>}
                        {p.coverage_amount && <div><p className="text-muted-foreground text-xs">Coverage</p><p className="font-semibold text-foreground">{p.coverage_amount}</p></div>}
                      </div>

                      {p.features?.length > 0 && (
                        <ul className="space-y-1">
                          {p.features.slice(0, 3).map((f: string, idx: number) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <Shield className="w-3 h-3 text-primary mt-0.5 shrink-0" />{f}
                            </li>
                          ))}
                        </ul>
                      )}

                      {p.apply_link && (
                        <Button asChild className="w-full rounded-xl" size="sm">
                          <a href={p.apply_link} target="_blank" rel="noopener noreferrer">
                            Apply Now <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && <p className="text-center text-muted-foreground py-10">No insurance products available yet. Check back soon!</p>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Insurance;
