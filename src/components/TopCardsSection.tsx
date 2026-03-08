import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const TopCardsSection = () => {
  const [cards, setCards] = useState<any[]>([]);

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

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
          <Button asChild variant="outline" className="mt-4 md:mt-0 border-border rounded-xl">
            <Link to="/credit-cards">View All Cards</Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card shadow-card p-6 card-hover"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-sm">{card.card_name}</h3>
                  <p className="text-xs text-muted-foreground">{card.bank_name}</p>
                </div>
              </div>
              <div className="space-y-3 mb-5">
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
                  <span className="text-primary font-medium">{card.cashback_rate || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rewards</span>
                  <span className="text-foreground font-medium">{card.reward_points || "—"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-medium text-foreground">{card.rating}</span>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">Apply Now</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCardsSection;
