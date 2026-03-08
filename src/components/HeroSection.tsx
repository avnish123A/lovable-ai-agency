import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const CreditCard3D = lazy(() => import("@/components/CreditCard3D"));

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-15" />
      
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">AI-Powered Financial Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-[1.1] mb-6 text-foreground"
            >
              Find the Best{" "}
              <span className="text-gradient">Credit Cards</span> and{" "}
              <span className="text-gradient">Loans</span> for Your Needs
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
            >
              Compare financial products and discover smarter ways to manage money. 
              All from India's top banks and financial institutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="bg-gradient-cta text-primary-foreground hover:opacity-90 text-base px-8 h-14 shadow-glow rounded-xl font-semibold btn-glow">
                <Link to="/credit-cards">
                  Explore Credit Cards <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 h-14 border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 rounded-xl font-semibold text-foreground">
                <Link to="/loans">Compare Loans</Link>
              </Button>
            </motion.div>

            {/* Trust indicators without fake numbers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-6"
            >
              {["HDFC", "ICICI", "Axis", "SBI", "Kotak"].map((bank) => (
                <div
                  key={bank}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-muted-foreground"
                >
                  {bank} Bank
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <Suspense fallback={
              <div className="w-full h-[500px] flex items-center justify-center">
                <div className="w-80 h-48 rounded-2xl bg-primary/10 animate-pulse" />
              </div>
            }>
              <CreditCard3D />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;