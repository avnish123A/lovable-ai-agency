import { motion } from "framer-motion";
import { Shield, Users, TrendingUp, Award, Heart, Building } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustBadge from "@/components/TrustBadge";

const stats = [
  { value: "50,000+", label: "Happy Users", icon: Users },
  { value: "200+", label: "Financial Products", icon: Award },
  { value: "15+", label: "Bank Partners", icon: Building },
  { value: "₹2Cr+", label: "Savings Generated", icon: TrendingUp },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "We display verified information from official bank sources. No hidden fees or misleading claims.",
  },
  {
    icon: Heart,
    title: "User First Approach",
    desc: "Every feature is designed to help users make smarter financial decisions with confidence.",
  },
  {
    icon: TrendingUp,
    title: "AI-Powered Insights",
    desc: "We use AI to simplify complex financial products into easy-to-understand recommendations.",
  },
  {
    icon: Award,
    title: "Best Deals Guaranteed",
    desc: "Our partnerships with top banks ensure users always get access to the best available offers.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20 max-w-3xl mx-auto">
            <TrustBadge variant="partner" className="mb-6" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              About <span className="text-gradient">ApniNivesh</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ApniNivesh is India's trusted financial comparison platform built by{" "}
              <strong className="text-foreground">Inspirex Technologies INC</strong>. We help millions of Indians
              discover, compare, and apply for the best credit cards, loans, and insurance products from
              top banks — all in one place.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border border-border bg-card shadow-card"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-24"
          >
            <h2 className="text-3xl font-heading font-bold mb-4">
              Our <span className="text-gradient">Mission</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To democratize financial decision-making in India by providing transparent, AI-powered
              comparisons of credit cards, loans, and insurance products. We believe every Indian
              deserves access to the best financial products without the confusion.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-3xl font-heading font-bold text-center mb-12">
              What We <span className="text-gradient">Stand For</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl border border-border bg-card shadow-card"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-heading font-bold mb-4">
              Built by <span className="text-gradient">Inspirex Technologies INC</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Inspirex Technologies INC is a technology company focused on building innovative fintech
              solutions for the Indian market. ApniNivesh is our flagship product.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-card shadow-card">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-heading font-bold text-foreground text-sm">Inspirex Technologies INC</p>
                <p className="text-xs text-muted-foreground">Fintech Innovation Studio</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
