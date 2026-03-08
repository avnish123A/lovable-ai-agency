import { motion } from "framer-motion";
import { Target, Zap, Users, CheckCircle2, Globe, Shield, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const values = [
  { icon: Target, title: "Innovation First", description: "We stay at the forefront of technology, constantly exploring new solutions to deliver cutting-edge results." },
  { icon: Zap, title: "Rapid Delivery", description: "From concept to production in weeks. Our agile methodology ensures fast, iterative progress." },
  { icon: Users, title: "Client Partnership", description: "We treat every project as a partnership, embedding ourselves in your workflow for maximum impact." },
  { icon: Shield, title: "Enterprise Security", description: "SOC 2, GDPR, and HIPAA compliant. Your data security is our top priority." },
  { icon: Globe, title: "Global Perspective", description: "Serving businesses across 20+ countries with culturally aware, globally scalable solutions." },
  { icon: Award, title: "Quality Obsessed", description: "Every line of code, every pixel, every strategy — crafted to the highest professional standards." },
];

const team = [
  { name: "Alex Morgan", role: "CEO & AI Lead", description: "10+ years in AI/ML. Ex-Google." },
  { name: "Sarah Park", role: "Head of Design", description: "Award-winning UI/UX designer." },
  { name: "James Chen", role: "CTO", description: "Full-stack architect. Ex-Stripe." },
  { name: "Maria Santos", role: "Marketing Director", description: "Digital growth specialist." },
];

const About = () => {
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">About Us</p>
            <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight mb-5">
              Meet Our <span className="text-gradient">Expert Team</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              We are a team of experienced professionals and industry specialists delivering modern digital solutions for businesses worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: "10+", label: "Years Experience" },
              { value: "50+", label: "Clients Worldwide" },
              { value: "200+", label: "Projects Delivered" },
              { value: "15+", label: "Team Members" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-card border border-border/50 text-center"
              >
                <div className="font-heading text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-muted-foreground font-light">The principles that guide everything we do.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-gradient-card border border-border/50"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <v.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Leadership <span className="text-gradient">Team</span>
            </h2>
            <p className="text-muted-foreground font-light">The experienced professionals leading our mission.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-card border border-border/50 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-heading font-bold text-lg">{person.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <h3 className="font-heading font-semibold text-foreground text-sm">{person.name}</h3>
                <p className="text-xs text-primary font-medium mt-0.5 mb-2">{person.role}</p>
                <p className="text-xs text-muted-foreground font-light">{person.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default About;
