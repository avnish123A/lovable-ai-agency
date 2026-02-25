import { motion } from "framer-motion";
import { Brain, Workflow, BarChart3, Shield, MessageSquare, Cpu } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "Custom AI Agents",
    description: "Build tailored AI agents that handle customer support, lead qualification, and data processing autonomously.",
    tag: "Most Popular",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Connect your existing tools with intelligent automation that learns from your team's patterns and adapts.",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Turn your raw business data into revenue forecasts, churn predictions, and growth opportunity maps.",
  },
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Deploy multi-language chatbots on your website, WhatsApp, and Slack — trained on your knowledge base.",
  },
  {
    icon: Shield,
    title: "AI Compliance & Safety",
    description: "Enterprise-grade guardrails ensuring your AI systems meet SOC 2, GDPR, and industry regulations.",
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
      <div className="absolute inset-0 bg-gradient-hero opacity-40" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <p className="text-sm text-primary font-medium tracking-wider uppercase mb-3">Our Capabilities</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Everything you need to <span className="text-gradient">deploy AI</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From ideation to production — we handle the entire AI lifecycle so you can focus on scaling your business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative p-7 rounded-xl bg-gradient-card border-gradient hover:shadow-glow-sm transition-all duration-500 cursor-default"
            >
              {service.tag && (
                <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {service.tag}
                </span>
              )}
              <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                <service.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2 text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
