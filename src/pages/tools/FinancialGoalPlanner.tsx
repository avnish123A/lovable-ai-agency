import { useState } from "react";
import { Target } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const FinancialGoalPlanner = () => {
  const [goal, setGoal] = useState(1000000);
  const [current, setCurrent] = useState(100000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(10);

  const remaining = goal - current;
  const r = rate / 100 / 12;
  const n = years * 12;
  const currentGrowth = current * Math.pow(1 + r, n);
  const gap = goal - currentGrowth;
  const monthlyNeeded = gap > 0 ? gap / ((Math.pow(1 + r, n) - 1) / r * (1 + r)) : 0;
  const progress = Math.min(100, (current / goal) * 100);

  return (
    <ToolLayout title="Financial Goal Planner" description="Plan how much to save monthly to reach your goal" icon={<Target className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Goal Amount (₹)", value: goal, set: setGoal, min: 10000, max: 100000000, step: 10000 },
            { label: "Current Savings (₹)", value: current, set: setCurrent, min: 0, max: goal, step: 5000 },
            { label: "Target Years", value: years, set: setYears, min: 1, max: 30, step: 1 },
            { label: "Expected Return (%)", value: rate, set: setRate, min: 1, max: 20, step: 0.5 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{f.label}</span><span className="font-semibold">{f.label.includes("Return") ? `${f.value}%` : f.label.includes("Year") ? `${f.value} yrs` : `₹${f.value.toLocaleString("en-IN")}`}</span></div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Monthly Investment Needed</p>
            <p className="text-3xl font-bold text-primary">₹{Math.max(0, Math.round(monthlyNeeded)).toLocaleString("en-IN")}</p>
            {monthlyNeeded <= 0 && <p className="text-xs text-accent mt-1">🎉 Your current savings will grow beyond your goal!</p>}
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-2">Goal Progress</p>
            <div className="h-4 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(1)}% achieved</p>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Gap to Goal</span><span className="font-semibold">₹{remaining.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Current savings will grow to</span><span className="font-semibold text-accent">₹{Math.round(currentGrowth).toLocaleString("en-IN")}</span></div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default FinancialGoalPlanner;
