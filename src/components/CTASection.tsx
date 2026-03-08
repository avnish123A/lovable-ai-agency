import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-cta p-12 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
              Start Saving Today with Kriyapay
            </h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">
              Join 50,000+ users who are already saving thousands. Compare, choose, and apply — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 rounded-xl">
                <Link to="/credit-cards">
                  Compare Cards <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 rounded-xl">
                <Link to="/eligibility">Check Eligibility</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
