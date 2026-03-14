import { motion } from "framer-motion";
import { CreditCard, Sparkles, Shield, Calculator, Gift, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

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
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const FeaturesSection = () => (
  <section className="py-24">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <span className="tag-mono mb-4 inline-block">Platform Features</span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-foreground">
          Everything to <span className="text-primary">Save Smarter</span>
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
          Complete suite of tools to find, compare, and apply for the best financial products.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {features.map(f => (
          <motion.div key={f.title} variants={item}>
            <Link
              to={f.href}
              className="apple-card block p-8 group h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-105 transition-all duration-500 ease-luxury">
                <f.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center justify-between">
                {f.title}
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 ease-luxury" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturesSection;
