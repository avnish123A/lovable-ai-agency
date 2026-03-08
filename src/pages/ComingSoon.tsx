import { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Mail, Bell, Sparkles, Star, Zap, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

/* ─── 3D Scene Components ─── */
const FloatingRocket = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.4;
      groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={groupRef}>
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI * 0.15]}>
          <capsuleGeometry args={[0.4, 1.2, 16, 16]} />
          <meshPhysicalMaterial color="#10B981" metalness={0.7} roughness={0.15} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={2} />
        </mesh>
        <mesh position={[0.45, 0.85, 0]} rotation={[0, 0, Math.PI * 0.15]}>
          <coneGeometry args={[0.4, 0.7, 16]} />
          <meshPhysicalMaterial color="#065F46" metalness={0.8} roughness={0.1} clearcoat={1} />
        </mesh>
        <mesh position={[0.15, 0.55, 0.35]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshPhysicalMaterial color="#34D399" metalness={0.3} roughness={0} transmission={0.8} thickness={0.5} />
        </mesh>
        {[0, Math.PI * 0.66, Math.PI * 1.33].map((angle, i) => (
          <mesh key={i} position={[-0.3, -0.4, 0]} rotation={[angle, 0, -0.3]}>
            <boxGeometry args={[0.6, 0.08, 0.4]} />
            <meshPhysicalMaterial color="#065F46" metalness={0.6} roughness={0.2} />
          </mesh>
        ))}
        <mesh position={[-0.5, -0.55, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color="#34D399" transparent opacity={0.3} />
        </mesh>
        <mesh position={[-0.7, -0.75, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.2} />
        </mesh>
      </group>
    </Float>
  );
};

const Particles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#34D399" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const BackgroundSphere = () => (
  <Sphere args={[2, 64, 64]} position={[3, -1, -3]}>
    <MeshDistortMaterial color="#10B981" transparent opacity={0.08} distort={0.4} speed={2} />
  </Sphere>
);

const Scene3D = () => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ background: "transparent" }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, -2, 4]} intensity={0.4} color="#34D399" />
        <pointLight position={[0, 3, 3]} intensity={0.8} color="#10B981" />
        <FloatingRocket />
        <Particles />
        <BackgroundSphere />
      </Suspense>
    </Canvas>
  </div>
);

/* ─── Animated Countdown Digit ─── */
const CountdownDigit = ({ value, label }: { value: number; label: string }) => (
  <motion.div
    className="p-4 sm:p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-card relative overflow-hidden group"
    whileHover={{ scale: 1.05, borderColor: "hsl(160 84% 39% / 0.4)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {/* Shimmer on hover */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100"
      animate={{ x: ["-100%", "200%"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
    />
    <AnimatePresence mode="popLayout">
      <motion.p
        key={value}
        initial={{ y: -20, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="text-3xl sm:text-5xl font-heading font-extrabold text-foreground tabular-nums relative z-10"
      >
        {String(value).padStart(2, "0")}
      </motion.p>
    </AnimatePresence>
    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1 relative z-10">
      {label}
    </p>
  </motion.div>
);

/* ─── Main Component ─── */
const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const launchDate = new Date("2025-07-01T00:00:00");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = launchDate.getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("You're on the list! We'll notify you when we launch.");
    setEmail("");
    setLoading(false);
    setSubscribed(true);
  };

  const features = [
    { icon: Zap, label: "AI-Powered Comparison" },
    { icon: Star, label: "Exclusive Deals" },
    { icon: Sparkles, label: "Smart Recommendations" },
  ];

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-15" />

      {/* Extra animated orbs */}
      <motion.div
        animate={{ y: [0, -25, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-[15%] w-52 h-52 bg-primary/8 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-10 left-[10%] w-72 h-72 bg-accent/8 rounded-full blur-3xl"
      />

      <Scene3D />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        {/* Badge with shimmer */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/20 bg-card/80 backdrop-blur-sm relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
            />
            <Sparkles className="w-4 h-4 text-primary relative z-10" />
            <span className="text-sm text-foreground font-semibold relative z-10">Launching Soon</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-foreground mb-4 tracking-tight"
        >
          Something{" "}
          <motion.span
            className="text-gradient inline-block"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            Powerful
          </motion.span>
          <br />
          is Coming
        </motion.h1>

        <motion.p variants={fadeUp} className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto">
          ApniNivesh is building the future of financial comparison. Be the first to know.
        </motion.p>

        {/* Feature pills */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-10">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.12, type: "spring" }}
              whileHover={{ scale: 1.08, y: -2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/70 backdrop-blur-sm border border-border text-sm text-foreground font-medium cursor-default hover:border-primary/30 hover:shadow-glow-sm transition-shadow"
            >
              <f.icon className="w-4 h-4 text-primary" />
              {f.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Countdown */}
        <motion.div variants={fadeUp} className="grid grid-cols-4 gap-3 sm:gap-5 max-w-lg mx-auto mb-10">
          <CountdownDigit value={timeLeft.days} label="Days" />
          <CountdownDigit value={timeLeft.hours} label="Hours" />
          <CountdownDigit value={timeLeft.minutes} label="Min" />
          <CountdownDigit value={timeLeft.seconds} label="Sec" />
        </motion.div>

        {/* Email subscription */}
        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            {subscribed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary/10 border border-primary/20 text-foreground font-semibold mx-auto max-w-md mb-8"
              >
                <CheckCircle className="w-5 h-5 text-primary" />
                You're on the list! We'll notify you at launch.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 rounded-xl border-border bg-card/80 backdrop-blur-sm text-base focus:border-primary/50 focus:shadow-glow-sm transition-shadow"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-14 px-8 rounded-xl bg-gradient-cta text-primary-foreground font-bold btn-glow shadow-glow-sm relative overflow-hidden group"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                  />
                  <span className="relative z-10 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    {loading ? "Subscribing..." : "Notify Me"}
                  </span>
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Brand + Back link */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 opacity-60">
            <img src="/logos/apninivesh-logo.png" alt="ApniNivesh" className="h-6 w-6 object-contain" />
            <span className="text-xs font-heading font-semibold text-foreground">
              Apni<span className="text-accent">Nivesh</span>
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
