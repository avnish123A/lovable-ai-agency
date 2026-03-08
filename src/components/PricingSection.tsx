import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "Perfect for startups exploring digital solutions.",
    features: [
      "1 Active Project",
      "Basic AI Integration",
      "Responsive Design",
      "Email Support",
      "Monthly Reports",
      "99.5% Uptime",
    ],
  },
  {
    name: "Growth",
    price: "$999",
    period: "/month",
    description: "For scaling businesses that need powerful solutions.",
    featured: true,
    features: [
      "Up to 5 Projects",
      "Advanced AI Solutions",
      "Custom UI/UX Design",
      "Priority 24/7 Support",
      "Weekly Reports & Analytics",
      "99.9% Uptime SLA",
      "Custom Integrations",
      "Dedicated Account Manager",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for organizations at scale.",
    features: [
      "Unlimited Projects",
      "Full AI Suite",
      "White-glove Onboarding",
      "Custom ML Models",
      "On-premise Option",
      "99.99% Uptime SLA",
      "SOC 2 & HIPAA Compliance",
      "Dedicated Engineering Team",
    ],
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Pricing</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Plans for Every <span className="text-gradient">Stage</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative p-7 rounded-2xl bg-gradient-card border transition-all duration-500 flex flex-col ${
                plan.featured ? "border-primary/40 shadow-glow-sm scale-[1.02]" : "border-border/50"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-cta text-primary-foreground text-[11px] font-semibold">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground font-light mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold text-gradient">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <div className="divider-line w-full mb-6" />

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check size={14} className="text-primary shrink-0 mt-0.5" />
                    <span className="font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className={`group flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  plan.featured
                    ? "bg-gradient-cta text-primary-foreground shadow-glow hover:scale-[1.02]"
                    : "border border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
