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
    desc: "Ask NiveshAI questions about any financial product.",
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

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const WhyChooseUs = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated decorative elements */}
      <motion.div 
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" 
      />
      <motion.div 
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" 
      />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6"
            >
              Why ApniNivesh
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-8 text-foreground leading-tight tracking-tight">
              Trusted Financial{" "}
              <span className="text-gradient">Information</span> Platform
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              We focus on transparency and trust — providing accurate information, verified partnerships, and tools that genuinely help.
            </p>
            
            {/* Benefits list with staggered check animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  className="flex items-center gap-3 cursor-default"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  </motion.div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
                className="p-7 rounded-3xl bg-card border border-border shadow-card hover:shadow-elegant hover:border-primary/30 transition-colors duration-300 relative overflow-hidden group"
              >
                {/* Subtle gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/3 transition-all duration-500 rounded-3xl" />
                
                <div className="relative z-10">
                  <motion.div 
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                    className="w-14 h-14 rounded-2xl bg-gradient-cta flex items-center justify-center mb-5 shadow-lg"
                  >
                    <r.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{r.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
