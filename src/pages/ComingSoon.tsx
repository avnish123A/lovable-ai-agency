import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Mail, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Countdown to launch (set your launch date)
  const launchDate = new Date("2025-04-15T00:00:00");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = launchDate.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Simulate subscription
    await new Promise(r => setTimeout(r, 1000));
    toast.success("You're on the list! We'll notify you when we launch.");
    setEmail("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Floating orbs */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[25%] w-72 h-72 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[15%] left-[20%] w-96 h-96 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Animated rocket */}
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative mb-12"
        >
          <div className="w-32 h-32 rounded-3xl bg-gradient-cta flex items-center justify-center mx-auto shadow-glow">
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Rocket className="w-16 h-16 text-white" />
            </motion.div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-8 h-8 text-accent" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground mb-6 tracking-tight"
        >
          Something <span className="text-gradient">Powerful</span> is Coming Soon
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl mx-auto"
        >
          We're building the future of financial comparison. Be the first to know when we launch.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-12"
        >
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-2xl bg-card border border-border shadow-card">
              <p className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
                {String(item.value).padStart(2, "0")}
              </p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Email subscription */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10"
        >
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 rounded-xl border-border text-base"
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="h-14 px-8 rounded-xl bg-gradient-cta text-white font-bold btn-glow"
          >
            <Bell className="w-5 h-5 mr-2" />
            {loading ? "Subscribing..." : "Notify Me"}
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;