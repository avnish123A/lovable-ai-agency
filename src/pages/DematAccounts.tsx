import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Star, ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DematAccounts = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <SEOHead title="Best Demat Accounts in India 2026 | KriyaPay" description="Compare top demat & trading accounts - Zerodha, Groww, Upstox & more. Zero brokerage, free account opening." canonical="https://kriyapay.lovable.app/demat-accounts" />
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Best <span className="text-gradient">Demat Accounts</span></h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Compare trading & demat accounts from India's top brokers</p>
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
                          <Badge variant="secondary" className="mb-2 capitalize">{p.account_type}</Badge>
                          <h3 className="text-lg font-heading font-bold text-foreground">{p.platform_name}</h3>
                        </div>
                        {p.rating && <div className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /><span className="text-sm font-semibold">{p.rating}</span></div>}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div><p className="text-muted-foreground text-xs">Opening Fee</p><p className="font-semibold text-foreground">{p.account_opening_fee}</p></div>
                        {p.annual_maintenance && <div><p className="text-muted-foreground text-xs">AMC</p><p className="font-semibold text-foreground">{p.annual_maintenance}</p></div>}
                        {p.brokerage && <div><p className="text-muted-foreground text-xs">Brokerage</p><p className="font-semibold text-foreground">{p.brokerage}</p></div>}
                      </div>
                      {p.features?.length > 0 && (
                        <ul className="space-y-1">
                          {p.features.slice(0, 3).map((f: string, idx: number) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5"><TrendingUp className="w-3 h-3 text-primary mt-0.5 shrink-0" />{f}</li>
                          ))}
                        </ul>
                      )}
                      {p.apply_link && (
                        <Button asChild className="w-full rounded-xl" size="sm">
                          <a href={p.apply_link} target="_blank" rel="noopener noreferrer">Open Account <ExternalLink className="w-3 h-3 ml-1" /></a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {!loading && items.length === 0 && <p className="text-center text-muted-foreground py-10">No demat accounts available yet.</p>}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DematAccounts;
