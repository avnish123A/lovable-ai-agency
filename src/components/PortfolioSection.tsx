import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const projects = [
  {
    client: "FinTech Startup",
    title: "AI-Powered Fraud Detection",
    description: "Real-time transaction monitoring reducing fraud by 94%.",
    metric: "94%",
    metricLabel: "Fraud Reduction",
    tags: ["AI", "FinTech"],
  },
  {
    client: "E-Commerce Platform",
    title: "Intelligent Customer Support",
    description: "Multi-language AI handling 15,000+ daily queries.",
    metric: "97%",
    metricLabel: "CSAT Score",
    tags: ["Chatbot", "NLP"],
  },
  {
    client: "Healthcare SaaS",
    title: "Predictive Patient Analytics",
    description: "ML pipelines processing 2M+ patient records.",
    metric: "3.2×",
    metricLabel: "Accuracy Boost",
    tags: ["Healthcare", "ML"],
  },
];

const PortfolioSection = () => {
  return (
    <section className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-30" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Our Work</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Results That <span className="text-gradient">Speak</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            A selection of transformative projects delivered for visionary companies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group p-7 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 hover:shadow-glow-sm transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-primary">{project.client}</span>
                <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2 text-foreground">{project.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-light">{project.description}</p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 mb-4">
                <span className="font-heading text-2xl font-bold text-gradient">{project.metric}</span>
                <span className="text-[11px] text-muted-foreground">{project.metricLabel}</span>
              </div>
              <div className="flex gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/50">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground transition-colors"
          >
            View all projects
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
