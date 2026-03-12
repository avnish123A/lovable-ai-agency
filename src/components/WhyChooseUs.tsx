import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Headphones, CheckCircle2 } from "lucide-react";

const reasons = [
  { icon: ShieldCheck, title: "Verified Information", desc: "All details sourced directly from official bank websites." },
  { icon: Zap, title: "AI-Powered Insights", desc: "Smart recommendations help you decide faster." },
  { icon: Lock, title: "Secure Redirects", desc: "Safe redirects to official bank application pages." },
  { icon: Headphones, title: "24/7 AI Support", desc: "Ask NiveshAI questions about any financial product." },
];

const benefits = [
  "Compare products from 15+ partner banks",
  "AI-generated product summaries",
  "No hidden fees or charges",
  "Direct links to official bank sites",
  "Regular updates on new deals",
  "Privacy-first approach",
];

const WhyChooseUs = () => (
  <section className="py-32 relative overflow-hidden">
    <div className="container mx-auto px-4 md:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-border" />
            <span className="text-sm font-body font-medium tracking-widest uppercase text-muted-foreground">Why ApniNivesh</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-foreground leading-tight tracking-tight">
            Trusted Financial{" "}
            <em className="not-italic text-gradient">Information</em> Platform
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            We focus on transparency and trust — providing accurate information, verified partnerships, and tools that genuinely help.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 cursor-default"
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground font-medium text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-2xl bg-card border border-border shadow-card transition-all duration-500 ease-luxury hover:-translate-y-2 hover:shadow-elegant group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-cta flex items-center justify-center mb-5">
                <r.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">{r.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
