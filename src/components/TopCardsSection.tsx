import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-14"
        >
          <div>
            <span className="tag-mono mb-4 inline-block">TOP PICKS</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3 text-foreground">
              Top Credit <em className="not-italic italic text-gradient">Cards</em>
            </h2>
            <p className="text-muted-foreground max-w-md font-body">
              Handpicked cards with the best rewards, cashback, and welcome bonuses.
            </p>
          </div>
          <Link
            to="/credit-cards"
            className="btn-brutal-outline mt-4 md:mt-0 px-6 py-2.5 rounded-lg text-sm inline-block"
          >
            View All Cards
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card overflow-hidden relative group"
            >
              <div className="flex items-center justify-between px-6 pt-5 pb-2">
                <div className="flex items-center gap-2.5">
                  <BankLogo bankName={card.bank_name} size="sm" />
                  <span className="text-xs font-semibold text-foreground font-body">{card.bank_name}</span>
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
                    <span className="text-muted-foreground font-body">Welcome Bonus</span>
                    <span className="text-foreground font-medium font-body">{card.welcome_bonus || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-body">Annual Fee</span>
                    <span className="text-foreground font-mono font-bold">{fmt(card.annual_fee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-body">Cashback</span>
                    <span className="text-primary font-mono font-bold">{card.cashback_rate || "—"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-mono font-bold text-foreground">{card.rating}</span>
                  </div>
                  <button
                    className="btn-brutal px-5 py-2 rounded-lg text-xs"
                    onClick={() => handleApply(card)}
                  >
                    Apply Now
                  </button>
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
