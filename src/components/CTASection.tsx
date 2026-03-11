import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQIndex(prev => (prev + 1) % rotatingQuestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="py-32">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          style={{ scale, opacity }}
          className="relative rounded-[2.5rem] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-cta" />
          
          {/* Neon glowing orbs */}
          <motion.div 
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-20 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-10 left-20 w-80 h-80 bg-primary-foreground/8 rounded-full blur-3xl"
          />
          
          <div className="absolute inset-0 grid-pattern opacity-10" />
          
          <div className="relative z-10 p-12 md:p-20 lg:p-28">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-10 border border-primary-foreground/20"
              >
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </motion.div>
                <span className="text-primary-foreground/90 font-semibold">AI-Powered Recommendations</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-primary-foreground mb-8 leading-tight tracking-tight">
                Ask NiveshAI <br className="hidden sm:block" />
                <span className="relative inline-block min-h-[1.2em]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={qIndex}
                      initial={{ y: 30, opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
                      exit={{ y: -30, opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="text-primary-foreground/80 inline-block"
                    >
                      "{rotatingQuestions[qIndex]}"
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-primary-foreground/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                Get instant answers about credit cards, loans, and cashback offers. Our AI assistant helps you make informed financial decisions.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-5 justify-center"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-10 h-16 rounded-2xl font-bold text-base shadow-elegant">
                    <Link to="/credit-cards">
                      Explore Products <ArrowRight className="ml-2.5 w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="lg" className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-10 h-16 rounded-2xl font-bold text-base backdrop-blur-sm">
                    <Link to="/tools">
                      <Bot className="mr-2.5 w-5 h-5" />
                      Financial Tools
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
