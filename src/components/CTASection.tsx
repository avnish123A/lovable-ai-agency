import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto p-14 sm:p-20 rounded-3xl bg-gradient-card border border-border/50 overflow-hidden text-center"
        >
          {/* Animated background effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/12 blur-[150px] rounded-full animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-accent/8 blur-[120px] rounded-full animate-float-reverse" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5"
            >
              Ready to Build Something{" "}
              <span className="text-gradient">Amazing</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-lg mb-10 font-light max-w-xl mx-auto"
            >
              Let our expert team of AI specialists and professional developers bring your vision to life.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/contact"
                className="group relative flex items-center gap-2.5 px-10 py-4 rounded-xl bg-gradient-cta text-primary-foreground font-semibold text-sm shadow-glow hover:shadow-glow-lg transition-shadow duration-500 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  Start Your Project
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-10 py-4 rounded-xl border border-border/60 text-foreground font-medium text-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-400"
              >
                💬 WhatsApp Us
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
