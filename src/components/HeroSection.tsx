import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
      {/* Deep pine background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Structured grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(hsl(48 30% 95% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(48 30% 95% / 0.4) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="container mx-auto px-4 md:px-8 relative z-10 pt-32 pb-24">
        <div className="max-w-4xl">
          {/* Mono tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-md border" style={{
              color: 'hsl(72 100% 50%)',
              borderColor: 'hsl(72 100% 50% / 0.3)',
              background: 'hsl(72 100% 50% / 0.08)'
            }}>
              STATUS: LIVE — AI-POWERED
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.05] mb-8 tracking-tight"
            style={{ color: 'hsl(48 30% 95%)' }}
          >
            Find the Best{" "}
            <span className="relative inline-block min-w-[200px] md:min-w-[340px] text-left align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ 
                    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
                    opacity: 0,
                  }}
                  animate={{ 
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
                    opacity: 1,
                  }}
                  exit={{ 
                    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                    opacity: 0,
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
            className="text-lg md:text-xl max-w-xl leading-relaxed mb-12 font-body"
            style={{ color: 'hsl(160 8% 60%)' }}
          >
            Compare financial products from India's top banks. Smart tools and AI recommendations — zero spam, full transparency.
          </motion.p>

          {/* CTA Buttons — Editorial Brutalism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/credit-cards"
              className="btn-brutal-dark px-10 py-4 rounded-lg text-base inline-flex items-center gap-2.5 font-body"
            >
              Explore Products <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/tools"
              className="px-10 py-4 rounded-lg text-base font-semibold font-body inline-flex items-center gap-2 transition-all duration-300 ease-luxury"
              style={{ border: '1px solid hsl(48 30% 95% / 0.15)', color: 'hsl(48 30% 95%)' }}
            >
              Financial Tools
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 flex flex-wrap gap-12 md:gap-20"
          >
            {[
              { value: "50+", label: "PRODUCTS" },
              { value: "15+", label: "PARTNER BANKS" },
              { value: "100%", label: "FREE TO USE" },
            ].map((stat) => (
              <div key={stat.label} className="cursor-default">
                <p className="text-3xl md:text-4xl font-mono font-bold" style={{ color: 'hsl(72 100% 50%)' }}>
                  {stat.value}
                </p>
                <p className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase mt-2" style={{ color: 'hsl(160 8% 55%)' }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
