import { motion } from "framer-motion";
import { Bot, Code, Palette, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Bot,
    title: "AI Services",
    description: "AI automation, chatbots, content generation, and business tools integration powered by cutting-edge technology.",
    services: ["AI Automation", "Chatbot Development", "Content Generation", "Business Tools"],
  },
  {
    icon: Code,
    title: "Digital Services",
    description: "Full-stack website development, e-commerce platforms, web applications, and high-converting landing pages.",
    services: ["Website Development", "E-commerce", "Web Applications", "Landing Pages"],
  },
  {
    icon: Palette,
    title: "Creative Services",
    description: "Stunning UI/UX design, brand identity, graphic design, and product design by experienced designers.",
    services: ["UI/UX Design", "Brand Identity", "Graphic Design", "Product Design"],
  },
  {
    icon: TrendingUp,
    title: "Marketing Services",
    description: "SEO optimization, social media marketing, digital advertising, and conversion optimization strategies.",
    services: ["SEO Optimization", "Social Media", "Digital Advertising", "Conversion Optimization"],
  },
];

const ServicesSection = () => {
  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">What We Do</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Services Built for <span className="text-gradient">Growth</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            Our industry specialists deliver comprehensive digital solutions tailored to your business needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group p-8 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 hover:shadow-glow-sm transition-all duration-500"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <cat.icon size={22} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-semibold mb-2 text-foreground">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-light">{cat.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cat.services.map((s) => (
                      <span key={s} className="text-[11px] px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border/50">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
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
            to="/services"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground transition-colors"
          >
            Explore all services
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
