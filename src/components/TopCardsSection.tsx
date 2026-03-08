import { motion } from "framer-motion";
import { Star, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const cards = [
  {
    name: "Platinum Rewards Card",
    bank: "HDFC Bank",
    bonus: "₹500 Welcome Bonus",
    annualFee: "₹499",
    cashback: "5% on Dining",
    rewards: "2X Reward Points",
    rating: 4.8,
  },
  {
    name: "SimplyCLICK Card",
    bank: "SBI Cards",
    bonus: "₹500 Amazon Voucher",
    annualFee: "₹499",
    cashback: "10X on Partner Sites",
    rewards: "1.25% Cashback",
    rating: 4.6,
  },
  {
    name: "Ace Credit Card",
    bank: "Axis Bank",
    bonus: "Lifetime Free",
    annualFee: "₹0",
    cashback: "5% on Bills",
    rewards: "2% on Everything",
    rating: 4.7,
  },
];

const TopCardsSection = () => {
  return (
    <section className="py-24 bg-card/50">
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
          <Button asChild variant="outline" className="mt-4 md:mt-0 border-border">
            <Link to="/credit-cards">View All Cards</Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 card-hover"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-sm">{card.name}</h3>
                  <p className="text-xs text-muted-foreground">{card.bank}</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Welcome Bonus</span>
                  <span className="text-foreground font-medium">{card.bonus}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annual Fee</span>
                  <span className="text-foreground font-medium">{card.annualFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cashback</span>
                  <span className="text-primary font-medium">{card.cashback}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rewards</span>
                  <span className="text-foreground font-medium">{card.rewards}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-medium text-foreground">{card.rating}</span>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Apply Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCardsSection;
