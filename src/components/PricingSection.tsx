import { motion } from "framer-motion";
import { Check, ArrowRight, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "Perfect for startups exploring AI capabilities.",
    features: [
      "1 Custom AI Agent",
      "Up to 5,000 interactions/mo",
      "Email & chat support",
      "Basic analytics dashboard",
      "Standard deployment",
      "99.5% uptime SLA",
    ],
  },
  {
    name: "Growth",
    price: "$999",
    period: "/month",
    description: "For scaling teams that need powerful automation.",
    featured: true,
    features: [
      "Up to 5 AI Agents",
      "Unlimited interactions",
      "Priority 24/7 support",
      "Advanced analytics & reporting",
      "Multi-channel deployment",
      "99.9% uptime SLA",
      "Custom integrations",
      "Dedicated account manager",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for organizations at scale.",
    features: [
      "Unlimited AI Agents",
      "Unlimited interactions",
      "White-glove onboarding",
      "Custom ML model training",
      "On-premise deployment option",
      "99.99% uptime SLA",
      "SOC 2 & HIPAA compliance",
      "Dedicated engineering team",
    ],
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">Pricing</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            Invest in <span className="text-gradient italic">Intelligence</span>
          </h2>
          <div className="gold-line w-16 mx-auto mb-6" />
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative p-8 rounded-sm bg-gradient-card border-gradient transition-all duration-500 flex flex-col ${
                plan.featured ? "ring-1 ring-primary/30 shadow-glow-sm scale-[1.02]" : ""
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-sm bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-[0.15em]">
                  <Crown size={10} />
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground font-light mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold text-gradient">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <div className="gold-line w-full mb-8" />

              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check size={14} className="text-primary shrink-0 mt-0.5" />
                    <span className="font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`group flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all duration-500 ${
                  plan.featured
                    ? "bg-primary text-primary-foreground shadow-glow hover:shadow-glow-accent"
                    : "border border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
