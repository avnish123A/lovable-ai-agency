import { motion } from "framer-motion";
import { CreditCard, Sparkles, Shield, Calculator, Gift, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: CreditCard,
    title: "Smart Product Comparison",
    desc: "Compare credit cards, loans, and insurance from HDFC, ICICI, Axis, SBI & more banks side by side.",
    href: "/credit-cards",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconGradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "AI Financial Assistant",
    desc: "Get personalized recommendations powered by AI based on your spending habits and preferences.",
    href: "/tools/card-finder",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconGradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Verified Partner Banks",
    desc: "All offers are directly sourced from verified banking partners and financial institutions.",
    href: "/about",
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconGradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Calculator,
    title: "Financial Calculators",
    desc: "17+ smart tools including EMI calculator, loan eligibility checker, and savings planner.",
    href: "/tools",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconGradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Gift,
    title: "Exclusive Cashback Deals",
    desc: "Access special cashback offers and rewards from partner banks and financial products.",
    href: "/cashback",
    gradient: "from-rose-500/10 to-pink-500/10",
    iconGradient: "from-rose-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Easy Application Process",
    desc: "Apply directly to banks with a seamless process. We guide you to official bank pages.",
    href: "/credit-cards",
    gradient: "from-cyan-500/10 to-sky-500/10",
    iconGradient: "from-cyan-500 to-sky-500",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-5 text-foreground">
            Everything You Need to{" "}
            <span className="text-gradient">Save Smarter</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete suite of tools designed to help you find, compare, and apply for the best financial products.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <Link
                to={f.href}
                className={`block p-8 rounded-3xl bg-gradient-to-br ${f.gradient} border border-border/50 group hover:border-primary/30 transition-all duration-300 hover:shadow-elegant h-full`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.iconGradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{f.desc}</p>
                <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
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