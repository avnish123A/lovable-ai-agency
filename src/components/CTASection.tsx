import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bot, Zap } from "lucide-react";
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
          className="relative rounded-[2.5rem] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-cta" />
          
          <motion.div 
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-10 left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
          />
          
          <div className="absolute inset-0 grid-pattern opacity-5" />
          
          <div className="relative z-10 p-12 md:p-20 lg:p-28">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm mb-10"
              >
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-white/90 font-semibold">AI-Powered Recommendations</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-8 leading-tight tracking-tight">
                Ask NiveshAI <br className="hidden sm:block" />
                <span className="relative inline-block min-h-[1.2em]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={qIndex}
                      initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: -30, opacity: 0, filter: "blur(8px)" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="text-accent inline-block"
                    >
                      "{rotatingQuestions[qIndex]}"
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h2>
              <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                Get instant answers about credit cards, loans, and cashback offers. Our AI assistant helps you make informed financial decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-10 h-16 rounded-2xl font-bold text-base shadow-elegant">
                  <Link to="/credit-cards">
                    Explore Products <ArrowRight className="ml-2.5 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-10 h-16 rounded-2xl font-bold text-base backdrop-blur-sm">
                  <Link to="/tools">
                    <Bot className="mr-2.5 w-5 h-5" />
                    Financial Tools
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
