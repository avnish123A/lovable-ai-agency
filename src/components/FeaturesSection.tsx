import { motion } from "framer-motion";
import { CreditCard, Landmark, Shield, Gift, Calculator, CheckCircle, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: CreditCard,
    title: "Compare Products",
    desc: "Compare 100+ credit cards from HDFC, ICICI, Axis, SBI & more with instant approval.",
    href: "/credit-cards",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    desc: "Get personalized product suggestions powered by AI based on your profile.",
    href: "/tools/card-finder",
  },
  {
    icon: Shield,
    title: "Trusted Partners",
    desc: "We partner with India's top banks and verified financial institutions.",
    href: "/about",
  },
  {
    icon: Calculator,
    title: "Smart Tools",
    desc: "17+ financial calculators to plan EMI, savings, investments and more.",
    href: "/tools",
  },
  {
    icon: Gift,
    title: "Cashback Deals",
    desc: "Exclusive cashback offers from 500+ partner stores and financial products.",
    href: "/cashback",
  },
  {
    icon: TrendingUp,
    title: "Financial Guidance",
    desc: "Learn about credit scores, KYC, and smart money management strategies.",
    href: "/tools/credit-score",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
            Everything You Need to{" "}
            <span className="text-gradient">Save More</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            All your financial tools in one place — compare, calculate, and choose the best products.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <Link
                to={f.href}
                className="block p-6 rounded-2xl border border-border bg-card shadow-card card-hover group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
