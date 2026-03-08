import { useState } from "react";
import { Percent } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const InterestRateCalc = () => {
  const [principal, setPrincipal] = useState(100000);
  const [finalAmount, setFinalAmount] = useState(150000);
  const [years, setYears] = useState(3);

  const simpleRate = ((finalAmount - principal) / (principal * years)) * 100;
  const compoundRate = (Math.pow(finalAmount / principal, 1 / years) - 1) * 100;

  return (
    <ToolLayout title="Interest Rate Calculator" description="Find the interest rate from principal, final amount and time" icon={<Percent className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Principal (₹)", value: principal, set: setPrincipal, min: 1000, max: 10000000, step: 1000 },
            { label: "Final Amount (₹)", value: finalAmount, set: setFinalAmount, min: principal, max: 50000000, step: 1000 },
            { label: "Time Period (Years)", value: years, set: setYears, min: 1, max: 30, step: 1 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{f.label}</span><span className="font-semibold">{f.label.includes("Year") ? `${f.value} yrs` : `₹${f.value.toLocaleString("en-IN")}`}</span></div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Simple Interest Rate</p>
            <p className="text-3xl font-bold text-primary">{simpleRate.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">per annum</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Compound Interest Rate</p>
            <p className="text-3xl font-bold text-accent">{compoundRate.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">per annum (compounded annually)</p>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">💡 Interest Earned</p>
            <p>₹{(finalAmount - principal).toLocaleString("en-IN")} over {years} year{years > 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default InterestRateCalc;
