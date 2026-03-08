import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
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
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[200px] animate-float-slow" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4">Pricing</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Plans for Every <span className="text-gradient">Stage</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="divider-line w-20 mx-auto mb-6"
          />
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            Transparent pricing. No hidden fees. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -10,
                transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
              }}
              className={`relative p-8 rounded-2xl bg-gradient-card border transition-all duration-500 flex flex-col overflow-hidden ${
                plan.featured ? "border-primary/40 shadow-glow" : "border-border/50 hover:border-primary/20 hover:shadow-glow-sm"
              }`}
            >
              {/* Top glow for featured */}
              {plan.featured && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-primary/15 blur-[80px] rounded-full" />
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-cta text-primary-foreground text-[11px] font-semibold flex items-center gap-1.5 shadow-glow"
                  >
                    <Sparkles size={10} />
                    Most Popular
                  </motion.div>
                </>
              )}

              <div className="relative z-10">
                <div className="mb-7">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1.5">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground font-light mb-5">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-4xl font-bold text-gradient">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <div className="divider-line w-full mb-7" />

                <ul className="space-y-3.5 mb-9 flex-1">
                  {plan.features.map((feature, fi) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + fi * 0.05 }}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <Check size={14} className="text-primary shrink-0 mt-0.5" />
                      <span className="font-light">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`group flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    plan.featured
                      ? "bg-gradient-cta text-primary-foreground shadow-glow hover:shadow-glow-lg hover:scale-[1.02]"
                      : "border border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
