import { motion } from "framer-motion";
import { CreditCard, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const creditCards = [
  {
    name: "Platinum Rewards Card",
    bank: "HDFC Bank",
    bonus: "₹500 Welcome Bonus",
    annualFee: "₹499",
    cashback: "5% on Dining",
    rewards: "2X Reward Points",
    rating: 4.8,
    features: ["Lounge Access", "Fuel Surcharge Waiver", "Movie Discounts"],
  },
  {
    name: "SimplyCLICK Card",
    bank: "SBI Cards",
    bonus: "₹500 Amazon Voucher",
    annualFee: "₹499",
    cashback: "10X on Partner Sites",
    rewards: "1.25% Cashback",
    rating: 4.6,
    features: ["Online Shopping Rewards", "Milestone Benefits", "Contactless"],
  },
  {
    name: "Ace Credit Card",
    bank: "Axis Bank",
    bonus: "Lifetime Free",
    annualFee: "₹0",
    cashback: "5% on Bills",
    rewards: "2% on Everything",
    rating: 4.7,
    features: ["No Annual Fee", "Bill Payment Cashback", "Instant Approval"],
  },
  {
    name: "Millennia Card",
    bank: "HDFC Bank",
    bonus: "1000 Reward Points",
    annualFee: "₹1,000",
    cashback: "5% CashBack",
    rewards: "2.5X Online",
    rating: 4.5,
    features: ["EMI Conversion", "Travel Benefits", "Dining Offers"],
  },
  {
    name: "Amazon Pay Card",
    bank: "ICICI Bank",
    bonus: "₹750 Welcome",
    annualFee: "₹0",
    cashback: "5% on Amazon",
    rewards: "2% on Bills",
    rating: 4.4,
    features: ["Amazon Prime Benefits", "No Joining Fee", "Quick Approval"],
  },
  {
    name: "Infinia Card",
    bank: "HDFC Bank",
    bonus: "10,000 Points",
    annualFee: "₹10,000",
    cashback: "3.3% Value",
    rewards: "5X on All Spends",
    rating: 4.9,
    features: ["Unlimited Lounge", "Golf Programme", "Concierge Service"],
  },
];

const CreditCards = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Compare <span className="text-gradient">Credit Cards</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find the perfect credit card based on rewards, cashback, and annual fees from India's top banks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditCards.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-6 card-hover flex flex-col"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">{card.name}</h3>
                    <p className="text-xs text-muted-foreground">{card.bank}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="text-sm font-medium text-foreground">{card.rating}</span>
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

                <div className="mb-5 space-y-2">
                  {card.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Apply Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CreditCards;
