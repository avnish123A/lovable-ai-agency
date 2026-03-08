import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-28">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] bg-gradient-cta p-12 md:p-20 overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 grid-pattern opacity-5" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm"
            >
              <Bot className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
              Ask KriyaAI Anything
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Get instant answers about credit cards, loans, cashback offers, and more. 
              Our AI assistant is here to help you make informed financial decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8 h-14 rounded-xl font-semibold text-base shadow-elegant">
                <Link to="/credit-cards">
                  Explore Products <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 h-14 rounded-xl font-semibold text-base">
                <Link to="/tools">Financial Tools</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;