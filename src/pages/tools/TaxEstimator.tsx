import { useState, useMemo, useRef } from "react";
import { Landmark } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";
import EditableSliderInput from "@/components/gamification/EditableSliderInput";
import { getTaxInsights, INDIAN_BENCHMARKS } from "@/lib/financial-ai-engine";

const newSlabs = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400001, max: 800000, rate: 5 },
  { min: 800001, max: 1200000, rate: 10 },
  { min: 1200001, max: 1600000, rate: 15 },
  { min: 1600001, max: 2000000, rate: 20 },
  { min: 2000001, max: 2400000, rate: 25 },
  { min: 2400001, max: Infinity, rate: 30 },
];

const oldSlabs = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: Infinity, rate: 30 },
];

function calcTax(taxable: number, slabs: typeof newSlabs) {
  let t = 0;
  const breakdown: { slab: string; tax: number; rate: number }[] = [];
  for (const slab of slabs) {
    if (taxable > slab.min) {
      const taxableInSlab = Math.min(taxable, slab.max) - slab.min;
      const slabTax = taxableInSlab * slab.rate / 100;
      t += slabTax;
      if (slabTax > 0) {
        breakdown.push({
          slab: slab.max === Infinity ? `Above ₹${(slab.min - 1).toLocaleString("en-IN")}` : `₹${slab.min.toLocaleString("en-IN")} - ₹${slab.max.toLocaleString("en-IN")}`,
          tax: Math.round(slabTax),
          rate: slab.rate,
        });
      }
    }
  }
  return { tax: t, breakdown };
}

const TaxEstimator = () => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [income, setIncome] = useState(1200000);
  const [deductions, setDeductions] = useState(150000);
  const [regime, setRegime] = useState<"new" | "old">("new");
  const standardDeduction = INDIAN_BENCHMARKS.standardDeduction;

  const taxableNew = Math.max(0, income - standardDeduction);
  const taxableOld = Math.max(0, income - 50000 - deductions);
  const taxable = regime === "new" ? taxableNew : taxableOld;
  const slabs = regime === "new" ? newSlabs : oldSlabs;

  const { tax, slabBreakdown } = useMemo(() => {
    const result = calcTax(taxable, slabs);
    if (regime === "new" && taxable <= 700000) {
      const rebate = Math.min(result.tax, 25000);
      return { tax: Math.max(0, result.tax - rebate), slabBreakdown: result.breakdown };
    }
    if (regime === "old" && taxable <= 500000) {
      const rebate = Math.min(result.tax, 12500);
      return { tax: Math.max(0, result.tax - rebate), slabBreakdown: result.breakdown };
    }
    return { tax: result.tax, slabBreakdown: result.breakdown };
  }, [taxable, regime, slabs]);

  const cess = tax * 0.04;
  const surcharge = income > 5000000 ? tax * 0.10 : income > 10000000 ? tax * 0.15 : 0;
  const totalTax = tax + cess + surcharge;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
  const monthlyTax = totalTax / 12;
  const takeHome = income - totalTax;

  const { tax: altTax } = calcTax(regime === "new" ? taxableOld : taxableNew, regime === "new" ? oldSlabs : newSlabs);
  const altCess = altTax * 0.04;
  const altTotal = altTax + altCess;
  const regimeSavings = altTotal - totalTax;

  const pieData = [
    { name: "Take Home", value: Math.round(takeHome) },
    { name: "Tax", value: Math.round(totalTax) },
  ];
  const COLORS = ["hsl(var(--accent))", "hsl(var(--destructive))"];

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  const aiInsights = useMemo(() => getTaxInsights(income, regime, deductions, totalTax, effectiveRate), [income, regime, deductions, totalTax, effectiveRate]);

  return (
    <ToolLayout title="Income Tax Estimator" description="Estimate your tax under New and Old regime (FY 2026-27, Budget 2026 slabs)" icon={<Landmark className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Choose Regime", "Enter Income", "View Tax"]} current={income > 0 ? 2 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="flex gap-2 mb-2">
            {(["new", "old"] as const).map((r) => (
              <button key={r} onClick={() => setRegime(r)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${regime === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {r === "new" ? "New Regime (Default)" : "Old Regime"}
              </button>
            ))}
          </div>
          <EditableSliderInput label="Annual Income" value={income} onChange={setIncome} min={0} max={10000000} step={50000} prefix="₹" />
          {regime === "old" && (
            <EditableSliderInput label="Deductions (80C, 80D, HRA etc.)" value={deductions} onChange={setDeductions} min={0} max={500000} step={10000} prefix="₹" />
          )}

          <div className={`rounded-xl border p-4 ${regimeSavings > 0 ? "border-accent/30 bg-accent/5" : regimeSavings < 0 ? "border-amber-500/30 bg-amber-500/5" : "border-border bg-secondary/50"}`}>
            <p className="text-xs font-semibold text-foreground mb-1">📊 Regime Comparison</p>
            <p className="text-xs text-muted-foreground">
              {regimeSavings > 0
                ? `✅ ${regime === "new" ? "New" : "Old"} Regime saves you ${fmt(Math.abs(regimeSavings))} more than ${regime === "new" ? "Old" : "New"} Regime.`
                : regimeSavings < 0
                ? `⚠️ ${regime === "new" ? "Old" : "New"} Regime would save you ${fmt(Math.abs(regimeSavings))} more. Consider switching.`
                : "Both regimes result in the same tax."}
            </p>
          </div>

          <div className="rounded-xl bg-secondary/50 p-4 text-xs space-y-1">
            <p className="font-semibold text-foreground mb-2">Tax Slabs ({regime === "new" ? "New" : "Old"} Regime FY 2026-27)</p>
            {slabs.map((s) => (
              <div key={s.min} className="flex justify-between text-muted-foreground">
                <span>{s.max === Infinity ? `Above ₹${(s.min - 1).toLocaleString("en-IN")}` : `₹${s.min.toLocaleString("en-IN")} - ₹${s.max.toLocaleString("en-IN")}`}</span>
                <span className="font-semibold">{s.rate}%</span>
              </div>
            ))}
            <p className="text-muted-foreground/60 mt-2">
              {regime === "new" ? `Standard Deduction: ₹${standardDeduction.toLocaleString("en-IN")} • 87A Rebate up to ₹7L taxable` : "Standard Deduction: ₹50,000 • 87A Rebate up to ₹5L taxable"}
            </p>
          </div>
        </div>
        <div ref={resultRef} data-result-capture className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-center">
              <p className="text-xs text-muted-foreground">Total Tax</p>
              <AnimatedCounter value={Math.round(totalTax)} prefix="₹" className="text-2xl font-bold text-destructive" />
              <p className="text-[10px] text-muted-foreground mt-1">Monthly: {fmt(monthlyTax)}</p>
            </div>
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 text-center">
              <p className="text-xs text-muted-foreground">Take Home</p>
              <AnimatedCounter value={Math.round(takeHome)} prefix="₹" className="text-2xl font-bold text-accent" />
              <p className="text-[10px] text-muted-foreground mt-1">Monthly: {fmt(takeHome / 12)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-[10px] mt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />Take Home ({(100 - effectiveRate).toFixed(1)}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" />Tax ({effectiveRate.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">Effective Tax Rate</p>
            <p className="text-2xl font-bold text-primary">{effectiveRate.toFixed(1)}%</p>
            <p className="text-[10px] text-muted-foreground">Taxable Income: {fmt(taxable)}</p>
          </div>

          {slabBreakdown.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Slab-wise Tax</p>
              {slabBreakdown.map((s) => (
                <div key={s.slab} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.slab} ({s.rate}%)</span>
                  <span className="font-semibold">{fmt(s.tax)}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs border-t border-border pt-2">
                <span className="text-muted-foreground">Health & Edu Cess (4%)</span>
                <span className="font-semibold">{fmt(cess)}</span>
              </div>
              {surcharge > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Surcharge</span>
                  <span className="font-semibold">{fmt(surcharge)}</span>
                </div>
              )}
            </div>
          )}

          <AIInsight
            type="ai"
            title="AI Tax Strategy (FY 2025-26)"
            message={aiInsights[0] || "Adjust income to see personalized tax-saving tips."}
            insights={aiInsights.slice(1)}
          />
          <ResultActions title="Tax Estimate" data={{ "Income": fmt(income), "Regime": regime === "new" ? "New" : "Old", "Taxable": fmt(taxable), "Tax": fmt(totalTax), "Effective Rate": `${effectiveRate.toFixed(1)}%`, "Take Home": fmt(takeHome), "Regime Savings": fmt(Math.abs(regimeSavings)) }} productLink="/bank-accounts" captureRef={resultRef} />
        </div>
      </div>
    </ToolLayout>
  );
};

export default TaxEstimator;
