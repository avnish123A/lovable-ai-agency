import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Mail, Clock, Shield, RefreshCw, AlertCircle } from "lucide-react";
import { useState } from "react";

interface MaintenancePageProps {
  message?: string;
  estimatedTime?: string;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const MaintenancePage = ({
  message = "We are currently upgrading our platform to serve you better.",
  estimatedTime = "2 hours",
}: MaintenancePageProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => window.location.reload(), 600);
  };

  const infoCards = [
    { icon: Clock, title: "Est. Time", value: estimatedTime },
    { icon: Shield, title: "Status", value: "Data Safe" },
    { icon: AlertCircle, title: "Priority", value: "High" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -25, 0], scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[20%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 25, 0], scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-[20%] w-80 h-80 bg-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-1/2 left-1/3 w-60 h-60 bg-primary/5 rounded-full blur-3xl"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        {/* Animated icon with glow ring */}
        <motion.div variants={fadeUp} className="relative mx-auto mb-10 w-32 h-32">
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-cta"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative w-full h-full rounded-3xl bg-gradient-cta flex items-center justify-center shadow-glow"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Wrench className="w-14 h-14 text-primary-foreground" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground mb-6 tracking-tight"
        >
          Under{" "}
          <motion.span
            className="text-gradient inline-block"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            Maintenance
          </motion.span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg mx-auto"
        >
          {message}
        </motion.p>

        {/* Progress indicator */}
        <motion.div variants={fadeUp} className="max-w-sm mx-auto mb-10">
          <div className="h-2.5 rounded-full bg-border overflow-hidden relative">
            <motion.div
              className="h-full rounded-full bg-gradient-cta"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "65%", "45%", "80%", "60%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-xs text-muted-foreground font-medium">Upgrade in progress...</p>
          </div>
        </motion.div>

        {/* Info cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {infoCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ scale: 1.04, y: -3 }}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-card border border-border shadow-card hover:border-primary/30 hover:shadow-glow-sm transition-all cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">{card.title}</p>
                <p className="font-heading font-bold text-foreground text-sm">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border">
            <Mail className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Need help? Contact us</p>
              <a href="mailto:support@apninivesh.in" className="font-heading font-bold text-foreground hover:text-primary transition-colors text-sm">
                support@apninivesh.in
              </a>
            </div>
          </div>
        </motion.div>

        {/* Refresh + status */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-4">
          <motion.button
            onClick={handleRefresh}
            disabled={refreshing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-cta text-primary-foreground text-sm font-bold shadow-glow-sm btn-glow relative overflow-hidden disabled:opacity-70"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
            />
            <RefreshCw className={`w-4 h-4 relative z-10 ${refreshing ? "animate-spin" : ""}`} />
            <span className="relative z-10">{refreshing ? "Checking..." : "Check Again"}</span>
          </motion.button>

          <p className="text-sm text-muted-foreground">
            We'll be back shortly. Thank you for your patience!
          </p>

          <div className="flex items-center gap-2 opacity-50 mt-2">
            <img src="/logos/apninivesh-logo.png" alt="ApniNivesh" className="h-5 w-5 object-contain" />
            <span className="text-xs font-heading font-semibold text-foreground">
              Apni<span className="text-accent">Nivesh</span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
