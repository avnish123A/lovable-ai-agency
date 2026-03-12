import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const rotatingWords = [
  "Credit Cards",
  "Personal Loans",
  "Insurance",
  "Fixed Deposits",
  "Investments",
];

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Dark pine background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(50 27% 93% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(50 27% 93% / 0.3) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      {/* Volt glow orb */}
      <motion.div
        animate={{ y: [0, -30, 0], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[15%] w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: 'hsl(72 100% 50% / 0.12)' }}
      />

      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="container mx-auto px-4 md:px-8 relative z-10 pt-32 pb-24">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px w-12 bg-primary/40" />
            <span className="text-sm font-body font-medium tracking-widest uppercase" style={{ color: 'hsl(50 27% 93% / 0.5)' }}>
              AI-Powered Financial Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.05] mb-8 tracking-tight"
            style={{ color: 'hsl(50 27% 93%)' }}
          >
            Find the Best{" "}
            <span className="relative inline-block min-w-[200px] md:min-w-[340px] text-left align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ 
                    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
                    opacity: 0,
                    rotate: 1.5
                  }}
                  animate={{ 
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
                    opacity: 1,
                    rotate: 0
                  }}
                  exit={{ 
                    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                    opacity: 0,
                    rotate: -1.5
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block font-heading italic"
                  style={{ color: 'hsl(72 100% 50%)' }}
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl max-w-xl leading-relaxed mb-12"
            style={{ color: 'hsl(160 8% 55%)' }}
          >
            Compare financial products from India's top banks. Smart tools and AI recommendations — zero spam, full transparency.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button asChild size="lg" className="bg-gradient-cta text-primary-foreground hover:opacity-90 text-base px-10 h-14 rounded-xl font-bold btn-neon group">
                <Link to="/credit-cards">
                  <span className="flex items-center">
                    Explore Products <ArrowRight className="ml-2.5 w-5 h-5 group-hover:translate-x-1 transition-transform duration-500 ease-luxury" />
                  </span>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button asChild variant="outline" size="lg" className="text-base px-10 h-14 rounded-xl font-bold group" style={{ borderColor: 'hsl(50 27% 93% / 0.15)', color: 'hsl(50 27% 93%)' }}>
                <Link to="/tools" className="flex items-center">
                  Financial Tools
                  <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 flex flex-wrap gap-12 md:gap-20"
          >
            {[
              { value: "50+", label: "Products" },
              { value: "15+", label: "Partner Banks" },
              { value: "100%", label: "Free to Use" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="cursor-default"
              >
                <p className="text-3xl md:text-4xl font-mono font-bold" style={{ color: 'hsl(72 100% 50%)' }}>
                  {stat.value}
                </p>
                <p className="text-sm mt-1" style={{ color: 'hsl(160 8% 55%)' }}>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
