import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BankLogo from "@/components/BankLogo";
import CreditCardVisual from "@/components/CreditCardVisual";
import TrustBadge from "@/components/TrustBadge";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";

const CreditCards = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      const { data } = await supabase
        .from("credit_cards")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });
      setCards(data || []);
      setLoading(false);
    };
    fetchCards();
  }, []);

  const fmt = (n: number) =>
    n === 0 ? "Free" : `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Compare <span className="text-gradient">Credit Cards</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">
              Find the perfect credit card based on rewards, cashback, and annual fees from India's top banks.
            </p>
            <div className="flex items-center justify-center gap-4">
              <TrustBadge variant="verified" />
              <TrustBadge variant="secure" />
            </div>
          </motion.div>

          <AffiliateDisclaimer variant="banner" className="mb-8" />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse h-[420px]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-card shadow-card card-hover flex flex-col overflow-hidden"
                >
                  {/* Bank header */}
                  <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div className="flex items-center gap-3">
                      <BankLogo bankName={card.bank_name} size="md" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{card.bank_name}</p>
                        <TrustBadge variant="partner" className="mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/8 px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                      <span className="text-sm font-bold text-primary">{card.rating}</span>
                    </div>
                  </div>

                  {/* Card visual */}
                  <div className="px-6 py-3">
                    <CreditCardVisual bankName={card.bank_name} cardName={card.card_name} />
                  </div>

                  {/* Product details */}
                  <div className="px-6 pb-6 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-foreground text-base mb-4">{card.card_name}</h3>

                    <div className="space-y-2.5 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Welcome Bonus</span>
                        <span className="text-foreground font-medium">{card.welcome_bonus || "—"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Annual Fee</span>
                        <span className="text-foreground font-medium">{fmt(card.annual_fee)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cashback</span>
                        <span className="text-primary font-semibold">{card.cashback_rate || "—"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rewards</span>
                        <span className="text-foreground font-medium">{card.reward_points || "—"}</span>
                      </div>
                    </div>

                    <div className="mb-5 space-y-1.5">
                      {(card.features || []).slice(0, 3).map((f: string) => (
                        <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-border flex items-center gap-3">
                      <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                        Apply Now
                      </Button>
                      <div className="flex items-center gap-1 text-accent">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">Secure</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <AffiliateDisclaimer variant="inline" className="mt-8" />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CreditCards;
