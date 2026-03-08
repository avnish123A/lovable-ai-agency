import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, TrendingUp } from "lucide-react";
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
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-40" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[180px] animate-float-slow" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4">Our Work</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Results That <span className="text-gradient">Speak</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="divider-line w-20 mx-auto mb-6"
          />
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            A selection of transformative projects delivered for visionary companies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group card-hover p-8 rounded-2xl bg-gradient-card border border-border/50 overflow-hidden relative"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-semibold text-primary tracking-wide">{project.client}</span>
                  <motion.div
                    whileHover={{ rotate: 45 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </motion.div>
                </div>
                <h3 className="font-heading text-lg font-semibold mb-3 text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light">{project.description}</p>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 mb-5 border border-border/30"
                >
                  <TrendingUp size={18} className="text-primary" />
                  <div>
                    <span className="font-heading text-2xl font-bold text-gradient">{project.metric}</span>
                    <span className="text-[11px] text-muted-foreground ml-2 font-medium">{project.metricLabel}</span>
                  </div>
                </motion.div>

                <div className="flex gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground border border-border/50 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-14"
        >
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2.5 text-sm font-medium text-primary hover:text-foreground transition-colors duration-300"
          >
            View all projects
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
