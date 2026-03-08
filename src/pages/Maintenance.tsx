import { motion } from "framer-motion";
import { Wrench, Mail, Clock, Shield, RefreshCw } from "lucide-react";

interface MaintenancePageProps {
  message?: string;
  estimatedTime?: string;
}

const MaintenancePage = ({
  message = "We are currently upgrading our platform to serve you better.",
  estimatedTime = "2 hours",
}: MaintenancePageProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[20%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-[20%] w-80 h-80 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-28 h-28 rounded-3xl bg-gradient-cta flex items-center justify-center mx-auto mb-10 shadow-glow"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wrench className="w-14 h-14 text-primary-foreground" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground mb-6 tracking-tight"
        >
          Under <span className="text-gradient">Maintenance</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg mx-auto"
        >
          {message}
        </motion.p>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="max-w-xs mx-auto mb-10"
        >
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-cta"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "65%", "45%", "80%", "60%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">Upgrade in progress...</p>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-card border border-border shadow-card">
            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Est. Time</p>
              <p className="font-heading font-bold text-foreground text-sm">{estimatedTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-card border border-border shadow-card">
            <Shield className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-heading font-bold text-foreground text-sm">Data Safe</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-card border border-border shadow-card">
            <Mail className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Contact</p>
              <a
                href="mailto:support@apninivesh.in"
                className="font-heading font-bold text-foreground hover:text-primary transition-colors text-sm"
              >
                support@apninivesh.in
              </a>
            </div>
          </div>
        </motion.div>

        {/* Refresh + status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold text-foreground hover:border-primary/40 hover:shadow-glow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
            Check Again
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>We'll be back shortly. Thank you for your patience!</span>
          </div>
          <div className="flex items-center gap-2 opacity-50 mt-2">
            <img src="/logos/apninivesh-logo.png" alt="ApniNivesh" className="h-5 w-5 object-contain" />
            <span className="text-xs font-heading font-semibold text-foreground">
              Apni<span className="text-accent">Nivesh</span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenancePage;
