import { useState, useMemo } from "react";
import { LineChart as LineChartIcon } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import FinancialScore from "@/components/gamification/FinancialScore";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import WhatIfSlider from "@/components/gamification/WhatIfSlider";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";

const InvestmentReturnCalc = () => {
  const [initial, setInitial] = useState(100000);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const r = rate / 100 / 12;
  const n = years * 12;
  const lumpSum = initial * Math.pow(1 + r, n);
  const sipValue = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : monthly * n;
  const totalValue = lumpSum + sipValue;
  const totalInvested = initial + monthly * n;
  const returns = totalValue - totalInvested;
  const multiplier = totalInvested > 0 ? totalValue / totalInvested : 0;

  const growthScore = useMemo(() => Math.min(100, Math.round(multiplier * 25)), [multiplier]);

  const chartData = useMemo(() => Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const m = y * 12;
    const ls = initial * Math.pow(1 + r, m);
    const sv = r > 0 ? monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r) : monthly * m;
    return { year: `Y${y}`, value: Math.round(ls + sv), invested: initial + monthly * m };
  }), [initial, monthly, r, years]);

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <ToolLayout title="Investment Return Calculator" description="Estimate returns on lump sum + SIP investments" icon={<LineChartIcon className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Investment Setup", "View Returns", "Plan Strategy"]} current={totalInvested > 0 ? 2 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Initial Investment (₹)", value: initial, set: setInitial, min: 0, max: 10000000, step: 10000 },
            { label: "Monthly SIP (₹)", value: monthly, set: setMonthly, min: 0, max: 200000, step: 500 },
            { label: "Expected Return (%)", value: rate, set: setRate, min: 1, max: 30, step: 0.5 },
            { label: "Time Period (Years)", value: years, set: setYears, min: 1, max: 30, step: 1 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{f.label}</span><span className="font-semibold">{f.label.includes("Return") ? `${f.value}%` : f.label.includes("Year") ? `${f.value} yrs` : fmt(f.value)}</span></div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
          <WhatIfSlider label="What if SIP amount changes?" baseValue={monthly} min={0} max={200000} step={500}
            onResult={(delta) => {
              if (delta === 0) return "";
              const newSIP = r > 0 ? (monthly + delta) * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : (monthly + delta) * n;
              const newTotal = lumpSum + newSIP;
              const diff = newTotal - totalValue;
              return diff > 0 ? `Portfolio grows by ${fmt(diff)} more!` : `Portfolio reduces by ${fmt(Math.abs(diff))}`;
            }}
          />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Value", value: totalValue, highlight: true },
              { label: "Invested", value: totalInvested },
              { label: "Returns", value: returns },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl p-4 text-center ${item.highlight ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                <p className="text-[11px] text-muted-foreground mb-1">{item.label}</p>
                <AnimatedCounter value={Math.round(item.value)} prefix="₹" className={`text-lg font-heading font-bold ${item.highlight ? "text-primary" : "text-foreground"}`} />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Investment Growth</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="invested" fill="hsl(var(--muted) / 0.3)" stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
                <Area type="monotone" dataKey="value" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-[10px] mt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground" />Invested</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />Value</span>
            </div>
          </div>

          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">Growth Multiplier</p>
            <p className="text-2xl font-bold text-accent">{multiplier.toFixed(2)}x</p>
            <p className="text-xs text-muted-foreground">your investment</p>
          </div>

          <FinancialScore score={growthScore} label="Investment Score" sublabel={multiplier >= 3 ? "Excellent growth potential!" : "Consider longer horizon"} />
          <AIInsight type="ai" title="AI Investment Insight" message={years >= 10 && rate >= 12 ? `${multiplier.toFixed(1)}x growth in ${years} years! SIP of ${fmt(monthly)} monthly compounds powerfully over time.` : years < 5 ? "For serious wealth building, consider 10+ year horizon. Compounding accelerates after year 7." : `Good plan! ${fmt(monthly)} SIP at ${rate}% will build ${fmt(totalValue)} corpus.`} />
          <AchievementBadge type="savvy_saver" show={growthScore >= 60} message="Smart investment strategy!" />
          <ResultActions title="Investment Plan" data={{ "Lump Sum": fmt(initial), "SIP": fmt(monthly), "Rate": `${rate}%`, "Years": `${years}`, "Total Value": fmt(totalValue), "Returns": fmt(returns), "Multiplier": `${multiplier.toFixed(2)}x` }} productLink="/demat-accounts" />
        </div>
      </div>
    </ToolLayout>
  );
};

export default InvestmentReturnCalc;
