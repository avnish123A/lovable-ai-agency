import { motion } from "framer-motion";
import { Wrench, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface MaintenancePageProps {
  message?: string;
  estimatedTime?: string;
}

const MaintenancePage = ({ 
  message = "We are currently upgrading our platform to serve you better.", 
  estimatedTime = "2 hours" 
}: MaintenancePageProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
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
          className="w-32 h-32 rounded-3xl bg-gradient-cta flex items-center justify-center mx-auto mb-10 shadow-glow"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Wrench className="w-16 h-16 text-white" />
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
        >
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border shadow-card">
            <Clock className="w-6 h-6 text-primary" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Estimated Time</p>
              <p className="font-heading font-bold text-foreground">{estimatedTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card border border-border shadow-card">
            <Mail className="w-6 h-6 text-primary" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Contact Us</p>
              <a href="mailto:support@apninivesh.in" className="font-heading font-bold text-foreground hover:text-primary transition-colors">
                support@apninivesh.in
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>We'll be back shortly. Thank you for your patience!</span>
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenancePage;