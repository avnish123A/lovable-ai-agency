import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Star, ExternalLink, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BankLogo from "@/components/BankLogo";
import CategoryComingSoon from "@/components/CategoryComingSoon";
import { useCategoryComingSoon } from "@/hooks/useCategoryComingSoon";

const FixedDeposits = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      <SEOHead title="Best Fixed Deposit Rates in India 2026 | KriyaPay" description="Compare FD interest rates from SBI, HDFC, ICICI & more. Find highest FD rates for regular & senior citizens." canonical="https://kriyapay.lovable.app/fixed-deposits" />
      <Navbar />
      {isComingSoon ? (
        <CategoryComingSoon title="Fixed Deposits" description="Best FD rate comparisons are coming soon!" />
      ) : (
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Best <span className="text-gradient">Fixed Deposits</span></h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Compare FD rates from India's top banks — find the highest returns</p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-heading font-bold text-foreground">{p.scheme_name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1"><BankLogo bankName={p.bank_name} size="sm" /> {p.bank_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{p.interest_rate}%</p>
                          <p className="text-xs text-muted-foreground">p.a.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {p.senior_citizen_rate && <div><p className="text-muted-foreground text-xs">Senior Citizen</p><p className="font-semibold text-foreground">{p.senior_citizen_rate}%</p></div>}
                        {p.min_amount && <div><p className="text-muted-foreground text-xs">Min Amount</p><p className="font-semibold text-foreground">₹{Number(p.min_amount).toLocaleString("en-IN")}</p></div>}
                        {p.min_tenure && <div><p className="text-muted-foreground text-xs">Min Tenure</p><p className="font-semibold text-foreground">{p.min_tenure}</p></div>}
                        {p.max_tenure && <div><p className="text-muted-foreground text-xs">Max Tenure</p><p className="font-semibold text-foreground">{p.max_tenure}</p></div>}
                      </div>
                      {p.features?.length > 0 && (
                        <ul className="space-y-1">
                          {p.features.slice(0, 3).map((f: string, idx: number) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5"><Percent className="w-3 h-3 text-primary mt-0.5 shrink-0" />{f}</li>
                          ))}
                        </ul>
                      )}
                      {p.apply_link && (
                        <Button asChild className="w-full rounded-xl" size="sm">
                          <a href={p.apply_link} target="_blank" rel="noopener noreferrer">Invest Now <ExternalLink className="w-3 h-3 ml-1" /></a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
