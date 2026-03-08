import { motion } from "framer-motion";
import { Brain, Workflow, BarChart3, Shield, MessageSquare, Cpu } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "Custom AI Agents",
    description: "Bespoke AI agents for customer support, lead qualification, and autonomous data processing.",
    highlight: true,
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Intelligent automation that learns your team's patterns and connects seamlessly to your existing tools.",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Transform raw data into revenue forecasts, churn predictions, and actionable growth strategies.",
  },
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Multi-language chatbots across web, WhatsApp, and Slack — trained on your unique knowledge base.",
  },
  {
    icon: Shield,
    title: "AI Compliance & Safety",
    description: "Enterprise-grade guardrails meeting SOC 2, GDPR, and all major industry regulations.",
  },
  {
    icon: Cpu,
    title: "MLOps & Deployment",
    description: "Production-ready infrastructure with auto-scaling, A/B testing, and real-time model monitoring.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-30" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">Our Capabilities</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            Crafted with <span className="text-gradient italic">Precision</span>
          </h2>
          <div className="gold-line w-16 mx-auto mb-6" />
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            From ideation to production — we handle the entire AI lifecycle so you can focus on what matters most.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className={`group relative p-8 rounded-sm bg-gradient-card border-gradient hover:shadow-glow-sm transition-all duration-500 ${
                service.highlight ? "ring-1 ring-primary/20" : ""
              }`}
            >
              {service.highlight && (
                <span className="absolute top-5 right-5 text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-sm bg-primary/10 text-primary border border-primary/20">
                  Popular
                </span>
              )}
              <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-500">
                <service.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
