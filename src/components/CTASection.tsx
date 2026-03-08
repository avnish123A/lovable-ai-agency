import { motion } from "framer-motion";
import { ArrowRight, Diamond } from "lucide-react";

const CTASection = () => {
  return (
    <section id="contact" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-3xl mx-auto text-center p-14 sm:p-20 rounded-sm bg-gradient-card border-gradient overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/8 blur-[150px] rounded-full" />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Diamond size={32} className="text-primary mx-auto mb-8" />
            </motion.div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-5">
              Ready to elevate with{" "}
              <span className="text-gradient italic">AI</span>?
            </h2>
            <div className="gold-line w-16 mx-auto mb-6" />
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed font-light">
              Book a complimentary 30-minute strategy session. We'll craft your AI roadmap and deliver a working prototype — no strings attached.
            </p>
            <a
              href="mailto:hello@nexusai.com"
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-sm bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-widest shadow-glow hover:shadow-glow-accent hover:scale-[1.02] transition-all duration-500"
            >
              Book a Free Consultation
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="mt-5 text-xs text-muted-foreground uppercase tracking-wider">No credit card required · Free prototype included</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
