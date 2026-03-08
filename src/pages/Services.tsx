import { motion } from "framer-motion";
import { Bot, Code, Palette, TrendingUp, Workflow, MessageSquare, ShoppingCart, Layout, Brush, Package, Search, Share2, Megaphone, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const serviceCategories = [
  {
    icon: Bot,
    title: "AI Services",
    description: "Harness the power of artificial intelligence to automate, optimize, and innovate across your business operations.",
    services: [
      { icon: Workflow, title: "AI Automation", description: "Intelligent workflows that learn your patterns and automate repetitive tasks, saving thousands of hours." },
      { icon: MessageSquare, title: "AI Chatbot Development", description: "Custom conversational AI across web, WhatsApp, and Slack — trained on your unique knowledge base." },
      { icon: Bot, title: "AI Content Generation", description: "Automated content creation for marketing, documentation, and customer communications at scale." },
      { icon: Package, title: "AI Business Tools", description: "Seamless integration of AI into your existing business tools and processes for maximum efficiency." },
    ],
  },
  {
    icon: Code,
    title: "Digital Services",
    description: "Professional development team building modern, scalable web solutions that drive business growth.",
    services: [
      { icon: Code, title: "Website Development", description: "Custom websites built with modern technologies, optimized for performance, SEO, and conversion." },
      { icon: ShoppingCart, title: "E-commerce Development", description: "Full-featured online stores with payment integration, inventory management, and analytics." },
      { icon: Layout, title: "Web Applications", description: "Complex web applications with real-time features, user management, and scalable architecture." },
      { icon: Target, title: "Landing Page Design", description: "High-converting landing pages designed to capture leads and drive marketing campaign performance." },
    ],
  },
  {
    icon: Palette,
    title: "Creative Services",
    description: "Experienced designers crafting memorable visual experiences that set your brand apart from the competition.",
    services: [
      { icon: Palette, title: "UI/UX Design", description: "User-centered design that balances aesthetics with functionality for exceptional digital experiences." },
      { icon: Brush, title: "Brand Identity Design", description: "Complete brand systems including logos, color palettes, typography, and brand guidelines." },
      { icon: Package, title: "Graphic Design", description: "Print and digital design assets including social media graphics, presentations, and marketing materials." },
      { icon: Layout, title: "Product Design", description: "End-to-end product design from user research and wireframes to high-fidelity prototypes and testing." },
    ],
  },
  {
    icon: TrendingUp,
    title: "Marketing Services",
    description: "Data-driven marketing strategies that increase visibility, drive traffic, and convert visitors into customers.",
    services: [
      { icon: Search, title: "SEO Optimization", description: "Technical SEO, content strategy, and link building to improve your search engine rankings and organic traffic." },
      { icon: Share2, title: "Social Media Marketing", description: "Strategic social media management across all platforms with content creation and community engagement." },
      { icon: Megaphone, title: "Digital Advertising", description: "Targeted PPC, display, and social media advertising campaigns with data-driven optimization." },
      { icon: Target, title: "Conversion Optimization", description: "A/B testing, funnel optimization, and UX improvements to maximize your conversion rates." },
    ],
  },
];

const Services = () => {
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Our Services</p>
            <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight mb-5">
              Comprehensive Digital <span className="text-gradient">Solutions</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Our expert team delivers end-to-end services across AI, development, design, and marketing — everything you need to succeed in the digital age.
            </p>
          </motion.div>
        </div>
      </section>

      {serviceCategories.map((category, catIdx) => (
        <section key={category.title} className={`py-20 relative ${catIdx % 2 === 1 ? "bg-card/30" : ""}`}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-5 mb-12"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <category.icon size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-2">{category.title}</h2>
                <p className="text-muted-foreground font-light max-w-xl">{category.description}</p>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5">
              {category.services.map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group p-6 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/20 transition-all duration-400"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <service.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CTASection />
      <Footer />
    </div>
  );
};

export default Services;
