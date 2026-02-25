import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-accent/5 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6"
            >
              <Zap size={24} className="text-primary" />
            </motion.div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to deploy your first <span className="text-gradient">AI agent</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Book a free 30-minute strategy call. We'll map out your AI roadmap and show you a working prototype — no strings attached.
            </p>
            <a
              href="mailto:hello@nexusai.com"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-glow hover:shadow-glow-accent hover:scale-[1.02] transition-all duration-300"
            >
              Book a Free Call
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="mt-4 text-xs text-muted-foreground">No credit card required · Free prototype included</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
