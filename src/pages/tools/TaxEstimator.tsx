import { useState, useMemo } from "react";
import { Landmark } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";

const slabs = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 700000, rate: 5 },
  { min: 700001, max: 1000000, rate: 10 },
  { min: 1000001, max: 1200000, rate: 15 },
  { min: 1200001, max: 1500000, rate: 20 },
  { min: 1500001, max: Infinity, rate: 30 },
];

const TaxEstimator = () => {
  const [income, setIncome] = useState(1000000);
  const [deductions, setDeductions] = useState(150000);
  const [regime, setRegime] = useState<"new" | "old">("new");

  const taxable = regime === "new" ? income : Math.max(0, income - deductions);

  const { tax, slabBreakdown } = useMemo(() => {
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
    return { tax: t, slabBreakdown: breakdown };
  }, [taxable]);

  const cess = tax * 0.04;
  const totalTax = tax + cess;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
  const monthlyTax = totalTax / 12;
  const takeHome = income - totalTax;

  const pieData = [
    { name: "Take Home", value: Math.round(takeHome) },
    { name: "Tax", value: Math.round(totalTax) },
  ];
  const COLORS = ["hsl(var(--accent))", "hsl(var(--destructive))"];

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <ToolLayout title="Income Tax Estimator" description="Estimate your tax under New and Old regime (FY 2025-26)" icon={<Landmark className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Choose Regime", "Enter Income", "View Tax"]} current={income > 0 ? 2 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="flex gap-2 mb-2">
            {(["new", "old"] as const).map((r) => (
              <button key={r} onClick={() => setRegime(r)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${regime === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {r === "new" ? "New Regime" : "Old Regime"}
              </button>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Annual Income (₹)</span><span className="font-semibold">{fmt(income)}</span></div>
            <input type="range" min={0} max={10000000} step={50000} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          {regime === "old" && (
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Deductions (80C, 80D etc.)</span><span className="font-semibold">{fmt(deductions)}</span></div>
              <input type="range" min={0} max={500000} step={10000} value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          )}
          <div className="rounded-xl bg-secondary/50 p-4 text-xs space-y-1">
            <p className="font-semibold text-foreground mb-2">Tax Slabs (New Regime FY 2025-26)</p>
            {slabs.map((s) => (
              <div key={s.min} className="flex justify-between text-muted-foreground">
                <span>{s.max === Infinity ? `Above ₹${(s.min - 1).toLocaleString("en-IN")}` : `₹${s.min.toLocaleString("en-IN")} - ₹${s.max.toLocaleString("en-IN")}`}</span>
                <span className="font-semibold">{s.rate}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
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
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />Take Home</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" />Tax</span>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">Effective Tax Rate</p>
            <p className="text-2xl font-bold text-primary">{effectiveRate.toFixed(1)}%</p>
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
            </div>
          )}

          <AIInsight type="ai" title="AI Tax Tip"
            message={regime === "new" && deductions > 150000
              ? `With ₹${deductions.toLocaleString("en-IN")} in deductions, Old Regime might save you more. Try switching above to compare!`
              : effectiveRate < 10
                ? `Your effective tax rate is just ${effectiveRate.toFixed(1)}%. You're in a good tax bracket.`
                : `At ${effectiveRate.toFixed(1)}% effective rate, consider maximizing 80C deductions and NPS contributions in Old Regime.`
            }
          />
          <ResultActions title="Tax Estimate" data={{ "Income": fmt(income), "Regime": regime === "new" ? "New" : "Old", "Taxable": fmt(taxable), "Tax": fmt(totalTax), "Effective Rate": `${effectiveRate.toFixed(1)}%`, "Take Home": fmt(takeHome) }} productLink="/bank-accounts" />
        </div>
      </div>
    </ToolLayout>
  );
};

export default TaxEstimator;
