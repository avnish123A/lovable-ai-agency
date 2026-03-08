import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Check, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BankLogo from "@/components/BankLogo";
import CreditCardVisual from "@/components/CreditCardVisual";
import TrustBadge from "@/components/TrustBadge";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";
import SEOHead from "@/components/SEOHead";
import CategoryComingSoon from "@/components/CategoryComingSoon";
import { useCategoryComingSoon } from "@/hooks/useCategoryComingSoon";

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const CreditCards = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isComingSoon } = useCategoryComingSoon("credit_cards");

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

  const handleApply = (card: any) => {
    const dealLike = {
      id: card.id,
      title: card.card_name,
      merchant: card.bank_name,
      bank_name: card.bank_name,
      subcategory: "credit_cards",
      tracking_link: card.apply_link || null,
      is_finance_deal: false,
    };
    setSelectedCard(dealLike);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setDialogOpen(false);
    setSelectedCard(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Best Credit Cards in India 2026 – Compare & Apply | ApniNivesh"
        description="Compare best credit cards from HDFC, SBI, ICICI, Axis Bank & more. Check rewards, cashback, fees & apply online. Free comparison by ApniNivesh."
        canonical="https://apninivesh.in/credit-cards"
      />
      <Navbar />
      {isComingSoon ? (
        <CategoryComingSoon title="Credit Cards" description="Best credit card comparisons are coming soon!" />
      ) : (
      <>
      <section className="pt-28 pb-24 relative overflow-hidden">
        {/* Floating background accents */}
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[10%] w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-20 left-[5%] w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"
        />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-heading font-bold mb-4"
            >
              Compare <span className="text-gradient">Credit Cards</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-xl mx-auto mb-4"
            >
              Find the perfect credit card based on rewards, cashback, and annual fees from India's top banks.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4"
            >
              <TrustBadge variant="verified" />
              <TrustBadge variant="secure" />
            </motion.div>
          </motion.div>

          <AffiliateDisclaimer variant="banner" className="mb-8" />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 h-[420px]">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted" />
                      <div className="h-4 bg-muted rounded w-24" />
                    </div>
                    <div className="h-32 bg-muted rounded-xl" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className="rounded-2xl border border-border bg-card shadow-card flex flex-col overflow-hidden group relative"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/0 group-hover:from-primary/3 group-hover:to-accent/3 transition-all duration-500 rounded-2xl pointer-events-none" />

                  {/* Bank header */}
                  <div className="flex items-center justify-between px-6 pt-5 pb-3 relative z-10">
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
                  <div className="px-6 py-3 relative z-10">
                    {card.image_url ? (
                      <img src={card.image_url} alt={card.card_name} className="w-full h-32 object-contain rounded-lg" />
                    ) : (
                      <CreditCardVisual bankName={card.bank_name} cardName={card.card_name} />
                    )}
                  </div>

                  {/* Product details */}
                  <div className="px-6 pb-6 flex flex-col flex-1 relative z-10">
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
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                        <Button 
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                          onClick={() => handleApply(card)}
                        >
                          Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
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

      <LeadCaptureDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        deal={selectedCard}
        onSuccess={handleDialogSuccess}
      />
      </>
      )}
    </div>
  );
};

export default CreditCards;
