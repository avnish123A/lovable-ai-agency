import { useState, useMemo } from "react";
import { Building } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import FinancialScore from "@/components/gamification/FinancialScore";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import WhatIfSlider from "@/components/gamification/WhatIfSlider";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";

const HomeLoanCalc = () => {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [downPayment, setDownPayment] = useState(1000000);

  const loanAmount = amount - downPayment;
  const r = rate / 100 / 12;
  const n = years * 12;
  const emi = r === 0 ? loanAmount / n : loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmount;
  const downPaymentPercent = (downPayment / amount) * 100;

  const affordabilityScore = useMemo(() => {
    const interestRatio = totalInterest / loanAmount;
    if (interestRatio < 0.3) return 95;
    if (interestRatio < 0.5) return 80;
    if (interestRatio < 0.8) return 60;
    if (interestRatio < 1.2) return 40;
    return 20;
  }, [totalInterest, loanAmount]);

  const pieData = [
    { name: "Principal", value: Math.round(loanAmount) },
    { name: "Interest", value: Math.round(totalInterest) },
    { name: "Down Payment", value: Math.round(downPayment) },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))", "hsl(var(--accent))"];

  const chartData = useMemo(() => Array.from({ length: Math.min(years, 30) }, (_, i) => {
    const y = i + 1;
    const months = y * 12;
    const remaining = loanAmount * (Math.pow(1 + r, n) - Math.pow(1 + r, months)) / (Math.pow(1 + r, n) - 1);
    return { year: `Y${y}`, principal: Math.round(loanAmount - remaining), interest: Math.round(emi * months - (loanAmount - remaining)) };
  }), [loanAmount, r, n, years, emi]);

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <ToolLayout title="Home Loan Calculator" description="Plan your dream home purchase with detailed EMI breakdown" icon={<Building className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Property Details", "View EMI", "Get Insights"]} current={loanAmount > 0 ? 2 : 1} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Property Value (₹)", value: amount, set: setAmount, min: 500000, max: 50000000, step: 100000 },
            { label: "Down Payment (₹)", value: downPayment, set: setDownPayment, min: 0, max: amount * 0.8, step: 50000 },
            { label: "Interest Rate (%)", value: rate, set: setRate, min: 5, max: 15, step: 0.1 },
            { label: "Loan Tenure (Years)", value: years, set: setYears, min: 5, max: 30, step: 1 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-semibold text-foreground">{f.label.includes("Rate") ? `${f.value}%` : f.label.includes("Year") ? `${f.value} yrs` : fmt(f.value)}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
          <WhatIfSlider
            label="What if you increase down payment?"
            baseValue={downPayment}
            min={0} max={amount * 0.8} step={50000}
            onResult={(delta) => {
              if (delta === 0) return "";
              const newLoan = amount - (downPayment + delta);
              const newEmi = newLoan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
              const diff = emi - newEmi;
              return diff > 0 ? `EMI reduces by ${fmt(diff)}/month` : `EMI increases by ${fmt(Math.abs(diff))}/month`;
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Monthly EMI", value: emi, highlight: true },
              { label: "Total Interest", value: totalInterest },
              { label: "Total Cost", value: totalPayment + downPayment },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl p-4 text-center ${item.highlight ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                <p className="text-[11px] text-muted-foreground mb-1">{item.label}</p>
                <AnimatedCounter value={Math.round(item.value)} prefix="₹" className={`text-lg font-heading font-bold ${item.highlight ? "text-primary" : "text-foreground"}`} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Cost Breakdown</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-3 text-[10px] mt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />Principal</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" />Interest</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />Down</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Year-wise Breakdown</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData.filter((_, i) => i % Math.ceil(years / 8) === 0)}>
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis hide />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="principal" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interest" fill="hsl(var(--destructive) / 0.5)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <FinancialScore score={affordabilityScore} label="Home Loan Score" sublabel={downPaymentPercent >= 20 ? `Great ${Math.round(downPaymentPercent)}% down payment!` : "Try 20%+ down payment"} />
          
          <AIInsight type="ai" title="AI Home Loan Tip" message={downPaymentPercent < 20 ? `Your down payment is ${Math.round(downPaymentPercent)}%. Banks prefer 20%+ for better rates and no PMI charges.` : `${fmt(emi)} EMI for ${years} years. ${rate <= 8.5 ? "Great interest rate!" : "Consider balance transfer if you find rates below 8.5%."}`} />
          <AIInsight type="tip" title="Pro Tip" delay={0.2} message={`Making one extra EMI payment per year can save you ${fmt(totalInterest * 0.12)} in interest and reduce tenure by ~${Math.round(years * 0.08)} years!`} />

          <AchievementBadge type="smart_planner" show={affordabilityScore >= 75} message="Smart home buying decision!" />
          <ResultActions title="Home Loan Plan" data={{ "Property": fmt(amount), "Down Payment": fmt(downPayment), "Loan": fmt(loanAmount), "Rate": `${rate}%`, "Tenure": `${years} yrs`, "EMI": fmt(emi), "Total Interest": fmt(totalInterest) }} productLink="/loans" />
        </div>
      </div>
    </ToolLayout>
  );
};

export default HomeLoanCalc;
