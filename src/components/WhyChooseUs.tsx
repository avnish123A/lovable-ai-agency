import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Headphones } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Verified Information",
    desc: "All product details are sourced directly from official bank websites and documentation.",
  },
  {
    icon: Zap,
    title: "AI-Powered Insights",
    desc: "Smart recommendations and descriptions help you understand products better and faster.",
  },
  {
    icon: Lock,
    title: "Secure Redirects",
    desc: "We redirect you safely to official bank application pages. Your data stays protected.",
  },
  {
    icon: Headphones,
    title: "24/7 AI Assistant",
    desc: "Ask KriyaAI any question about credit cards, loans, or financial products anytime.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-28 bg-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Why Kriyapay
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 text-foreground leading-tight">
              Trusted Financial{" "}
              <span className="text-gradient">Information Platform</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We believe in transparency and trust. Instead of flashy numbers, we focus on providing 
              accurate information, verified partnerships, and tools that genuinely help you make 
              better financial decisions.
            </p>
            
            {/* Partner logos */}
            <div className="flex flex-wrap gap-4">
              {["HDFC", "ICICI", "Axis", "SBI", "Kotak", "IndusInd"].map((bank) => (
                <div
                  key={bank}
                  className="px-5 py-3 rounded-xl bg-card border border-border text-sm font-semibold text-foreground shadow-sm"
                >
                  {bank}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-cta flex items-center justify-center mb-4">
                  <r.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;