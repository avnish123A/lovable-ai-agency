import { motion, useScroll, useTransform } from "framer-motion";
import { CreditCard, Sparkles, Shield, Calculator, Gift, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const features = [
  { icon: CreditCard, title: "Smart Comparison", desc: "Compare credit cards and loans from top banks side by side with detailed insights.", href: "/credit-cards" },
  { icon: Sparkles, title: "AI Assistant", desc: "Get personalized recommendations powered by AI based on your profile.", href: "/tools/card-finder" },
  { icon: Shield, title: "Verified Partners", desc: "All offers from verified banking partners and financial institutions.", href: "/about" },
  { icon: Calculator, title: "Financial Tools", desc: "17+ calculators for EMI, loans, savings, investments and more.", href: "/tools" },
  { icon: Gift, title: "Cashback Deals", desc: "Exclusive cashback offers from partner banks and stores.", href: "/cashback" },
  { icon: TrendingUp, title: "Easy Apply", desc: "Seamless application process with direct bank redirects.", href: "/credit-cards" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { 
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } 
  },
};

const FeaturesSection = () => {
  return (
    <section className="py-32 relative overflow-hidden section-dark">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(hsl(50 27% 93% / 0.2) 1px, transparent 1px), linear-gradient(90deg, hsl(50 27% 93% / 0.2) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12" style={{ background: 'hsl(50 27% 93% / 0.15)' }} />
            <span className="text-sm font-body font-medium tracking-widest uppercase" style={{ color: 'hsl(160 8% 55%)' }}>Platform Features</span>
            <div className="h-px w-12" style={{ background: 'hsl(50 27% 93% / 0.15)' }} />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight" style={{ color: 'hsl(50 27% 93%)' }}>
            Everything to{" "}
            <em className="not-italic" style={{ color: 'hsl(72 100% 50%)' }}>Save Smarter</em>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(160 8% 55%)' }}>
            Complete suite of tools to find, compare, and apply for the best financial products.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map(f => (
            <motion.div key={f.title} variants={item}>
              <Link
                to={f.href}
                className="block p-8 rounded-2xl border group h-full relative overflow-hidden transition-all duration-500 ease-luxury hover:-translate-y-2"
                style={{ 
                  borderColor: 'hsl(150 30% 16% / 0.5)',
                  background: 'hsl(150 45% 9% / 0.6)'
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
                  background: 'linear-gradient(145deg, hsl(72 100% 50% / 0.03), transparent)'
                }} />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-cta flex items-center justify-center mb-6">
                    <f.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-3 flex items-center justify-between" style={{ color: 'hsl(50 27% 93%)' }}>
                    {f.title}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 ease-luxury" style={{ color: 'hsl(72 100% 50%)' }} />
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'hsl(160 8% 55%)' }}>{f.desc}</p>
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
