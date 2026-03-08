import { useState } from "react";
import { Star } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";

const RewardPointsCalc = () => {
  const [spend, setSpend] = useState(50000);
  const [pointsPerRupee, setPointsPerRupee] = useState(2);
  const [pointValue, setPointValue] = useState(0.25);

  const monthlyPoints = spend * pointsPerRupee;
  const monthlyValue = monthlyPoints * pointValue;
  const yearlyPoints = monthlyPoints * 12;
  const yearlyValue = monthlyValue * 12;
  const effectiveCashback = (monthlyValue / spend) * 100;

  const monthlyData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => ({
    month: m,
    points: Math.round(monthlyPoints),
    value: Math.round(monthlyValue),
  }));

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <ToolLayout title="Reward Points Calculator" description="Calculate the real value of your credit card reward points" icon={<Star className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Set Spend", "Card Details", "View Rewards"]} current={spend > 1000 ? 2 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Monthly Card Spend (₹)", value: spend, set: setSpend, min: 1000, max: 500000, step: 1000 },
            { label: "Points per ₹100 spent", value: pointsPerRupee, set: setPointsPerRupee, min: 1, max: 10, step: 1 },
            { label: "Point Value (₹ per point)", value: pointValue, set: setPointValue, min: 0.1, max: 1, step: 0.05 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-semibold">{f.label.includes("Value") ? `₹${f.value}` : f.label.includes("Points") ? `${f.value} pts` : fmt(f.value)}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}

          <div className="rounded-xl bg-secondary/50 p-4 text-xs space-y-2">
            <p className="font-semibold text-foreground">📊 Point Value Guide</p>
            <div className="space-y-1 text-muted-foreground">
              <p>• HDFC Infinia: ~₹0.50/point</p>
              <p>• HDFC Regalia: ~₹0.30/point</p>
              <p>• Axis Magnus: ~₹0.40/point</p>
              <p>• SBI SimplyCLICK: ~₹0.25/point</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Monthly Points", value: monthlyPoints, prefix: "", suffix: " pts", cls: "text-primary" },
              { label: "Monthly Value", value: Math.round(monthlyValue), prefix: "₹", suffix: "", cls: "text-accent" },
              { label: "Yearly Points", value: yearlyPoints, prefix: "", suffix: " pts", cls: "text-primary" },
              { label: "Yearly Value", value: Math.round(yearlyValue), prefix: "₹", suffix: "", cls: "text-accent" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-card p-5 text-center">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <AnimatedCounter value={item.value} prefix={item.prefix} className={`text-xl font-bold ${item.cls}`} />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Monthly Reward Value</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 9 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">Effective Cashback Rate</p>
            <p className="text-2xl font-bold text-primary">{effectiveCashback.toFixed(2)}%</p>
          </div>

          <AIInsight type="ai" title="AI Rewards Tip" message={effectiveCashback >= 1 ? `${effectiveCashback.toFixed(1)}% effective return is excellent! You're earning ${fmt(yearlyValue)} yearly — that's a free gadget!` : `Your effective return is ${effectiveCashback.toFixed(1)}%. Consider cards with higher point value or bonus categories.`} />
          <AchievementBadge type="cashback_pro" show={yearlyValue >= 6000} message={`${fmt(yearlyValue)} yearly in rewards — great returns!`} />
          <ResultActions title="Reward Points Analysis" data={{ "Spend": fmt(spend), "Points/₹100": `${pointsPerRupee}`, "Value/Point": `₹${pointValue}`, "Monthly Value": fmt(monthlyValue), "Yearly Value": fmt(yearlyValue), "Effective Rate": `${effectiveCashback.toFixed(2)}%` }} productLink="/credit-cards" />
        </div>
      </div>
    </ToolLayout>
  );
};

export default RewardPointsCalc;
