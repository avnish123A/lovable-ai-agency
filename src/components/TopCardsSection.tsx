import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BankLogo from "@/components/BankLogo";
import CreditCardVisual from "@/components/CreditCardVisual";
import TrustBadge from "@/components/TrustBadge";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

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
    const dealLike = {
      id: card.id,
      title: card.card_name,
      merchant: card.bank_name,
      subcategory: "credit_cards",
      tracking_link: card.apply_link || null,
    };
    setSelectedCard(dealLike);
    setDialogOpen(true);
  };

  return (
    <>
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Floating accent */}
      <motion.div
        animate={{ x: [0, 40, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
              Top Credit <span className="text-gradient">Cards</span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Handpicked cards with the best rewards, cashback, and welcome bonuses.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="outline" className="mt-4 md:mt-0 border-border rounded-xl">
              <Link to="/credit-cards">View All Cards</Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.25 } }}
              className="rounded-2xl border border-border bg-card shadow-card overflow-hidden relative group"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/0 group-hover:from-primary/3 group-hover:to-accent/3 transition-all duration-500 rounded-2xl pointer-events-none" />

              {/* Bank header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2 relative z-10">
                <div className="flex items-center gap-2.5">
                  <BankLogo bankName={card.bank_name} size="sm" />
                  <span className="text-xs font-semibold text-foreground">{card.bank_name}</span>
                </div>
                <TrustBadge variant="verified" />
              </div>

              {/* Card visual */}
              <div className="px-6 py-3 relative z-10">
                <CreditCardVisual bankName={card.bank_name} cardName={card.card_name} />
              </div>

              {/* Details */}
              <div className="px-6 pb-6 relative z-10">
                <h3 className="font-heading font-bold text-foreground text-sm mb-3">{card.card_name}</h3>
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
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-bold text-foreground">{card.rating}</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
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
