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

const statVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, type: "spring" as const, stiffness: 200 },
  }),
};

const valueVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24 relative overflow-hidden">
        {/* Floating bg */}
        <motion.div
          animate={{ y: [0, -25, 0], scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[10%] w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-40 left-[5%] w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"
        />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-20 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <TrustBadge variant="partner" className="mb-6" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              About <span className="text-gradient">ApniNivesh</span>
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg text-muted-foreground leading-relaxed">
              ApniNivesh is India's trusted financial comparison platform built by{" "}
              <strong className="text-foreground">Inspirex Technologies INC</strong>. We help millions of Indians
              discover, compare, and apply for the best credit cards, loans, and insurance products from
              top banks — all in one place.
            </motion.p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={statVariants}
                whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.2 } }}
                className="text-center p-6 rounded-2xl border border-border bg-card shadow-card cursor-default relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/3 transition-all duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  </motion.div>
                  <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
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
          <div className="mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-heading font-bold text-center mb-12"
            >
              What We <span className="text-gradient">Stand For</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={valueVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="p-6 rounded-2xl border border-border bg-card shadow-card group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/3 transition-all duration-500 rounded-2xl" />
                  <div className="relative z-10">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-4"
                    >
                      <v.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h3 className="font-heading font-bold text-foreground mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h2 className="text-3xl font-heading font-bold mb-4">
              Built by <span className="text-gradient">Inspirex Technologies INC</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Inspirex Technologies INC is a technology company focused on building innovative fintech
              solutions for the Indian market. ApniNivesh is our flagship product.
            </p>
            <motion.div 
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-card shadow-card cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-heading font-bold text-foreground text-sm">Inspirex Technologies INC</p>
                <p className="text-xs text-muted-foreground">Fintech Innovation Studio</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
