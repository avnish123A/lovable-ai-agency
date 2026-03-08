import { motion, useInView } from "framer-motion";
import { Bot, Code, Palette, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const categories = [
  {
    icon: Bot,
    title: "AI Services",
    description: "AI automation, chatbots, content generation, and business tools integration powered by cutting-edge technology.",
    services: ["AI Automation", "Chatbot Development", "Content Generation", "Business Tools"],
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Code,
    title: "Digital Services",
    description: "Full-stack website development, e-commerce platforms, web applications, and high-converting landing pages.",
    services: ["Website Development", "E-commerce", "Web Applications", "Landing Pages"],
    color: "from-accent/20 to-accent/5",
  },
  {
    icon: Palette,
    title: "Creative Services",
    description: "Stunning UI/UX design, brand identity, graphic design, and product design by experienced designers.",
    services: ["UI/UX Design", "Brand Identity", "Graphic Design", "Product Design"],
    color: "from-primary/15 to-accent/10",
  },
  {
    icon: TrendingUp,
    title: "Marketing Services",
    description: "SEO optimization, social media marketing, digital advertising, and conversion optimization strategies.",
    services: ["SEO Optimization", "Social Media", "Digital Advertising", "Conversion Optimization"],
    color: "from-accent/15 to-primary/10",
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[200px] animate-float-reverse" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4"
          >
            What We Do
          </motion.p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Services Built for{" "}
            <span className="text-gradient">Growth</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="divider-line w-20 mx-auto mb-6"
          />
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            Our industry specialists deliver comprehensive digital solutions tailored to your business needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group card-hover relative p-8 rounded-2xl bg-gradient-card border border-border/50 overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

              <div className="relative z-10 flex items-start gap-5">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-500"
                >
                  <cat.icon size={24} className="text-primary" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-semibold mb-2.5 text-foreground group-hover:text-foreground transition-colors">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-light">{cat.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.services.map((s, si) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + si * 0.06 }}
                        className="text-[11px] px-3 py-1.5 rounded-lg bg-secondary/80 text-secondary-foreground border border-border/50 group-hover:border-primary/20 transition-colors duration-300"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
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
            to="/services"
            className="group inline-flex items-center gap-2.5 text-sm font-medium text-primary hover:text-foreground transition-colors duration-300"
          >
            Explore all services
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
