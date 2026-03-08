import { motion, useInView } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

const highlights = [
  "50+ successful projects delivered worldwide",
  "Team of 15+ industry specialists",
  "SOC 2 & GDPR compliant infrastructure",
  "Average 3× ROI within first quarter",
];

const AnimatedStat = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericPart = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * numericPart));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, numericPart]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="p-7 rounded-2xl bg-gradient-card border border-border/50 text-center hover:border-primary/30 hover:shadow-glow-sm transition-all duration-500"
    >
      <div className="font-heading text-3xl sm:text-4xl font-bold text-gradient mb-1.5">
        {isInView ? count : 0}{suffix}
      </div>
      <div className="text-xs text-muted-foreground font-medium tracking-wide">{label}</div>
    </motion.div>
  );
};

const AboutSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[200px] animate-float-slow" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4"
            >
              About Us
            </motion.p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              A Team of <span className="text-gradient">Experts</span>
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="divider-line w-16 mb-8"
              style={{ transformOrigin: "left" }}
            />
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-light">
              We are a team of experienced professionals and industry specialists who deliver 
              high-quality digital solutions. Our expert developers, AI specialists, and experienced 
              designers work together to help businesses grow and innovate.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground group"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                  </motion.div>
                  <span className="font-light">{item}</span>
                </motion.div>
              ))}
            </div>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2.5 text-sm font-medium text-primary hover:text-foreground transition-colors duration-300"
            >
              Learn more about us
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-5"
          >
            <AnimatedStat value="10+" label="Years Experience" />
            <AnimatedStat value="50+" label="Clients Served" />
            <AnimatedStat value="200+" label="Projects Done" />
            <AnimatedStat value="98%" label="Satisfaction" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
