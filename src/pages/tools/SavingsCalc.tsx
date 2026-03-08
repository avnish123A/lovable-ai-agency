import { useState, useMemo } from "react";
import { PiggyBank } from "lucide-react";
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
import { getSavingsInsights, INDIAN_BENCHMARKS } from "@/lib/financial-ai-engine";

const SavingsCalc = () => {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const r = rate / 100 / 12;
  const n = years * 12;
  const futureValue = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const totalDeposited = monthly * n;
  const interestEarned = futureValue - totalDeposited;
  const growthMultiplier = futureValue / totalDeposited;
  const realReturn = rate - INDIAN_BENCHMARKS.avgInflation;
  const realValue = futureValue / Math.pow(1 + INDIAN_BENCHMARKS.avgInflation / 100, years);
  const score = Math.min(100, Math.round(growthMultiplier * 30));

  const chartData = Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const m = y * 12;
    const fv = monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
    return { year: `Y${y}`, savings: Math.round(fv), deposited: monthly * m };
  });

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  const aiInsights = useMemo(() => getSavingsInsights(monthly, rate, years, futureValue, interestEarned), [monthly, rate, years, futureValue, interestEarned]);

  return (
    <ToolLayout title="Savings Calculator" description="Plan your savings with real product rate comparisons" icon={<PiggyBank className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Set Savings", "View Growth", "Plan More"]} current={monthly > 500 ? (years > 1 ? 2 : 1) : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <EditableSliderInput label="Monthly Savings" value={monthly} onChange={setMonthly} min={500} max={500000} step={500} prefix="₹" />
          <EditableSliderInput label={`Expected Return (PPF: ${INDIAN_BENCHMARKS.ppfRate}%)`} value={rate} onChange={setRate} min={1} max={20} step={0.5} suffix="%" />
          <EditableSliderInput label="Time Period" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" yrs" />

          <div className="rounded-xl bg-secondary/50 p-4 text-xs space-y-1">
            <p className="font-semibold text-foreground mb-2">📊 Where to Save (Current Rates)</p>
            {[
              { name: "PPF (15yr lock-in)", ret: INDIAN_BENCHMARKS.ppfRate, tax: "Tax-free" },
              { name: "EPF", ret: INDIAN_BENCHMARKS.epfRate, tax: "Tax-free" },
              { name: "Sukanya Samriddhi", ret: INDIAN_BENCHMARKS.sukanyaRate, tax: "Tax-free" },
              { name: "Small Finance FD", ret: INDIAN_BENCHMARKS.fdRates.smallFinance, tax: "Taxable" },
              { name: "PSU Bank FD", ret: INDIAN_BENCHMARKS.fdRates.psu, tax: "Taxable" },
            ].map((p) => (
              <div key={p.name} className="flex justify-between text-muted-foreground">
                <span>{p.name}</span>
                <span><span className={`font-semibold ${p.ret >= rate ? "text-accent" : ""}`}>{p.ret}%</span> <span className="text-[9px]">({p.tax})</span></span>
              </div>
            ))}
          </div>

          <WhatIfSlider label="What if you save more?" baseValue={monthly} min={500} max={500000} step={500}
            onResult={(delta) => {
              const newFV = (monthly + delta) * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
              const diff = newFV - futureValue;
              return diff > 0 ? `You'd earn ${fmt(diff)} more!` : `You'd earn ${fmt(Math.abs(diff))} less`;
            }}
          />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Savings</p>
            <AnimatedCounter value={Math.round(futureValue)} prefix="₹" className="text-3xl font-bold text-primary" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><p className="text-xs text-muted-foreground">Deposited</p><p className="text-sm font-semibold">{fmt(totalDeposited)}</p></div>
              <div><p className="text-xs text-muted-foreground">Interest</p><p className="text-sm font-semibold text-accent">{fmt(interestEarned)}</p></div>
            </div>
          </div>

          <div className={`rounded-xl border p-3 text-center ${realReturn > 2 ? "border-accent/20 bg-accent/5" : "border-amber-500/20 bg-amber-500/5"}`}>
            <p className="text-[10px] text-muted-foreground">Real Value (After {INDIAN_BENCHMARKS.avgInflation}% Inflation)</p>
            <p className={`text-lg font-bold ${realReturn > 2 ? "text-accent" : "text-amber-600"}`}>{fmt(realValue)}</p>
            <p className="text-[10px] text-muted-foreground">Real return: {realReturn.toFixed(1)}%</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="deposited" fill="hsl(221,83%,53%,0.1)" stroke="hsl(221,83%,53%)" strokeWidth={2} />
                <Area type="monotone" dataKey="savings" fill="hsl(142,71%,45%,0.1)" stroke="hsl(142,71%,45%)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <FinancialScore score={score} label="Growth Score" sublabel={`${growthMultiplier.toFixed(1)}x your deposits`} />
          
          <AIInsight
            type="ai"
            title="AI Savings Strategy (Real Rates)"
            message={aiInsights[0] || "Adjust values to see savings insights."}
            insights={aiInsights.slice(1)}
          />
          
          <AchievementBadge type="savvy_saver" show={score >= 70} message="Your savings plan will multiply your wealth!" />
          <ResultActions title="Savings Calculation" data={{ "Monthly": fmt(monthly), "Rate": `${rate}%`, "Years": `${years}`, "Total": fmt(futureValue), "Real Value": fmt(realValue), "Interest": fmt(interestEarned) }} productLink="/fixed-deposits" />
        </div>
      </div>
    </ToolLayout>
  );
};

export default SavingsCalc;
