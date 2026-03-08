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
import EditableSliderInput from "@/components/gamification/EditableSliderInput";
import { getInvestmentInsights, INDIAN_BENCHMARKS } from "@/lib/financial-ai-engine";

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
  const xirr = totalInvested > 0 ? ((Math.pow(totalValue / totalInvested, 1 / years) - 1) * 100) : 0;

  const realReturn = rate - INDIAN_BENCHMARKS.avgInflation;
  const realValue = totalValue / Math.pow(1 + INDIAN_BENCHMARKS.avgInflation / 100, years);

  const growthScore = useMemo(() => Math.min(100, Math.round(multiplier * 25)), [multiplier]);

  const chartData = useMemo(() => Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const m = y * 12;
    const ls = initial * Math.pow(1 + r, m);
    const sv = r > 0 ? monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r) : monthly * m;
    return { year: `Y${y}`, value: Math.round(ls + sv), invested: initial + monthly * m };
  }), [initial, monthly, r, years]);

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  const aiInsights = useMemo(() => getInvestmentInsights(initial, monthly, rate, years, totalValue, returns), [initial, monthly, rate, years, totalValue, returns]);

  return (
    <ToolLayout title="Investment Return Calculator" description="Estimate returns with real market benchmarks and inflation adjustment" icon={<LineChartIcon className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Investment Setup", "View Returns", "Plan Strategy"]} current={totalInvested > 0 ? 2 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <EditableSliderInput label="Initial Investment" value={initial} onChange={setInitial} min={0} max={10000000} step={10000} prefix="₹" />
          <EditableSliderInput label="Monthly SIP" value={monthly} onChange={setMonthly} min={0} max={200000} step={500} prefix="₹" />
          <EditableSliderInput label={`Expected Return (Nifty 10yr: ${INDIAN_BENCHMARKS.sipReturns.nifty50_10yr}%)`} value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
          <EditableSliderInput label="Time Period" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" yrs" />

          <div className="rounded-xl bg-secondary/50 p-4 text-xs space-y-1">
            <p className="font-semibold text-foreground mb-2">📊 Benchmark Returns (10-Year CAGR)</p>
            {[
              { name: "Nifty 50", ret: INDIAN_BENCHMARKS.sipReturns.nifty50_10yr },
              { name: "Midcap Index", ret: INDIAN_BENCHMARKS.sipReturns.midcap_10yr },
              { name: "Debt Funds", ret: INDIAN_BENCHMARKS.sipReturns.debt_10yr },
              { name: "PPF", ret: INDIAN_BENCHMARKS.ppfRate },
              { name: "Gold (SGBs)", ret: INDIAN_BENCHMARKS.goldReturn10yr },
            ].map((b) => (
              <div key={b.name} className="flex justify-between text-muted-foreground">
                <span>{b.name}</span>
                <span className={`font-semibold ${b.ret >= rate ? "text-accent" : ""}`}>{b.ret}%</span>
              </div>
            ))}
          </div>

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

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">Inflation-Adjusted Value (Real Worth)</p>
            <p className="text-xl font-bold text-amber-600">{fmt(realValue)}</p>
            <p className="text-[10px] text-muted-foreground">At {INDIAN_BENCHMARKS.avgInflation}% inflation, real return: {realReturn.toFixed(1)}%</p>
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

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
              <p className="text-xs text-muted-foreground">Growth Multiplier</p>
              <p className="text-2xl font-bold text-accent">{multiplier.toFixed(2)}x</p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-xs text-muted-foreground">Effective CAGR</p>
              <p className="text-2xl font-bold text-primary">{xirr.toFixed(1)}%</p>
            </div>
          </div>

          <FinancialScore score={growthScore} label="Investment Score" sublabel={multiplier >= 3 ? "Excellent growth potential!" : "Consider longer horizon"} />
          
          <AIInsight
            type="ai"
            title="AI Investment Strategy (Real Benchmarks)"
            message={aiInsights[0] || "Adjust values to see investment insights."}
            insights={aiInsights.slice(1)}
          />
          
          <AchievementBadge type="savvy_saver" show={growthScore >= 60} message="Smart investment strategy!" />
          <ResultActions title="Investment Plan" data={{ "Lump Sum": fmt(initial), "SIP": fmt(monthly), "Rate": `${rate}%`, "Years": `${years}`, "Total Value": fmt(totalValue), "Real Value": fmt(realValue), "Returns": fmt(returns), "Multiplier": `${multiplier.toFixed(2)}x` }} productLink="/demat-accounts" />
        </div>
      </div>
    </ToolLayout>
  );
};

export default InvestmentReturnCalc;
