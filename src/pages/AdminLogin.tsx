import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/admin/dashboard");
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/admin/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // If user doesn't exist yet, try signing up (first time setup)
      if (error.message.includes("Invalid login")) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
        // Auto-confirmed, so sign in again
        const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
        if (retryError) {
          setError(retryError.message);
          setLoading(false);
          return;
        }
      } else {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="border border-border/50 rounded-2xl bg-card/50 backdrop-blur-xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-4">
              <Bot size={28} className="text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              NEXUS<span className="text-gradient">AI</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Admin Panel</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-border/60 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-10 pr-12 rounded-lg border border-border/60 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              ← Back to website
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
