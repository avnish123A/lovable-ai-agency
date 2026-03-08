import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const CreditCard3D = lazy(() => import("@/components/CreditCard3D"));

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Floating orbs */}
      <motion.div 
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-[10%] w-80 h-80 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 right-[10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 mb-10 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-semibold">AI-Powered Financial Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.05] mb-8 text-foreground tracking-tight"
            >
              Find the Best{" "}
              <span className="text-gradient">Credit Cards</span> & {" "}
              <span className="text-gradient">Loans</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl"
            >
              Compare financial products from India's top banks. Smart tools and AI recommendations help you choose wisely.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Button asChild size="lg" className="bg-gradient-cta text-primary-foreground hover:opacity-90 text-base px-10 h-16 shadow-glow rounded-2xl font-bold btn-glow">
                <Link to="/credit-cards">
                  Explore Cards <ArrowRight className="ml-2.5 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-10 h-16 border-2 border-border hover:bg-secondary hover:border-primary/30 rounded-2xl font-bold text-foreground group">
                <Link to="/loans" className="flex items-center">
                  <Play className="w-5 h-5 mr-2.5 text-accent group-hover:scale-110 transition-transform" />
                  Compare Loans
                </Link>
              </Button>
            </motion.div>

            {/* Partner badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16"
            >
              <p className="text-sm text-muted-foreground mb-4 font-medium">Trusted by leading banks</p>
              <div className="flex flex-wrap gap-3">
                {["HDFC", "ICICI", "Axis", "SBI", "Kotak"].map((bank, i) => (
                  <motion.div
                    key={bank}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="px-5 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold text-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
                  >
                    {bank}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl scale-110" />
              <Suspense fallback={
                <div className="relative w-full h-[500px] flex items-center justify-center">
                  <div className="w-80 h-48 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 animate-pulse" />
                </div>
              }>
                <CreditCard3D />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;