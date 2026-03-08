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
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-20" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[200px] animate-float-reverse" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4">Why Choose Us</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Built for <span className="text-gradient">Excellence</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="divider-line w-20 mx-auto mb-6"
          />
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            What sets our professional team apart from the competition.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group card-hover p-7 rounded-2xl bg-gradient-card border border-border/50 relative overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-500"
                >
                  <item.icon size={22} className="text-primary" />
                </motion.div>
                <h3 className="font-heading text-lg font-semibold mb-2.5 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
