import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeDollarSign, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import TrustBadge from "@/components/TrustBadge";

const FeaturedDeals = () => {
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("finance_deals")
        .select("*")
        .eq("is_active", true)
        .order("clicks", { ascending: false })
        .limit(6);
      setDeals(data || []);
    };
    fetch();
  }, []);

  if (deals.length === 0) return null;

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
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3 text-foreground">
              Featured <span className="text-gradient">Deals</span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Top finance offers with AI-powered descriptions, updated every 12 hours.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0 border-border rounded-xl">
            <Link to="/credit-cards">View All Products</Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card shadow-card p-6 card-hover flex flex-col"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <BadgeDollarSign className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-semibold text-foreground text-sm leading-tight line-clamp-2">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{deal.merchant}</p>
                </div>
                <TrustBadge variant="verified" />
              </div>

              {deal.ai_description && (
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">AI Summary</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">{deal.ai_description}</p>
                </div>
              )}

              {deal.cashback && (
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted-foreground">Reward</span>
                  <span className="text-primary font-semibold">{deal.cashback}</span>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-border">
                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl" size="sm">
                  <Link to={`/deal/${deal.id}`}>
                    View Deal <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;
