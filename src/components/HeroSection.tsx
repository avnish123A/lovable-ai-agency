import { useState, useEffect, Component, ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Play, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { lazy, Suspense, useRef } from "react";
import FloatingParticles from "@/components/FloatingParticles";

class Card3DErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const CreditCard3D = lazy(() =>
  import("@/components/CreditCard3D").catch(() => ({
    default: () => null,
  }))
);

const rotatingWords = [
  { text: "Credit Cards", color: "from-primary to-accent" },
  { text: "Personal Loans", color: "from-accent to-primary" },
  { text: "Insurance", color: "from-primary to-highlight" },
  { text: "Fixed Deposits", color: "from-accent to-primary" },
  { text: "Investments", color: "from-highlight to-primary" },
];

const stats = [
  { icon: TrendingUp, value: "50+", label: "Products" },
  { icon: Shield, value: "100%", label: "Secure" },
  { icon: Zap, value: "AI", label: "Powered" },
];

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Deep purple gradient background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 bg-gradient-hero" />
      <motion.div style={{ y: bgY }} className="absolute inset-0 grid-pattern opacity-20" />

      <FloatingParticles count={8} />

      {/* Neon glow orbs */}
      <motion.div
        animate={{ y: [0, -25, 0], scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-[10%] w-80 h-80 bg-primary/8 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 25, 0], scale: [1, 1.12, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 right-[10%] w-96 h-96 bg-accent/8 rounded-full blur-3xl"
      />
      {/* Purple accent orb */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[hsl(270_80%_50%/0.06)] rounded-full blur-3xl"
      />

      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6 }}
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

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.05] mb-8 text-foreground tracking-tight"
            >
              Find the Best{" "}
              <span className="relative inline-block min-w-[280px] md:min-w-[380px] text-left align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: 40, opacity: 0, rotateX: -45, filter: "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" }}
                    exit={{ y: -40, opacity: 0, rotateX: 45, filter: "blur(8px)" }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block text-glow"
                  >
                    {rotatingWords[wordIndex].text}
                  </motion.span>
                </AnimatePresence>
                <motion.div
                  key={`underline-${wordIndex}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full origin-left shadow-glow-sm"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -5, scale: 1.08, transition: { duration: 0.2 } }}
                  className="flex items-center gap-2.5 cursor-default"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-pulse">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-bold text-foreground leading-none">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild size="lg" className="bg-gradient-cta text-primary-foreground hover:opacity-90 text-base px-10 h-16 rounded-2xl font-bold btn-glow btn-neon group relative overflow-hidden">
                  <Link to="/credit-cards">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                    />
                    <span className="relative z-10 flex items-center">
                      Explore Cards <ArrowRight className="ml-2.5 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild variant="outline" size="lg" className="text-base px-10 h-16 border-2 border-border hover:bg-secondary hover:border-primary/30 rounded-2xl font-bold text-foreground group">
                  <Link to="/loans" className="flex items-center">
                    <Play className="w-5 h-5 mr-2.5 text-primary group-hover:scale-125 transition-transform duration-300" />
                    Compare Loans
                  </Link>
                </Button>
              </motion.div>
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
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.15, y: -6, rotate: 2 }}
                    className="px-4 py-3 rounded-2xl glass-card border-glow-hover flex items-center justify-center"
                  >
                    <img src={bank.logo} alt={bank.name} className="h-8 w-auto object-contain drop-shadow-sm brightness-110" loading="eager" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 80, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:block"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-primary/15 to-accent/15 rounded-3xl blur-3xl scale-110" 
              />
              <Card3DErrorBoundary>
                <Suspense fallback={
                  <div className="relative w-full h-[500px] flex items-center justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-80 h-48 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/10 border-glow"
                    />
                  </div>
                }>
                  <CreditCard3D />
                </Suspense>
              </Card3DErrorBoundary>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
