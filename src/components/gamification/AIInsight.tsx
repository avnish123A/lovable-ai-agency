import { motion } from "framer-motion";
import { Sparkles, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";

type InsightType = "tip" | "warning" | "success" | "ai";

const CONFIG: Record<InsightType, { icon: any; border: string; bg: string; iconColor: string }> = {
  tip: { icon: Lightbulb, border: "border-amber-500/20", bg: "bg-amber-500/5", iconColor: "text-amber-500" },
  warning: { icon: AlertTriangle, border: "border-destructive/20", bg: "bg-destructive/5", iconColor: "text-destructive" },
  success: { icon: CheckCircle, border: "border-accent/20", bg: "bg-accent/5", iconColor: "text-accent" },
  ai: { icon: Sparkles, border: "border-primary/20", bg: "bg-primary/5", iconColor: "text-primary" },
};

interface AIInsightProps {
  type: InsightType;
  title: string;
  message: string;
  delay?: number;
}

const AIInsight = ({ type, title, message, delay = 0 }: AIInsightProps) => {
  const config = CONFIG[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`rounded-xl border ${config.border} ${config.bg} p-4`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg bg-card flex items-center justify-center shrink-0 mt-0.5`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground mb-0.5">{type === "ai" ? "🤖 " : ""}{title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AIInsight;
