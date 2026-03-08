import { useState } from "react";
import { Gift } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const CashbackCalc = () => {
  const [spend, setSpend] = useState(50000);
  const [cashbackRate, setCashbackRate] = useState(2);
  const [cap, setCap] = useState(1000);

  const monthlyCashback = Math.min(spend * cashbackRate / 100, cap);
  const yearlyCashback = monthlyCashback * 12;

  return (
    <ToolLayout title="Cashback Calculator" description="Calculate how much cashback you can earn from your spending" icon={<Gift className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Monthly Spend (₹)", value: spend, set: setSpend, min: 1000, max: 500000, step: 1000 },
            { label: "Cashback Rate (%)", value: cashbackRate, set: setCashbackRate, min: 0.5, max: 10, step: 0.5 },
            { label: "Monthly Cap (₹)", value: cap, set: setCap, min: 100, max: 10000, step: 100 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{f.label}</span><span className="font-semibold">{f.label.includes("Rate") ? `${f.value}%` : `₹${f.value.toLocaleString("en-IN")}`}</span></div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Monthly Cashback</p>
            <p className="text-3xl font-bold text-accent">₹{Math.round(monthlyCashback).toLocaleString("en-IN")}</p>
            {monthlyCashback >= cap && <p className="text-xs text-amber-500 mt-1">⚡ Monthly cap reached</p>}
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Yearly Cashback</p>
            <p className="text-2xl font-bold text-primary">₹{Math.round(yearlyCashback).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl bg-accent/10 p-4 text-xs">
            <p className="font-semibold text-foreground mb-1">💡 Maximize Cashback</p>
            <p className="text-muted-foreground">Use category-specific cards (dining, fuel, shopping) to earn higher rates on different spend types.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CashbackCalc;
