import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CompoundInterestCalc = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const [compound, setCompound] = useState(12); // monthly

  const total = principal * Math.pow(1 + rate / 100 / compound, compound * years);
  const interest = total - principal;
  const data = [
    { name: "Principal", value: Math.round(principal) },
    { name: "Interest Earned", value: Math.round(interest) },
  ];
  const COLORS = ["hsl(221,83%,53%)", "hsl(142,71%,45%)"];

  return (
    <ToolLayout title="Compound Interest Calculator" description="See how your money grows with compound interest" icon={<TrendingUp className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Principal Amount (₹)", value: principal, set: setPrincipal, min: 1000, max: 10000000, step: 1000 },
            { label: "Annual Interest Rate (%)", value: rate, set: setRate, min: 1, max: 30, step: 0.5 },
            { label: "Time Period (Years)", value: years, set: setYears, min: 1, max: 30, step: 1 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-semibold text-foreground">{f.label.includes("Rate") ? `${f.value}%` : f.label.includes("Year") ? `${f.value} yrs` : `₹${f.value.toLocaleString("en-IN")}`}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
          <div>
            <span className="text-sm text-muted-foreground">Compounding Frequency</span>
            <div className="flex gap-2 mt-2">
              {[{ l: "Monthly", v: 12 }, { l: "Quarterly", v: 4 }, { l: "Yearly", v: 1 }].map((c) => (
                <button key={c.v} onClick={() => setCompound(c.v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${compound === c.v ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{c.l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" strokeWidth={2}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie><Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} /></PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Principal</span><span className="font-semibold">₹{Math.round(principal).toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Interest Earned</span><span className="font-semibold text-accent">₹{Math.round(interest).toLocaleString("en-IN")}</span></div>
            <div className="border-t border-border pt-3 flex justify-between text-sm"><span className="font-semibold">Total Value</span><span className="font-bold text-primary text-lg">₹{Math.round(total).toLocaleString("en-IN")}</span></div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CompoundInterestCalc;
