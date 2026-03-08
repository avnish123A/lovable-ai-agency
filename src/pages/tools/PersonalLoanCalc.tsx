import { useState, useMemo } from "react";
import { Wallet } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import FinancialScore from "@/components/gamification/FinancialScore";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import WhatIfSlider from "@/components/gamification/WhatIfSlider";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";

const PersonalLoanCalc = () => {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);

  const r = rate / 100 / 12;
  const n = years * 12;
  const emi = r === 0 ? amount / n : amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - amount;

  const score = useMemo(() => {
    const ratio = interest / amount;
    if (ratio < 0.15) return 95;
    if (ratio < 0.3) return 75;
    if (ratio < 0.5) return 55;
    return 30;
  }, [interest, amount]);

  const pieData = [
    { name: "Principal", value: Math.round(amount) },
    { name: "Interest", value: Math.round(interest) },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))"];

  const yearlyData = useMemo(() => Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const m = y * 12;
    let principalPaid = 0, interestPaid = 0, bal = amount;
    for (let j = 0; j < m; j++) {
      const intPart = bal * r;
      principalPaid = amount - (bal - (emi - intPart));
      interestPaid += intPart;
      bal -= (emi - intPart);
    }
    return { year: `Y${y}`, principal: Math.round(principalPaid), interest: Math.round(interestPaid) };
  }), [amount, rate, years, emi, r]);

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <ToolLayout title="Personal Loan Calculator" description="Estimate your personal loan EMI and total cost" icon={<Wallet className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Enter Details", "View EMI", "Compare Options"]} current={amount > 10000 ? 2 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Loan Amount (₹)", value: amount, set: setAmount, min: 10000, max: 5000000, step: 10000 },
            { label: "Interest Rate (%)", value: rate, set: setRate, min: 8, max: 30, step: 0.5 },
            { label: "Tenure (Years)", value: years, set: setYears, min: 1, max: 7, step: 1 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-semibold">{f.label.includes("Rate") ? `${f.value}%` : f.label.includes("Year") ? `${f.value} yrs` : fmt(f.value)}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
          <WhatIfSlider label="What if rate changes?" baseValue={rate} min={8} max={30} step={0.5}
            format={(v) => `${v}%`}
            onResult={(delta) => {
              if (delta === 0) return "";
              const newR = (rate + delta) / 100 / 12;
              const newEmi = amount * newR * Math.pow(1 + newR, n) / (Math.pow(1 + newR, n) - 1);
              const diff = emi - newEmi;
              return diff > 0 ? `EMI saves ${fmt(diff)}/month` : `EMI increases ${fmt(Math.abs(diff))}/month`;
            }}
          />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Monthly EMI", value: emi, highlight: true },
              { label: "Total Interest", value: interest },
              { label: "Total Payment", value: total },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl p-4 text-center ${item.highlight ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                <p className="text-[11px] text-muted-foreground mb-1">{item.label}</p>
                <AnimatedCounter value={Math.round(item.value)} prefix="₹" className={`text-lg font-heading font-bold ${item.highlight ? "text-primary" : "text-foreground"}`} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Payment Split</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Yearly Progress</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={yearlyData}>
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis hide />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="principal" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interest" fill="hsl(var(--destructive) / 0.5)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <FinancialScore score={score} label="Loan Affordability" sublabel={rate <= 12 ? "Competitive rate!" : "Shop for lower rates"} />
          <AIInsight type="ai" title="AI Loan Advice" message={rate >= 18 ? `At ${rate}%, you're paying high interest. A credit score above 750 can help you get rates under 12%.` : `${fmt(emi)} monthly EMI is ${emi < 15000 ? "very manageable" : "moderate"}. Keep loan EMIs under 40% of monthly income.`} />
          <AchievementBadge type="smart_planner" show={score >= 70} message="Good loan planning!" />
          <ResultActions title="Personal Loan Plan" data={{ "Amount": fmt(amount), "Rate": `${rate}%`, "Tenure": `${years} yrs`, "EMI": fmt(emi), "Interest": fmt(interest), "Total": fmt(total) }} productLink="/loans" />
        </div>
      </div>
    </ToolLayout>
  );
};

export default PersonalLoanCalc;
