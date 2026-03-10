import { motion, useScroll, useTransform } from "framer-motion";
import { CreditCard, Sparkles, Shield, Calculator, Gift, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import FloatingParticles from "@/components/FloatingParticles";

const features = [
  { icon: CreditCard, title: "Smart Comparison", desc: "Compare credit cards and loans from top banks side by side with detailed insights.", href: "/credit-cards", color: "bg-blue-500" },
  { icon: Sparkles, title: "AI Assistant", desc: "Get personalized recommendations powered by AI based on your profile.", href: "/tools/card-finder", color: "bg-violet-500" },
  { icon: Shield, title: "Verified Partners", desc: "All offers from verified banking partners and financial institutions.", href: "/about", color: "bg-emerald-500" },
  { icon: Calculator, title: "Financial Tools", desc: "17+ calculators for EMI, loans, savings, investments and more.", href: "/tools", color: "bg-amber-500" },
  { icon: Gift, title: "Cashback Deals", desc: "Exclusive cashback offers from partner banks and stores.", href: "/cashback", color: "bg-rose-500" },
  { icon: TrendingUp, title: "Easy Apply", desc: "Seamless application process with direct bank redirects.", href: "/credit-cards", color: "bg-cyan-500" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 60, scale: 0.9, filter: "blur(10px)" },
  show: { 
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } 
  },
};

const FeaturesSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.2]);

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/40" />
      <motion.div 
        style={{ scale: bgScale }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl" 
      />
      <FloatingParticles count={5} />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="inline-block px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6"
          >
            Platform Features
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 text-foreground tracking-tight">
            Everything to{" "}
            <motion.span 
              initial={{ backgroundSize: "0% 100%" }}
              whileInView={{ backgroundSize: "100% 100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-gradient"
            >
              Save Smarter
            </motion.span>
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Complete suite of tools to find, compare, and apply for the best financial products.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item} whileHover={{ y: -12, transition: { duration: 0.25 } }}>
              <Link
                to={f.href}
                className="block p-8 rounded-3xl bg-card border border-border group hover:border-primary/40 hover:shadow-elegant transition-all duration-300 h-full relative overflow-hidden"
              >
                {/* Animated gradient overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500 rounded-3xl"
                  whileHover={{ opacity: 1 }}
                />
                
                {/* Shimmer on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(105deg, transparent 40%, hsl(var(--primary) / 0.04) 50%, transparent 60%)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <f.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3 flex items-center justify-between">
                    {f.title}
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
