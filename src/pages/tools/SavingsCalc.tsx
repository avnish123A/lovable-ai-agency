import { useState } from "react";
import { PiggyBank } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SavingsCalc = () => {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const r = rate / 100 / 12;
  const n = years * 12;
  const futureValue = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const totalDeposited = monthly * n;
  const interestEarned = futureValue - totalDeposited;

  const chartData = Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const m = y * 12;
    const fv = monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
    return { year: `Y${y}`, savings: Math.round(fv), deposited: monthly * m };
  });

  return (
    <ToolLayout title="Savings Calculator" description="Plan your savings and watch your wealth grow" icon={<PiggyBank className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Monthly Savings (₹)", value: monthly, set: setMonthly, min: 500, max: 500000, step: 500 },
            { label: "Expected Return (%)", value: rate, set: setRate, min: 1, max: 20, step: 0.5 },
            { label: "Time Period (Years)", value: years, set: setYears, min: 1, max: 30, step: 1 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{f.label}</span><span className="font-semibold">{f.label.includes("Return") ? `${f.value}%` : f.label.includes("Year") ? `${f.value} yrs` : `₹${f.value.toLocaleString("en-IN")}`}</span></div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-center mb-4"><p className="text-sm text-muted-foreground">Total Savings</p><p className="text-3xl font-bold text-primary">₹{Math.round(futureValue).toLocaleString("en-IN")}</p></div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Deposited</span><span className="font-semibold">₹{totalDeposited.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Interest Earned</span><span className="font-semibold text-accent">₹{Math.round(interestEarned).toLocaleString("en-IN")}</span></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Area type="monotone" dataKey="deposited" fill="hsl(221,83%,53%,0.1)" stroke="hsl(221,83%,53%)" strokeWidth={2} />
                <Area type="monotone" dataKey="savings" fill="hsl(142,71%,45%,0.1)" stroke="hsl(142,71%,45%)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default SavingsCalc;
