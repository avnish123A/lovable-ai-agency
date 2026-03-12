import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BankLogo from "@/components/BankLogo";
import CreditCardVisual from "@/components/CreditCardVisual";
import TrustBadge from "@/components/TrustBadge";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";

const TopCardsSection = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      const { data } = await supabase
        .from("credit_cards")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false })
        .limit(3);
      setCards(data || []);
    };
    fetchCards();
  }, []);

  const fmt = (n: number) => (n === 0 ? "Free" : `₹${n.toLocaleString("en-IN")}`);

  const handleApply = (card: any) => {
    setSelectedCard({
      id: card.id,
      title: card.card_name,
      merchant: card.bank_name,
      subcategory: "credit_cards",
      tracking_link: card.apply_link || null,
    });
    setDialogOpen(true);
  };

  return (
    <>
    <section className="py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-border" />
              <span className="text-sm font-body font-medium tracking-widest uppercase text-muted-foreground">Top Picks</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3 text-foreground">
              Top Credit <em className="not-italic text-gradient">Cards</em>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Handpicked cards with the best rewards, cashback, and welcome bonuses.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="outline" className="mt-4 md:mt-0 border-border rounded-lg hover:border-primary/30">
              <Link to="/credit-cards">View All Cards</Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl bg-card border border-border shadow-card overflow-hidden relative group transition-all duration-500 ease-luxury hover:-translate-y-2 hover:shadow-elegant"
            >
              <div className="flex items-center justify-between px-6 pt-5 pb-2">
                <div className="flex items-center gap-2.5">
                  <BankLogo bankName={card.bank_name} size="sm" />
                  <span className="text-xs font-semibold text-foreground">{card.bank_name}</span>
                </div>
                <TrustBadge variant="verified" />
              </div>

              <div className="px-6 py-3">
                <CreditCardVisual bankName={card.bank_name} cardName={card.card_name} />
              </div>

              <div className="px-6 pb-6">
                <h3 className="font-heading font-bold text-foreground text-sm mb-3">{card.card_name}</h3>
                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Welcome Bonus</span>
                    <span className="text-foreground font-medium">{card.welcome_bonus || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Fee</span>
                    <span className="text-foreground font-mono font-medium">{fmt(card.annual_fee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cashback</span>
                    <span className="text-primary font-mono font-semibold">{card.cashback_rate || "—"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-mono font-bold text-foreground">{card.rating}</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      size="sm"
                      className="bg-gradient-cta text-primary-foreground hover:opacity-90 rounded-lg btn-neon"
                      onClick={() => handleApply(card)}
                    >
                      Apply Now
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <LeadCaptureDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      deal={selectedCard}
      onSuccess={() => { setDialogOpen(false); setSelectedCard(null); }}
    />
    </>
  );
};

export default TopCardsSection;
