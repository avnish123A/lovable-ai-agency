import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const CreditCard3D = lazy(() => import("@/components/CreditCard3D"));

const stats = [
  { icon: TrendingUp, value: "50+", label: "Products" },
  { icon: Shield, value: "100%", label: "Secure" },
  { icon: Zap, value: "AI", label: "Powered" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Floating orbs with enhanced glow */}
      <motion.div
        animate={{ y: [0, -25, 0], scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-[10%] w-80 h-80 bg-primary/12 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 25, 0], scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 right-[10%] w-96 h-96 bg-accent/12 rounded-full blur-3xl"
      />
      {/* Extra subtle orb */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="max-w-2xl">
            {/* Badge with shimmer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 mb-10 backdrop-blur-sm relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
              />
              <Sparkles className="w-4 h-4 text-primary relative z-10" />
              <span className="text-sm text-foreground font-semibold relative z-10">AI-Powered Financial Platform</span>
            </motion.div>

            {/* Heading with staggered words */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.05] mb-8 text-foreground tracking-tight"
            >
              Find the Best{" "}
              <motion.span
                className="text-gradient inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
              >
                Credit Cards
              </motion.span>{" "}
              &{" "}
              <motion.span
                className="text-gradient inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
              >
                Loans
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl"
            >
              Compare financial products from India's top banks. Smart tools and AI recommendations help you choose wisely.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex gap-6 mb-10"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold text-foreground leading-none">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons with enhanced hover */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Button asChild size="lg" className="bg-gradient-cta text-primary-foreground hover:opacity-90 text-base px-10 h-16 shadow-glow rounded-2xl font-bold btn-glow group relative overflow-hidden">
                <Link to="/credit-cards">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                  />
                  <span className="relative z-10 flex items-center">
                    Explore Cards <ArrowRight className="ml-2.5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
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
              <div className="flex flex-wrap items-center gap-5">
                {[
                  { name: "HDFC", logo: "/logos/hdfc.png" },
                  { name: "ICICI", logo: "/logos/icici.png" },
                  { name: "Axis", logo: "/logos/axis.png" },
                  { name: "SBI", logo: "/logos/sbi.png" },
                ].map((bank, i) => (
                  <motion.div
                    key={bank.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    className="px-4 py-3 rounded-2xl bg-card border border-border shadow-sm hover:shadow-card hover:border-primary/30 transition-all cursor-default flex items-center justify-center"
                  >
                    <img src={bank.logo} alt={bank.name} className="h-8 w-auto object-contain drop-shadow-sm" loading="eager" />
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
