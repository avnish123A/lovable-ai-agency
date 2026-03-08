import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const projects = [
  {
    client: "FinTech Startup",
    title: "AI-Powered Fraud Detection",
    description: "Deployed real-time transaction monitoring that reduced fraud by 94% while maintaining sub-100ms response times across millions of daily transactions.",
    metric: "94%",
    metricLabel: "Fraud Reduction",
    tags: ["Machine Learning", "Real-time", "FinTech"],
    category: "AI",
  },
  {
    client: "E-Commerce Platform",
    title: "Intelligent Customer Support",
    description: "Built multi-language conversational AI handling 15,000+ daily queries with 97% customer satisfaction score.",
    metric: "97%",
    metricLabel: "CSAT Score",
    tags: ["NLP", "Chatbot", "Multilingual"],
    category: "AI",
  },
  {
    client: "Healthcare SaaS",
    title: "Predictive Patient Analytics",
    description: "Created ML pipelines processing 2M+ patient records for early diagnosis and treatment optimization.",
    metric: "3.2×",
    metricLabel: "Diagnostic Accuracy",
    tags: ["Healthcare", "Analytics", "HIPAA"],
    category: "AI",
  },
  {
    client: "Logistics Company",
    title: "Route Optimization Engine",
    description: "Engineered AI agents that optimized delivery routes across 50+ cities, cutting costs by 40%.",
    metric: "40%",
    metricLabel: "Cost Reduction",
    tags: ["Optimization", "Automation"],
    category: "AI",
  },
  {
    client: "Fashion Brand",
    title: "E-Commerce Platform Redesign",
    description: "Complete redesign and rebuild of an e-commerce platform resulting in 65% increase in conversions and 3× page speed improvement.",
    metric: "65%",
    metricLabel: "Conversion Boost",
    tags: ["E-commerce", "UI/UX", "Performance"],
    category: "Web",
  },
  {
    client: "Real Estate Firm",
    title: "Property Management App",
    description: "Full-stack web application for managing 10,000+ property listings with real-time search and virtual tours.",
    metric: "10K+",
    metricLabel: "Properties Managed",
    tags: ["Web App", "Real-time", "Maps"],
    category: "Web",
  },
];

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Portfolio</p>
            <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight mb-5">
              Our <span className="text-gradient">Work</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Case studies and projects showcasing our expertise across AI, web development, and digital solutions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group p-8 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 hover:shadow-glow-sm transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-medium text-primary">{project.client}</span>
                  <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-heading text-2xl font-semibold mb-3 text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light">{project.description}</p>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 mb-5">
                  <TrendingUp size={18} className="text-primary" />
                  <div>
                    <span className="font-heading text-2xl font-bold text-gradient">{project.metric}</span>
                    <span className="text-xs text-muted-foreground ml-2">{project.metricLabel}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[11px] px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
};

export default Portfolio;
