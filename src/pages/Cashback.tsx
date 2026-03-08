import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Gift, Search, ArrowRight, Loader2, Zap, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import CashbackClaimDialog from "@/components/CashbackClaimDialog";
import { Link } from "react-router-dom";

interface CashbackDeal {
  id: string;
  merchant_name: string;
  merchant_logo: string | null;
  offer_title: string;
  cashback_amount: string;
  description: string | null;
  tracking_link: string;
  category: string;
  is_active: boolean;
  coupon_code: string | null;
  expiry_date: string | null;
  terms: string | null;
}

const dealVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const Cashback = () => {
  const [deals, setDeals] = useState<CashbackDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<CashbackDeal | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDeals = async () => {
      const { data } = await supabase
        .from("cashback_deals" as any)
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setDeals(data as any);
      setLoading(false);
    };
    fetchDeals();
  }, []);

  const filtered = deals.filter(d =>
    d.merchant_name.toLowerCase().includes(search.toLowerCase()) ||
    d.offer_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <SEOHead title="Cashback Rewards | ApniNivesh" description="Earn real cashback on financial products via UPI. Browse deals, submit UPI ID, and get paid." />
      <Navbar />
      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <motion.div
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-[15%] w-72 h-72 bg-primary/8 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 15, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-10 left-[10%] w-64 h-64 bg-accent/8 rounded-full blur-3xl"
          />

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
              >
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                  <Zap className="w-4 h-4" />
                </motion.div>
                Real Cashback, Real Money
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground mb-4 tracking-tight">
                Earn <span className="text-gradient">Cashback</span> on Every Deal
              </h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Browse deals, submit your UPI ID, and receive cashback directly to your bank account.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 h-12 rounded-xl border-border bg-card shadow-sm" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 border-y border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { step: "1", title: "Browse Deals", desc: "Find cashback offers" },
                { step: "2", title: "Fill Details", desc: "Enter UPI & info" },
                { step: "3", title: "Complete Purchase", desc: "Buy via tracking link" },
                { step: "4", title: "Receive Money", desc: "Cashback to your UPI" },
              ].map((item, i) => (
                <motion.div 
                  key={item.step} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center gap-2"
                >
                  <motion.div 
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow-sm"
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-heading font-bold text-foreground mb-8"
            >
              <Gift className="inline w-6 h-6 text-primary mr-2" />Available Deals ({filtered.length})
            </motion.h2>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No deals available</h3>
                <p className="text-muted-foreground">Check back soon for new cashback offers!</p>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((deal, i) => (
                  <motion.div 
                    key={deal.id} 
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={dealVariants}
                    whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    className="group rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-elegant transition-all overflow-hidden relative"
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/0 group-hover:from-primary/3 group-hover:to-accent/3 transition-all duration-500 rounded-2xl pointer-events-none" />

                    <div className="p-6 relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        {deal.merchant_logo ? (
                          <img src={deal.merchant_logo} alt={deal.merchant_name} className="w-14 h-14 rounded-xl object-contain bg-muted p-1.5" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="text-xl font-bold text-primary">{deal.merchant_name[0]}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{deal.merchant_name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{deal.offer_title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold text-sm">{deal.cashback_amount} Cashback</Badge>
                        <Badge variant="outline" className="text-xs">{deal.category}</Badge>
                      </div>
                      {deal.coupon_code && (
                        <div className="flex items-center gap-2 mb-3 bg-muted/50 rounded-lg px-3 py-2 border border-dashed border-border">
                          <Tag className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-mono text-sm font-semibold text-foreground">{deal.coupon_code}</span>
                          <button onClick={() => { navigator.clipboard.writeText(deal.coupon_code!); }} className="ml-auto text-xs text-primary hover:underline">Copy</button>
                        </div>
                      )}
                      {deal.expiry_date && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                          <Calendar className="w-3 h-3" /> Expires: {new Date(deal.expiry_date).toLocaleDateString()}
                        </p>
                      )}
                      {deal.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{deal.description}</p>}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={() => { setSelectedDeal(deal); setDialogOpen(true); }} className="w-full rounded-xl bg-primary text-primary-foreground font-semibold">
                          Get Cashback <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Track & Policy links */}
        <section className="py-8 border-t border-border bg-muted/20">
          <div className="container mx-auto px-4 text-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Link to="/track-cashback" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-semibold hover:bg-primary/20 transition-colors mb-4">
                <Search className="w-4 h-4" /> Track Your Cashback Status
              </Link>
            </motion.div>
            <p className="text-xs text-muted-foreground mb-2">By using our cashback service, you agree to our policies:</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link to="/cashback-policy" className="text-primary hover:underline">Cashback Policy</Link>
              <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>
              <Link to="/kyc-policy" className="text-primary hover:underline">KYC & Fraud Detection</Link>
              <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
            </div>
          </div>
        </section>
      </div>
      <CashbackClaimDialog open={dialogOpen} onOpenChange={setDialogOpen} deal={selectedDeal} />
      <Footer />
    </>
  );
};

export default Cashback;
