import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section id="contact" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-3xl mx-auto text-center p-12 sm:p-16 rounded-2xl bg-gradient-card border-gradient overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to build something <span className="text-gradient">extraordinary</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Let's discuss how AI can transform your business. No pitch decks — just a real conversation about your challenges.
            </p>
            <a
              href="mailto:hello@nexusai.com"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-medium shadow-glow hover:opacity-90 transition-all"
            >
              Book a Call
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
