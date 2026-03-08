import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto p-12 sm:p-16 rounded-2xl bg-gradient-card border border-border/50 overflow-hidden text-center"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/10 blur-[150px] rounded-full" />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Ready to Build Something{" "}
              <span className="text-gradient">Amazing</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 font-light max-w-xl mx-auto">
              Let our expert team of AI specialists and professional developers bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="group flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-cta text-primary-foreground font-semibold text-sm shadow-glow hover:scale-[1.02] transition-all duration-300"
              >
                Start Your Project
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3.5 rounded-lg border border-border text-foreground font-medium text-sm hover:border-primary/40 transition-all duration-300"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
