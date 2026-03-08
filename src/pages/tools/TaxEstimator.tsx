import { useState } from "react";
import { Landmark } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

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

  let tax = 0;
  for (const slab of slabs) {
    if (taxable > slab.min) {
      const taxableInSlab = Math.min(taxable, slab.max) - slab.min;
      tax += taxableInSlab * slab.rate / 100;
    }
  }
  const cess = tax * 0.04;
  const totalTax = tax + cess;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
  const monthlyTax = totalTax / 12;

  return (
    <ToolLayout title="Income Tax Estimator" description="Estimate your tax under New and Old regime (FY 2025-26)" icon={<Landmark className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="flex gap-2 mb-2">
            {(["new", "old"] as const).map((r) => (
              <button key={r} onClick={() => setRegime(r)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${regime === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                {r === "new" ? "New Regime" : "Old Regime"}
              </button>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Annual Income (₹)</span><span className="font-semibold">₹{income.toLocaleString("en-IN")}</span></div>
            <input type="range" min={0} max={10000000} step={50000} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          {regime === "old" && (
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Deductions (80C, 80D etc.)</span><span className="font-semibold">₹{deductions.toLocaleString("en-IN")}</span></div>
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
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Tax Payable</p>
            <p className="text-3xl font-bold text-primary">₹{Math.round(totalTax).toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground mt-1">Monthly: ₹{Math.round(monthlyTax).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Taxable Income</span><span className="font-semibold">₹{Math.round(taxable).toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Income Tax</span><span className="font-semibold">₹{Math.round(tax).toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Health & Education Cess (4%)</span><span className="font-semibold">₹{Math.round(cess).toLocaleString("en-IN")}</span></div>
            <div className="border-t border-border pt-2 flex justify-between text-sm"><span className="font-semibold">Effective Tax Rate</span><span className="font-bold text-primary">{effectiveRate.toFixed(1)}%</span></div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-2">Take-Home Breakdown</p>
            <div className="h-4 rounded-full bg-secondary overflow-hidden flex">
              <div className="h-full bg-accent" style={{ width: `${100 - effectiveRate}%` }} />
              <div className="h-full bg-destructive" style={{ width: `${effectiveRate}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Take Home: ₹{Math.round(income - totalTax).toLocaleString("en-IN")}</span>
              <span>Tax: ₹{Math.round(totalTax).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TaxEstimator;
