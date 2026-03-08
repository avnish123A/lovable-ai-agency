import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Mail, Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useComingSoonMode } from "@/contexts/ComingSoonContext";

/* ─── Countdown Digit ─── */
const CountdownDigit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="text-4xl sm:text-6xl font-heading font-extrabold text-foreground tabular-nums"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
    </AnimatePresence>
    <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mt-1">
      {label}
    </span>
  </div>
);

/* ─── Main Component ─── */
const ComingSoon = () => {
  const { settings } = useComingSoonMode();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const launchDate = new Date(settings.launch_date + "T00:00:00");
    const tick = () => {
      const diff = launchDate.getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [settings.launch_date]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("You're on the list! We'll notify you when we launch.");
    setEmail("");
    setLoading(false);
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-lg w-full mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mx-auto mb-8 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
        >
          <Rocket className="w-8 h-8 text-primary" />
        </motion.div>

        {/* Dynamic headline from admin */}
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-3 tracking-tight">
          {settings.headline || "Coming Soon"}
        </h1>

        {/* Dynamic description from admin */}
        <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          {settings.description || "We're building something great. Be the first to experience it."}
        </p>

        {/* Countdown using dynamic launch_date */}
        <div className="flex justify-center gap-6 sm:gap-10 mb-10">
          <CountdownDigit value={timeLeft.days} label="Days" />
          <CountdownDigit value={timeLeft.hours} label="Hours" />
          <CountdownDigit value={timeLeft.minutes} label="Min" />
          <CountdownDigit value={timeLeft.seconds} label="Sec" />
        </div>

        <div className="w-12 h-px bg-border mx-auto mb-10" />

        <AnimatePresence mode="wait">
          {subscribed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4 text-primary" />
              You're on the list!
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -8 }}
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-border bg-card text-sm"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
              >
                <Bell className="w-4 h-4 mr-1.5" />
                {loading ? "..." : "Notify Me"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-center gap-2 opacity-50">
          <img src="/logos/apninivesh-logo.png" alt="ApniNivesh" className="h-5 w-5 object-contain" />
          <span className="text-xs font-heading font-semibold text-foreground">
            Apni<span className="text-accent">Nivesh</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
