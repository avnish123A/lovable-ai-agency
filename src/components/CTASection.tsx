import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const rotatingQuestions = [
  "Best cashback credit card?",
  "Low interest personal loan?",
  "Compare term insurance plans",
  "Highest FD rates today?",
  "Best demat account for beginners?",
];

const CTASection = () => {
  const [qIndex, setQIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQIndex(prev => (prev + 1) % rotatingQuestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden bg-gradient-hero p-12 md:p-20 lg:p-28"
        >
          {/* Volt accent glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10" style={{ background: 'hsl(72 100% 50%)' }} />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: 'hsl(50 27% 93% / 0.2)' }} />
              <span className="text-sm font-body font-medium tracking-widest uppercase" style={{ color: 'hsl(160 8% 55%)' }}>Ask NiveshAI</span>
              <div className="h-px w-8" style={{ background: 'hsl(50 27% 93% / 0.2)' }} />
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 leading-tight tracking-tight" style={{ color: 'hsl(50 27% 93%)' }}>
              Ask Anything{" "}
              <span className="relative inline-block min-h-[1.2em]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={qIndex}
                    initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", opacity: 0 }}
                    animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", opacity: 1 }}
                    exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block font-heading italic"
                    style={{ color: 'hsl(72 100% 50%)' }}
                  >
                    "{rotatingQuestions[qIndex]}"
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: 'hsl(160 8% 55%)' }}>
              Get instant answers about credit cards, loans, and cashback offers. Our AI assistant helps you make informed financial decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild size="lg" className="bg-gradient-cta text-primary-foreground hover:opacity-90 px-10 h-14 rounded-xl font-bold text-base btn-neon">
                  <Link to="/credit-cards">
                    Explore Products <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild variant="outline" size="lg" className="px-10 h-14 rounded-xl font-bold text-base" style={{ borderColor: 'hsl(50 27% 93% / 0.15)', color: 'hsl(50 27% 93%)' }}>
                  <Link to="/tools">
                    Financial Tools <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
