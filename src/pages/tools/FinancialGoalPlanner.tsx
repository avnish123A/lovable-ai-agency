import { useState, useRef } from "react";
import { Target } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import FinancialScore from "@/components/gamification/FinancialScore";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import WhatIfSlider from "@/components/gamification/WhatIfSlider";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";
import EditableSliderInput from "@/components/gamification/EditableSliderInput";

const FinancialGoalPlanner = () => {
  const resultRef = useRef<HTMLDivElement>(null);
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
  const goalScore = monthlyNeeded <= 0 ? 100 : Math.max(10, Math.round(100 - (monthlyNeeded / (goal / n) * 50)));

  const projectionData = Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const m = y * 12;
    const growth = current * Math.pow(1 + r, m);
    const sipGrowth = monthlyNeeded > 0 ? monthlyNeeded * ((Math.pow(1 + r, m) - 1) / r) * (1 + r) : 0;
    return { year: `Y${y}`, projected: Math.round(growth + sipGrowth), goal: goal };
  });

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <ToolLayout title="Financial Goal Planner" description="Plan how much to save monthly to reach your goal" icon={<Target className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Set Goal", "Current Savings", "Monthly Plan"]} current={current > 0 ? 2 : goal > 10000 ? 1 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <EditableSliderInput label="Goal Amount" value={goal} onChange={setGoal} min={10000} max={100000000} step={10000} prefix="₹" />
          <EditableSliderInput label="Current Savings" value={current} onChange={setCurrent} min={0} max={goal} step={5000} prefix="₹" />
          <EditableSliderInput label="Target Years" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" yrs" />
          <EditableSliderInput label="Expected Return" value={rate} onChange={setRate} min={1} max={20} step={0.5} suffix="%" />
          <WhatIfSlider label="What if return rate changes?" baseValue={rate} min={1} max={20} step={0.5}
            format={(v) => `${v}%`}
            onResult={(delta) => {
              const newR = (rate + delta) / 100 / 12;
              const newGrowth = current * Math.pow(1 + newR, n);
              const newGap = goal - newGrowth;
              const newMonthly = newGap > 0 ? newGap / ((Math.pow(1 + newR, n) - 1) / newR * (1 + newR)) : 0;
              const diff = monthlyNeeded - newMonthly;
              return diff > 0 ? `Monthly savings reduces by ${fmt(diff)}` : `Need ${fmt(Math.abs(diff))} more monthly`;
            }}
          />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Monthly Investment Needed</p>
            <AnimatedCounter value={Math.max(0, Math.round(monthlyNeeded))} prefix="₹" className="text-3xl font-bold text-primary" />
            {monthlyNeeded <= 0 && <p className="text-xs text-accent mt-1">🎉 Your savings will exceed the goal!</p>}
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-2">Goal Progress</p>
            <div className="h-4 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(1)}% achieved</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Projection</p>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={projectionData}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="projected" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Area type="monotone" dataKey="goal" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Gap to Goal</span><span className="font-semibold">{fmt(remaining)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Current will grow to</span><span className="font-semibold text-accent">{fmt(currentGrowth)}</span></div>
          </div>
          <FinancialScore score={goalScore} label="Goal Feasibility" sublabel={monthlyNeeded <= 0 ? "Already on track!" : `${fmt(monthlyNeeded)}/mo needed`} />
          <AIInsight type="ai" title="AI Goal Strategy" message={monthlyNeeded <= 0 ? "Congratulations! Your existing savings will grow beyond your goal. Consider setting a higher target." : `Save ${fmt(monthlyNeeded)} monthly for ${years} years at ${rate}% return to reach ${fmt(goal)}. SIP in mutual funds can help achieve this.`} />
          <AchievementBadge type="goal_setter" show={goalScore >= 60} message="Your financial goal is achievable!" />
          <ResultActions title="Goal Plan" data={{ "Goal": fmt(goal), "Current": fmt(current), "Monthly": fmt(monthlyNeeded), "Years": `${years}`, "Return": `${rate}%` }} productLink="/fixed-deposits" captureRef={resultRef} />
        </div>
      </div>
    </ToolLayout>
  );
};

export default FinancialGoalPlanner;
