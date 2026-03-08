import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Headphones, CheckCircle2 } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Verified Information",
    desc: "All details sourced directly from official bank websites.",
  },
  {
    icon: Zap,
    title: "AI-Powered Insights",
    desc: "Smart recommendations help you decide faster.",
  },
  {
    icon: Lock,
    title: "Secure Redirects",
    desc: "Safe redirects to official bank application pages.",
  },
  {
    icon: Headphones,
    title: "24/7 AI Support",
    desc: "Ask KriyaAI questions about any financial product.",
  },
];

const benefits = [
  "Compare products from 15+ partner banks",
  "AI-generated product summaries",
  "No hidden fees or charges",
  "Direct links to official bank sites",
  "Regular updates on new deals",
  "Privacy-first approach",
];

const WhyChooseUs = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              Why Kriyapay
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-8 text-foreground leading-tight tracking-tight">
              Trusted Financial{" "}
              <span className="text-gradient">Information</span> Platform
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              We focus on transparency and trust — providing accurate information, verified partnerships, and tools that genuinely help.
            </p>
            
            {/* Benefits list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-3xl bg-card border border-border shadow-card card-hover"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-cta flex items-center justify-center mb-5">
                  <r.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{r.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;