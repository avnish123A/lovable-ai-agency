import { motion } from "framer-motion";
import { Brain, Workflow, BarChart3, Shield, MessageSquare, Cpu } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "Custom AI Models",
    description: "Bespoke machine learning models tailored to your specific business challenges and data.",
  },
  {
    icon: Workflow,
    title: "Process Automation",
    description: "End-to-end workflow automation powered by intelligent agents that learn and adapt.",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Data-driven forecasting systems that turn raw information into actionable insights.",
  },
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Advanced chatbots and virtual assistants that understand context and deliver results.",
  },
  {
    icon: Shield,
    title: "AI Safety & Ethics",
    description: "Responsible AI frameworks ensuring your systems are fair, transparent, and compliant.",
  },
  {
    icon: Cpu,
    title: "MLOps & Infrastructure",
    description: "Scalable deployment pipelines and monitoring for production AI systems.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <p className="text-sm text-primary font-medium tracking-wider uppercase mb-3">What We Do</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            AI solutions built for <span className="text-gradient">real impact</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We don't just build AI — we engineer competitive advantages that compound over time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="group p-7 rounded-xl bg-gradient-card border-gradient hover:shadow-glow-sm transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
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
