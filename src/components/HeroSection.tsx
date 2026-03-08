import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[200px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/6 blur-[180px]" />

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            Trusted by 50+ Industry Leaders
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-5xl sm:text-6xl lg:text-[80px] font-bold leading-[1.05] tracking-tight mb-6"
          >
            We Build Digital
            <br />
            Products That{" "}
            <span className="text-gradient">Scale</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Our expert team of AI specialists, professional developers, and experienced designers
            craft intelligent solutions that transform businesses worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/contact"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-cta text-primary-foreground font-semibold text-sm shadow-glow hover:scale-[1.02] transition-all duration-300"
            >
              Start Your Project
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/portfolio"
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg border border-border text-foreground font-medium text-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              View Our Work
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px max-w-3xl mx-auto rounded-xl overflow-hidden border border-border/50"
        >
          {[
            { value: "50+", label: "Clients Worldwide" },
            { value: "200+", label: "Projects Delivered" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "15+", label: "Industry Specialists" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="text-center py-6 px-4 bg-card/60 backdrop-blur-sm"
            >
              <div className="font-heading text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground mt-1.5 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
