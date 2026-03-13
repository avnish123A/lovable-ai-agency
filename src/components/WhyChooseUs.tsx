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
          <span className="tag-mono mb-6 inline-block">WHY APNINIVESH</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-foreground leading-tight tracking-tight">
            Trusted Financial{" "}
            <em className="not-italic italic text-gradient">Intelligence</em> Platform
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 font-body">
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
                <span className="text-foreground font-medium text-sm font-body">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card p-6 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-5 border border-foreground" style={{ boxShadow: '2px 2px 0px hsl(150 54% 7%)' }}>
                <r.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">{r.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-body">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
