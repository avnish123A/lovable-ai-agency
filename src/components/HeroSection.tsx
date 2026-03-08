import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute top-1/3 left-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[200px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-accent/4 blur-[150px]" />

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-5 py-2 mb-10 rounded-sm border border-primary/20 bg-primary/5 text-xs uppercase tracking-[0.2em] text-primary"
          >
            <Sparkles size={12} />
            Trusted by 30+ Industry Leaders
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-5xl sm:text-6xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8"
          >
            Intelligent AI
            <br />
            <span className="text-gradient italic">Agents</span> Built
            <br />
            for Excellence
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="gold-line w-24 mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            We craft bespoke AI solutions that transform how visionary companies operate.
            No coding required. Deploy in minutes, scale without limits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <a
              href="#contact"
              className="group flex items-center gap-3 px-10 py-4 rounded-sm bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-widest shadow-glow hover:shadow-glow-accent hover:scale-[1.02] transition-all duration-500"
            >
              Start Your Journey
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#portfolio"
              className="flex items-center gap-2 px-10 py-4 rounded-sm border border-border text-foreground font-medium text-sm uppercase tracking-widest hover:border-primary/40 hover:bg-primary/5 transition-all duration-500"
            >
              View Our Work
            </a>
          </motion.div>
        </div>

        {/* Elegant stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-px max-w-4xl mx-auto bg-border/30 rounded-sm overflow-hidden"
        >
          {[
            { value: "24/7", label: "Always Available" },
            { value: "3 min", label: "Deploy Time" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "10×", label: "ROI Average" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="text-center py-8 px-4 bg-card/80 backdrop-blur-sm"
            >
              <div className="font-heading text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
