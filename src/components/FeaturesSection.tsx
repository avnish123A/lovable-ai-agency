import { motion } from "framer-motion";
import { CreditCard, Landmark, Gift, Calculator, CheckCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: CreditCard,
    title: "Credit Cards",
    desc: "Compare 100+ credit cards from top banks with instant approval options.",
    href: "/credit-cards",
    color: "text-primary",
  },
  {
    icon: Landmark,
    title: "Personal Loans",
    desc: "Find the best interest rates and get pre-approved in minutes.",
    href: "/loans",
    color: "text-primary",
  },
  {
    icon: Gift,
    title: "Cashback Offers",
    desc: "Exclusive cashback deals from 500+ partner stores and brands.",
    href: "/cashback",
    color: "text-primary",
  },
  {
    icon: Calculator,
    title: "EMI Calculator",
    desc: "Plan your finances with our advanced EMI calculator tool.",
    href: "/emi-calculator",
    color: "text-primary",
  },
  {
    icon: CheckCircle,
    title: "Eligibility Check",
    desc: "Instantly check your eligibility for cards and loans. No credit impact.",
    href: "/eligibility",
    color: "text-primary",
  },
  {
    icon: BookOpen,
    title: "Financial Guides",
    desc: "Expert advice and guides to help you make smarter financial decisions.",
    href: "#",
    color: "text-primary",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
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
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
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
                className="block p-6 rounded-xl border border-border bg-card card-hover group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className={`w-6 h-6 ${f.color}`} />
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
