import { motion } from "framer-motion";
import { Zap, Target, Users } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We partner with companies whose work matters, building AI that creates genuine value.",
  },
  {
    icon: Zap,
    title: "Speed & Precision",
    description: "Rapid prototyping to production deployment — without cutting corners on quality.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "PhDs, engineers, and strategists who've shipped AI at the world's top companies.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm text-primary font-medium tracking-wider uppercase mb-3">About Us</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              The agency for teams that <span className="text-gradient">refuse to settle</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Founded by AI researchers and product builders, Nexus AI exists at the intersection
              of cutting-edge research and real-world execution. We've helped startups and Fortune 500s
              alike unlock step-change improvements through intelligent automation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our approach is simple: understand the problem deeply, move fast, and deliver systems
              that work in production — not just in demos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5"
          >
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex gap-5 p-6 rounded-xl bg-gradient-card border-gradient"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <pillar.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1 text-foreground">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
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
