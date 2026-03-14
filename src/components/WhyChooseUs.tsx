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
  <section className="py-24">
    <div className="container mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="tag-mono mb-4 inline-block">Why ApniNivesh</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground leading-tight tracking-tight">
            Trusted Financial <span className="text-primary">Intelligence</span> Platform
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            We focus on transparency and trust — providing accurate information, verified partnerships, and tools that genuinely help.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
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
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="apple-card p-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <r.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{r.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
