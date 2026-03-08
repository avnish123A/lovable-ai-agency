import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  format?: boolean;
}

const AnimatedCounter = ({ value, prefix = "", suffix = "", duration = 800, className = "", format = true }: AnimatedCounterProps) => {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const diff = value - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    prevRef.current = value;
  }, [value, duration]);

  const formatted = format ? display.toLocaleString("en-IN") : display.toString();

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.7, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
