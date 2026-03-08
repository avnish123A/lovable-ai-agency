import { useState } from "react";
import { Wallet } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const PersonalLoanCalc = () => {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);

  const r = rate / 100 / 12;
  const n = years * 12;
  const emi = amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - amount;

  return (
    <ToolLayout title="Personal Loan Calculator" description="Estimate your personal loan EMI and total cost" icon={<Wallet className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Loan Amount (₹)", value: amount, set: setAmount, min: 10000, max: 5000000, step: 10000, fmt: (v: number) => `₹${v.toLocaleString("en-IN")}` },
            { label: "Interest Rate (%)", value: rate, set: setRate, min: 8, max: 30, step: 0.5, fmt: (v: number) => `${v}%` },
            { label: "Tenure (Years)", value: years, set: setYears, min: 1, max: 7, step: 1, fmt: (v: number) => `${v} yrs` },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{f.label}</span><span className="font-semibold">{f.fmt(f.value)}</span></div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-center mb-6"><p className="text-sm text-muted-foreground">Monthly EMI</p><p className="text-3xl font-bold text-primary">₹{Math.round(emi).toLocaleString("en-IN")}</p></div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Loan Amount</span><span className="font-semibold">₹{amount.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Interest</span><span className="font-semibold text-destructive">₹{Math.round(interest).toLocaleString("en-IN")}</span></div>
            <div className="border-t border-border pt-3 flex justify-between"><span className="font-semibold">Total Payment</span><span className="font-bold text-lg">₹{Math.round(total).toLocaleString("en-IN")}</span></div>
          </div>
          <div className="mt-4"><div className="h-3 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${(amount / total) * 100}%` }} /></div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>Principal ({Math.round((amount / total) * 100)}%)</span><span>Interest ({Math.round((interest / total) * 100)}%)</span></div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default PersonalLoanCalc;
