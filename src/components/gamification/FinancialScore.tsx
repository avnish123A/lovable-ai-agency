import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface FinancialScoreProps {
  score: number; // 0–100
  label: string;
  sublabel?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return { bg: "from-accent to-accent/60", text: "text-accent", icon: TrendingUp, tag: "Excellent" };
  if (score >= 60) return { bg: "from-primary to-primary/60", text: "text-primary", icon: TrendingUp, tag: "Good" };
  if (score >= 40) return { bg: "from-amber-500 to-amber-400", text: "text-amber-500", icon: Minus, tag: "Average" };
  return { bg: "from-destructive to-destructive/60", text: "text-destructive", icon: TrendingDown, tag: "Needs Work" };
};

const FinancialScore = ({ score, label, sublabel }: FinancialScoreProps) => {
  const config = getScoreColor(score);
  const Icon = config.icon;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="45" fill="none"
            className={`stroke-current ${config.text}`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-3xl font-heading font-bold ${config.text}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-4 h-4 ${config.text}`} />
        <span className={`text-sm font-bold ${config.text}`}>{config.tag}</span>
      </div>
      <p className="text-sm font-heading font-semibold text-foreground">{label}</p>
      {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
    </div>
  );
};

export default FinancialScore;
