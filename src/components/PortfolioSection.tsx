import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";

const projects = [
  {
    client: "FinTech Startup",
    title: "AI-Powered Fraud Detection",
    description: "Deployed real-time transaction monitoring that reduced fraud by 94% while maintaining sub-100ms response times.",
    metric: "94%",
    metricLabel: "Fraud Reduction",
    tags: ["Machine Learning", "Real-time", "FinTech"],
  },
  {
    client: "E-Commerce Platform",
    title: "Intelligent Customer Support",
    description: "Built multi-language conversational AI handling 15,000+ daily queries with 97% customer satisfaction.",
    metric: "97%",
    metricLabel: "CSAT Score",
    tags: ["NLP", "Chatbot", "Multilingual"],
  },
  {
    client: "Healthcare SaaS",
    title: "Predictive Patient Analytics",
    description: "Created ML pipelines processing 2M+ patient records for early diagnosis and treatment optimization.",
    metric: "3.2×",
    metricLabel: "Diagnostic Accuracy",
    tags: ["Healthcare", "Analytics", "HIPAA"],
  },
  {
    client: "Logistics Company",
    title: "Route Optimization Engine",
    description: "Engineered AI agents that optimized delivery routes across 50+ cities, cutting costs by 40%.",
    metric: "40%",
    metricLabel: "Cost Reduction",
    tags: ["Optimization", "Automation", "IoT"],
  },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">Case Studies</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            Results That <span className="text-gradient italic">Speak</span>
          </h2>
          <div className="gold-line w-16 mx-auto mb-6" />
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            A selection of transformative projects delivered for visionary companies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group p-8 rounded-sm bg-gradient-card border-gradient hover:shadow-glow-sm transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs uppercase tracking-[0.15em] text-primary font-medium">{project.client}</span>
                <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-3 text-foreground">{project.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light">{project.description}</p>
              
              <div className="flex items-center gap-4 mb-6 p-4 rounded-sm bg-secondary/50">
                <TrendingUp size={18} className="text-primary" />
                <div>
                  <span className="font-heading text-2xl font-bold text-gradient">{project.metric}</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground ml-2">{project.metricLabel}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-sm bg-secondary text-secondary-foreground border border-border/50">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
