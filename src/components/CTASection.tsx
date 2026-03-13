import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden bg-gradient-hero p-12 md:p-20 lg:p-28"
        >
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(hsl(48 30% 95% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(48 30% 95% / 0.3) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-md border inline-block mb-8" style={{
              color: 'hsl(72 100% 50%)',
              borderColor: 'hsl(72 100% 50% / 0.3)',
              background: 'hsl(72 100% 50% / 0.06)'
            }}>
              ASK NIVESH AI
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 leading-tight tracking-tight" style={{ color: 'hsl(48 30% 95%)' }}>
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
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-body" style={{ color: 'hsl(160 8% 55%)' }}>
              Get instant answers about credit cards, loans, and cashback offers. Our AI assistant helps you make informed financial decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/credit-cards"
                className="btn-brutal-dark px-10 py-4 rounded-lg text-base inline-flex items-center gap-2 font-body justify-center"
              >
                Explore Products <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/tools"
                className="px-10 py-4 rounded-lg text-base font-semibold font-body inline-flex items-center gap-2 justify-center transition-all duration-300 ease-luxury"
                style={{ border: '1px solid hsl(48 30% 95% / 0.15)', color: 'hsl(48 30% 95%)' }}
              >
                Financial Tools <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
