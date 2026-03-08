import { motion } from "framer-motion";
import { Gift, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const offers = [
  { store: "Amazon", cashback: "10%", validity: "Mar 31, 2026", desc: "On electronics purchases above ₹5,000", category: "Shopping" },
  { store: "Flipkart", cashback: "15%", validity: "Apr 15, 2026", desc: "Fashion & lifestyle up to ₹2,000 cashback", category: "Shopping" },
  { store: "Swiggy", cashback: "20%", validity: "Apr 30, 2026", desc: "On orders above ₹299, max ₹100 cashback", category: "Food" },
  { store: "Myntra", cashback: "12%", validity: "Mar 25, 2026", desc: "On minimum purchase of ₹2,000", category: "Fashion" },
  { store: "BigBasket", cashback: "8%", validity: "Apr 10, 2026", desc: "On grocery orders above ₹1,500", category: "Groceries" },
  { store: "MakeMyTrip", cashback: "₹1,500", validity: "May 1, 2026", desc: "Flat cashback on domestic flight bookings", category: "Travel" },
  { store: "Zomato", cashback: "25%", validity: "Mar 20, 2026", desc: "Up to ₹150 on first 3 orders", category: "Food" },
  { store: "Croma", cashback: "5%", validity: "Apr 20, 2026", desc: "On all electronics & appliances", category: "Electronics" },
  { store: "BookMyShow", cashback: "₹200", validity: "Mar 31, 2026", desc: "Flat cashback on movie tickets", category: "Entertainment" },
];

const Cashback = () => {
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
              <span className="text-gradient">Cashback</span> Offers
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Exclusive cashback deals from top brands. Save on every purchase.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, i) => (
              <motion.div
                key={offer.store + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-card p-6 card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{offer.store}</h3>
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        {offer.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-xl font-heading font-bold text-primary">{offer.cashback}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{offer.desc}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    Valid till {offer.validity}
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary text-xs hover:bg-primary/10">
                    Claim <ArrowRight className="w-3 h-3 ml-1" />
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

export default Cashback;
