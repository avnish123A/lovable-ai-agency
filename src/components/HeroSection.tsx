import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 scanline pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[15%] w-3 h-3 rounded-full bg-primary/60 blur-[1px]"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[30%] left-[10%] w-2 h-2 rounded-full bg-accent/50 blur-[1px]"
      />

      <div className="container mx-auto px-6 pt-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary backdrop-blur-sm"
          >
            <Sparkles size={14} className="animate-pulse" />
            Trusted by 30+ Startups Worldwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
          >
            Your AI-Agent
            <br />
            <span className="text-gradient">Builder</span> for
            <br />
            Modern Teams
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create AI agents effortlessly. No coding required. Deploy custom automation
            workflows, conversational bots, and intelligent systems in minutes — not months.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#contact"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-glow hover:shadow-glow-accent hover:scale-[1.02] transition-all duration-300"
            >
              Get AI Agent
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#work"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-lg border border-border text-foreground font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <Play size={14} className="text-primary" />
              Watch Demo
            </a>
          </motion.div>

          {/* Trust logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-20 flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-40"
          >
            {["Asana", "HubSpot", "Stripe", "Webflow", "Mailchimp"].map((brand) => (
              <span key={brand} className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                {brand}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: "24/7", label: "Agent Availability" },
            { value: "3min", label: "Average Deploy Time" },
            { value: "99.9%", label: "Uptime Guarantee" },
            { value: "10x", label: "Productivity Boost" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="text-center p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm"
            >
              <div className="font-heading text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
