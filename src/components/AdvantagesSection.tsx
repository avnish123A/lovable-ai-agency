import { motion } from "framer-motion";
import { Shield, Zap, Users, Globe, Clock, Award } from "lucide-react";

const advantages = [
  { icon: Users, title: "Expert Team", description: "Industry specialists with 10+ years of experience in AI and digital solutions." },
  { icon: Zap, title: "Rapid Delivery", description: "From concept to production in weeks, not months. Agile methodology at its finest." },
  { icon: Shield, title: "Enterprise Security", description: "SOC 2, GDPR, and HIPAA compliant infrastructure for peace of mind." },
  { icon: Globe, title: "Global Reach", description: "Serving businesses across 20+ countries with 24/7 dedicated support." },
  { icon: Clock, title: "24/7 Support", description: "Round-the-clock monitoring and dedicated account management for every client." },
  { icon: Award, title: "Proven Results", description: "98% client satisfaction rate with measurable ROI on every project we deliver." },
];

const AdvantagesSection = () => {
  return (
    <section className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-20" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Why Choose Us</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Built for <span className="text-gradient">Excellence</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            What sets our professional team apart from the competition.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {advantages.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group p-6 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/20 transition-all duration-400"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <item.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-heading text-base font-semibold mb-2 text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
