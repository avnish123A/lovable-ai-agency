import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, Shield, Target, Zap, Trophy, TrendingUp, Wallet } from "lucide-react";

export type BadgeType = "smart_planner" | "savvy_saver" | "debt_crusher" | "goal_setter" | "budget_master" | "cashback_pro" | "smart_saver" | "investment_planner" | "credit_pro";

const BADGE_CONFIG: Record<BadgeType, { icon: any; label: string; color: string; bg: string }> = {
  smart_planner: { icon: Star, label: "Smart Planner", color: "text-amber-500", bg: "from-amber-500/10 to-amber-400/5 border-amber-500/20" },
  savvy_saver: { icon: Shield, label: "Savvy Saver", color: "text-accent", bg: "from-accent/10 to-accent/5 border-accent/20" },
  debt_crusher: { icon: Zap, label: "Debt Crusher", color: "text-primary", bg: "from-primary/10 to-primary/5 border-primary/20" },
  goal_setter: { icon: Target, label: "Goal Setter", color: "text-purple-500", bg: "from-purple-500/10 to-purple-400/5 border-purple-500/20" },
  budget_master: { icon: Award, label: "Budget Master", color: "text-blue-500", bg: "from-blue-500/10 to-blue-400/5 border-blue-500/20" },
  cashback_pro: { icon: Trophy, label: "Cashback Pro", color: "text-pink-500", bg: "from-pink-500/10 to-pink-400/5 border-pink-500/20" },
  smart_saver: { icon: Wallet, label: "Smart Saver", color: "text-emerald-500", bg: "from-emerald-500/10 to-emerald-400/5 border-emerald-500/20" },
  investment_planner: { icon: TrendingUp, label: "Investment Planner", color: "text-indigo-500", bg: "from-indigo-500/10 to-indigo-400/5 border-indigo-500/20" },
  credit_pro: { icon: Shield, label: "Credit Pro", color: "text-cyan-500", bg: "from-cyan-500/10 to-cyan-400/5 border-cyan-500/20" },
};

interface AchievementBadgeProps {
  type: BadgeType;
  show: boolean;
  message?: string;
}

const AchievementBadge = ({ type, show, message }: AchievementBadgeProps) => {
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`rounded-2xl border bg-gradient-to-br ${config.bg} p-4 flex items-center gap-3`}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center shadow-sm`}
          >
            <Icon className={`w-6 h-6 ${config.color}`} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">🏆 Achievement Unlocked</p>
            <p className={`text-sm font-heading font-bold ${config.color}`}>{config.label}</p>
            {message && <p className="text-xs text-muted-foreground mt-0.5">{message}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementBadge;
