import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  current: number; // 0-indexed
}

const StepIndicator = ({ steps, current }: StepIndicatorProps) => (
  <div className="flex items-center justify-center gap-1 mb-6">
    {steps.map((step, i) => (
      <div key={step} className="flex items-center gap-1">
        <motion.div
          animate={{
            scale: i === current ? 1.1 : 1,
            backgroundColor: i <= current ? "hsl(var(--primary))" : "hsl(var(--secondary))",
          }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
        >
          {i < current ? (
            <Check className="w-3.5 h-3.5 text-primary-foreground" />
          ) : (
            <span className={i <= current ? "text-primary-foreground" : "text-muted-foreground"}>{i + 1}</span>
          )}
        </motion.div>
        <span className={`text-[10px] font-medium hidden sm:block ${i <= current ? "text-foreground" : "text-muted-foreground"}`}>
          {step}
        </span>
        {i < steps.length - 1 && (
          <div className={`w-8 h-0.5 mx-1 rounded ${i < current ? "bg-primary" : "bg-secondary"}`} />
        )}
      </div>
    ))}
  </div>
);

export default StepIndicator;
