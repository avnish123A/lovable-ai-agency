import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lightbulb, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

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
  /** Additional expandable insights */
  insights?: string[];
  delay?: number;
}

const AIInsight = ({ type, title, message, insights, delay = 0 }: AIInsightProps) => {
  const config = CONFIG[type];
  const Icon = config.icon;
  const [expanded, setExpanded] = useState(false);
  const hasMore = insights && insights.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`rounded-xl border ${config.border} ${config.bg} p-4`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shrink-0 mt-0.5">
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-foreground mb-0.5">
              {type === "ai" ? "🤖 " : ""}{title}
              {type === "ai" && (
                <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                  Real Data
                </span>
              )}
            </p>
            {hasMore && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>

          <AnimatePresence>
            {expanded && hasMore && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-border/50 space-y-2.5">
                  {insights.map((insight, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-xs text-muted-foreground leading-relaxed"
                    >
                      {insight}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {hasMore && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="text-[10px] text-primary font-medium mt-1.5 hover:underline"
            >
              +{insights.length} more insights →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AIInsight;
