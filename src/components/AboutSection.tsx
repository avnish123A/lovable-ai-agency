import { motion } from "framer-motion";
import { Zap, Target, Users, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Startup-First Mindset",
    description: "We understand runway and speed. Solutions that ship fast and iterate faster — purpose-built for ambitious teams.",
  },
  {
    icon: Zap,
    title: "Rapid Prototyping",
    description: "From concept to working prototype in under 2 weeks. Production-grade deployment within 30 days.",
  },
  {
    icon: Users,
    title: "Dedicated AI Engineers",
    description: "Your own team of ML engineers, prompt specialists, and automation architects — embedded in your workflow.",
  },
];

const milestones = [
  "Y Combinator-backed startups trust us",
  "SOC 2 Type II compliant infrastructure",
  "99.9% uptime across all deployments",
  "Average 3× ROI within first quarter",
];

const AboutSection = () => {
  return (
    <section id="about" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-20" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">About Nexus AI</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Built by founders,{" "}
              <span className="text-gradient italic">for founders</span>
            </h2>
            <div className="gold-line w-16 mb-8" />
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-light">
              We started Nexus AI because too many startups waste months building AI in-house.
              Our team of ex-Google, ex-OpenAI engineers helps you skip the learning curve and
              go straight to production-ready AI.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {milestones.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                  <span className="font-light">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-5"
          >
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15 }}
                whileHover={{ x: 6, transition: { duration: 0.3 } }}
                className="flex gap-6 p-7 rounded-sm bg-gradient-card border-gradient hover:shadow-glow-sm transition-all duration-500"
              >
                <div className="w-12 h-12 shrink-0 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <pillar.icon size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold mb-2 text-foreground">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
