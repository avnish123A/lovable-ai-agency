import { useState, useEffect, Suspense, useRef } from "react";
import { motion } from "framer-motion";
import { Rocket, Mail, Bell, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

// 3D Floating Rocket Scene
const FloatingRocket = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.4;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.3;
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
  const count = 80;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

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
  <div className="absolute inset-0 z-0">
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
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

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const launchDate = new Date("2025-07-01T00:00:00");
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
    await new Promise(r => setTimeout(r, 1000));
    toast.success("You're on the list! We'll notify you when we launch.");
    setEmail("");
    setLoading(false);
  };

  const features = [
    { icon: Zap, label: "AI-Powered Comparison" },
    { icon: Star, label: "Exclusive Deals" },
    { icon: Sparkles, label: "Smart Recommendations" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <Scene3D />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/20 bg-card/80 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground font-semibold">Launching Soon</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-foreground mb-4 tracking-tight"
        >
          Something{" "}
          <span className="text-gradient">Powerful</span>
          <br />
          is Coming
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto"
        >
          ApniNivesh is building the future of financial comparison. Be the first to know.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/70 backdrop-blur-sm border border-border text-sm text-foreground font-medium"
            >
              <f.icon className="w-4 h-4 text-primary" />
              {f.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-4 gap-3 sm:gap-5 max-w-lg mx-auto mb-10"
        >
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Min", value: timeLeft.minutes },
            { label: "Sec", value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="p-4 sm:p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-card">
              <p className="text-3xl sm:text-5xl font-heading font-extrabold text-foreground tabular-nums">
                {String(item.value).padStart(2, "0")}
              </p>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Email subscription */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
              className="pl-12 h-14 rounded-xl border-border bg-card/80 backdrop-blur-sm text-base"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-14 px-8 rounded-xl bg-gradient-cta text-primary-foreground font-bold btn-glow shadow-glow-sm"
          >
            <Bell className="w-5 h-5 mr-2" />
            {loading ? "Subscribing..." : "Notify Me"}
          </Button>
        </motion.form>

        {/* Brand + Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 opacity-60">
            <img src="/logos/apninivesh-logo.png" alt="ApniNivesh" className="h-6 w-6 object-contain" />
            <span className="text-xs font-heading font-semibold text-foreground">
              Apni<span className="text-accent">Nivesh</span>
            </span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
