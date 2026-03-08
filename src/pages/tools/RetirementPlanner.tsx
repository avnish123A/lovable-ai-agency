import { useState, useMemo } from "react";
import { Landmark } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import FinancialScore from "@/components/gamification/FinancialScore";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AIInsight from "@/components/gamification/AIInsight";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";

const RetirementPlanner = () => {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [monthly, setMonthly] = useState(15000);
  const [existing, setExisting] = useState(200000);
  const [returnRate, setReturnRate] = useState(12);
  const [inflation, setInflation] = useState(6);
  const [monthlyExpense, setMonthlyExpense] = useState(40000);

  const result = useMemo(() => {
    const years = retireAge - age;
    if (years <= 0) return { corpus: 0, needed: 0, gap: 0, chartData: [], readiness: 0 };

    const realReturn = (returnRate - inflation) / 100;
    const monthlyRate = returnRate / 100 / 12;

    // Future value of existing savings
    const fvExisting = existing * Math.pow(1 + returnRate / 100, years);

    // Future value of monthly SIP
    const fvSIP = monthly * ((Math.pow(1 + monthlyRate, years * 12) - 1) / monthlyRate) * (1 + monthlyRate);

    const corpus = fvExisting + fvSIP;

    // Corpus needed (25x annual expenses adjusted for inflation)
    const futureExpense = monthlyExpense * 12 * Math.pow(1 + inflation / 100, years);
    const needed = futureExpense * 25;

    const gap = needed - corpus;
    const readiness = Math.min(100, Math.round((corpus / needed) * 100));

    // Chart data
    const chartData = [];
    for (let y = 0; y <= years; y++) {
      const fvE = existing * Math.pow(1 + returnRate / 100, y);
      const fvS = monthly * ((Math.pow(1 + monthlyRate, y * 12) - 1) / monthlyRate) * (1 + monthlyRate);
      const neededAtY = monthlyExpense * 12 * Math.pow(1 + inflation / 100, y) * 25;
      chartData.push({
        year: age + y,
        corpus: Math.round(fvE + fvS),
        needed: Math.round(neededAtY),
      });
    }

    return { corpus: Math.round(corpus), needed: Math.round(needed), gap: Math.round(gap), chartData, readiness };
  }, [age, retireAge, monthly, existing, returnRate, inflation, monthlyExpense]);

  const fmt = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
    return `₹${v.toLocaleString("en-IN")}`;
  };

  return (
    <ToolLayout title="Retirement Planner" description="Plan your retirement corpus and track readiness" icon={<Landmark className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Enter Details", "View Projection", "Plan Action"]} current={result.corpus > 0 ? 2 : 1} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {[
            { label: "Current Age", value: age, set: setAge, min: 18, max: 55, step: 1, suffix: " yrs" },
            { label: "Retirement Age", value: retireAge, set: setRetireAge, min: 45, max: 70, step: 1, suffix: " yrs" },
            { label: "Monthly Investment (SIP)", value: monthly, set: setMonthly, min: 1000, max: 200000, step: 1000, fmt: true },
            { label: "Existing Savings", value: existing, set: setExisting, min: 0, max: 10000000, step: 50000, fmt: true },
            { label: "Expected Return (%)", value: returnRate, set: setReturnRate, min: 6, max: 18, step: 0.5, suffix: "%" },
            { label: "Inflation Rate (%)", value: inflation, set: setInflation, min: 3, max: 10, step: 0.5, suffix: "%" },
            { label: "Monthly Expenses (Today)", value: monthlyExpense, set: setMonthlyExpense, min: 10000, max: 300000, step: 5000, fmt: true },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-semibold">{s.fmt ? fmt(s.value) : `${s.value}${s.suffix || ""}`}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={(e) => s.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">Your Corpus</p>
              <AnimatedCounter value={result.corpus} prefix="₹" className="text-lg font-bold text-primary" />
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">Corpus Needed</p>
              <AnimatedCounter value={result.needed} prefix="₹" className="text-lg font-bold text-foreground" />
            </div>
          </div>

          <div className={`rounded-xl border p-4 text-center ${result.gap <= 0 ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950" : "border-destructive/30 bg-destructive/5"}`}>
            <p className="text-xs text-muted-foreground mb-1">{result.gap <= 0 ? "🎉 Surplus" : "⚠️ Shortfall"}</p>
            <p className={`text-xl font-bold ${result.gap <= 0 ? "text-emerald-600" : "text-destructive"}`}>{fmt(Math.abs(result.gap))}</p>
          </div>

          {result.chartData.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Corpus Growth vs Need</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={result.chartData}>
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => v >= 10000000 ? `${(v / 10000000).toFixed(0)}Cr` : `${(v / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Area type="monotone" dataKey="corpus" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
                  <Area type="monotone" dataKey="needed" stroke="hsl(0,84%,60%)" fill="hsl(0,84%,60%,0.1)" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block" /> Your Corpus</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-destructive inline-block border-dashed" /> Required</span>
              </div>
            </div>
          )}

          <FinancialScore score={result.readiness} label="Retirement Readiness" sublabel={result.readiness >= 80 ? "On track!" : "Increase SIP to close gap"} />

          <AIInsight
            type="ai"
            title="AI Retirement Tip"
            message={
              result.gap > 0
                ? `You need an additional ${fmt(Math.round(result.gap / ((retireAge - age) * 12)))} per month to meet your retirement goal. Consider increasing your SIP or exploring equity-heavy funds.`
                : `Congratulations! Your current plan exceeds the retirement target by ${fmt(Math.abs(result.gap))}. You're well-prepared!`
            }
          />

          <AchievementBadge type="investment_planner" show={result.readiness >= 80} message="Retirement ready — On track for financial freedom!" />

          <ResultActions
            title="Retirement Plan"
            data={{
              "Current Age": `${age} yrs`,
              "Retirement Age": `${retireAge} yrs`,
              "Monthly SIP": fmt(monthly),
              "Projected Corpus": fmt(result.corpus),
              "Required Corpus": fmt(result.needed),
              "Readiness": `${result.readiness}%`,
            }}
            productLink="/fixed-deposits"
          />
        </div>
      </div>
    </ToolLayout>
  );
};

export default RetirementPlanner;
