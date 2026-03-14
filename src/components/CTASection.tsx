import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="apple-card overflow-hidden p-12 md:p-20 text-center relative"
        >
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="tag-mono mb-6 inline-block">Ask Nivesh AI</span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight text-foreground">
              Ask Anything{" "}
              <span className="relative inline-block min-h-[1.2em]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={qIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block text-primary"
                  >
                    "{rotatingQuestions[qIndex]}"
                  </motion.span>
                </AnimatePresence>
              </span>
            </h2>
            <p className="text-lg max-w-xl mx-auto mb-10 text-muted-foreground leading-relaxed">
              Get instant answers about credit cards, loans, and cashback offers. Our AI assistant helps you make informed decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/credit-cards"
                className="btn-primary px-8 py-3.5 text-base inline-flex items-center gap-2 justify-center"
              >
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tools"
                className="btn-secondary px-8 py-3.5 text-base inline-flex items-center gap-2 justify-center"
              >
                Financial Tools
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
