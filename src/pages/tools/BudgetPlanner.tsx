import { useState, useMemo } from "react";
import { FileText } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import FinancialScore from "@/components/gamification/FinancialScore";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AIInsight from "@/components/gamification/AIInsight";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";
import { getBudgetInsights, INDIAN_BENCHMARKS } from "@/lib/financial-ai-engine";

const categories = [
  { label: "Housing", emoji: "🏠", default: 30, color: "hsl(221,83%,53%)" },
  { label: "Food", emoji: "🍽️", default: 15, color: "hsl(142,71%,45%)" },
  { label: "Transport", emoji: "🚗", default: 10, color: "hsl(38,92%,50%)" },
  { label: "Utilities", emoji: "💡", default: 8, color: "hsl(280,65%,60%)" },
  { label: "Healthcare", emoji: "🏥", default: 5, color: "hsl(0,84%,60%)" },
  { label: "Entertainment", emoji: "🎬", default: 7, color: "hsl(330,80%,60%)" },
  { label: "Shopping", emoji: "🛍️", default: 10, color: "hsl(200,80%,50%)" },
  { label: "Savings", emoji: "💰", default: 15, color: "hsl(160,60%,45%)" },
];

const BudgetPlanner = () => {
  const [income, setIncome] = useState(50000);
  const [allocations, setAllocations] = useState(categories.map((c) => c.default));

  const total = allocations.reduce((a, b) => a + b, 0);
  const remaining = 100 - total;
  const savingsPercent = allocations[7];

  // Enhanced budget scoring with real benchmarks
  const budgetScore = useMemo(() => {
    let score = 0;
    // Savings (40 pts): Benchmark is 20.3% (Indian avg)
    score += savingsPercent >= 30 ? 40 : savingsPercent >= 20 ? 35 : savingsPercent >= 15 ? 25 : savingsPercent * 1.5;
    // Housing within limit (25 pts): Benchmark is 28%
    const housing = allocations[0];
    score += housing <= 28 ? 25 : housing <= 35 ? 18 : housing <= 40 ? 10 : 5;
    // Budget balanced (20 pts)
    score += remaining >= 0 ? 20 : 0;
    // Healthcare allocated (15 pts)
    score += allocations[4] >= 5 ? 15 : allocations[4] >= 3 ? 10 : 5;
    return Math.min(100, Math.round(score));
  }, [allocations, savingsPercent, remaining]);

  const pieData = categories.map((cat, i) => ({ name: cat.label, value: allocations[i] })).filter(d => d.value > 0);

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  const aiInsights = useMemo(() => getBudgetInsights(income, allocations, categories.map(c => c.label)), [income, allocations]);

  // 50-30-20 analysis
  const needs = allocations[0] + allocations[3] + allocations[4]; // Housing + Utilities + Healthcare
  const wants = allocations[1] + allocations[2] + allocations[5] + allocations[6]; // Food + Transport + Entertainment + Shopping
  const saves = allocations[7] + remaining;

  return (
    <ToolLayout title="Budget Planner" description="Create a monthly spending plan using the 50-30-20 rule" icon={<FileText className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Set Income", "Allocate Budget", "Review Plan"]} current={total > 50 ? 2 : income > 10000 ? 1 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Monthly Income (₹)</span><span className="font-semibold">{fmt(income)}</span></div>
            <input type="range" min={10000} max={500000} step={5000} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className="text-lg w-6">{cat.emoji}</span>
                <span className="text-sm text-muted-foreground w-24">{cat.label}</span>
                <input type="range" min={0} max={50} step={1} value={allocations[i]} onChange={(e) => { const n = [...allocations]; n[i] = Number(e.target.value); setAllocations(n); }} className="flex-1 accent-primary" />
                <span className="text-sm font-semibold w-10 text-right">{allocations[i]}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className={`rounded-2xl border p-4 ${remaining >= 0 ? "border-border bg-card" : "border-destructive/30 bg-destructive/5"}`}>
            <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Allocated</span><span className="font-semibold">{total}%</span></div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full rounded-full transition-all ${total > 100 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min(total, 100)}%` }} />
            </div>
            {remaining < 0 && <p className="text-xs text-destructive mt-1">⚠️ Over budget by {Math.abs(remaining)}%</p>}
            {remaining > 0 && <p className="text-xs text-accent mt-1">✅ {remaining}% unallocated</p>}
          </div>

          {/* 50-30-20 Analysis */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">50-30-20 Rule Analysis</p>
            <div className="space-y-2">
              {[
                { label: "Needs", value: needs, ideal: 50, color: "bg-blue-500" },
                { label: "Wants", value: wants, ideal: 30, color: "bg-amber-500" },
                { label: "Savings", value: saves, ideal: 20, color: "bg-emerald-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.label} ({item.value}%)</span>
                    <span className={`font-semibold ${item.value <= item.ideal + 5 ? "text-accent" : "text-amber-500"}`}>Ideal: {item.ideal}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${Math.min(item.value, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={1}>
                  {pieData.map((_, i) => <Cell key={i} fill={categories[i]?.color || "hsl(var(--primary))"} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground mb-3">Monthly Breakdown</p>
            {categories.map((cat, i) => (
              <div key={cat.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{cat.emoji} {cat.label}</span>
                <span className="font-semibold">{fmt(income * allocations[i] / 100)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
              <span>Total</span>
              <span className={total > 100 ? "text-destructive" : "text-primary"}>{fmt(income * total / 100)}</span>
            </div>
          </div>
          <FinancialScore score={budgetScore} label="Budget Health" sublabel={savingsPercent >= 20 ? `Saving ${savingsPercent}% (above ${INDIAN_BENCHMARKS.avgSavingsRate}% avg)` : `Indian avg saves ${INDIAN_BENCHMARKS.avgSavingsRate}%`} />
          
          <AIInsight
            type="ai"
            title="AI Budget Strategy (Real Benchmarks)"
            message={aiInsights[0] || "Adjust allocations to see insights."}
            insights={aiInsights.slice(1)}
          />
          
          <AchievementBadge type="budget_master" show={budgetScore >= 75 && remaining >= 0} message="Your budget is well-balanced!" />
          <ResultActions title="Budget Plan" data={Object.fromEntries(categories.map((c, i) => [c.label, fmt(income * allocations[i] / 100)]))} productLink="/bank-accounts" />
        </div>
      </div>
    </ToolLayout>
  );
};

export default BudgetPlanner;
