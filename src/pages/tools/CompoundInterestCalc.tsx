import { useState } from "react";
import { TrendingUp } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from "recharts";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";

const CompoundInterestCalc = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const [compound, setCompound] = useState(12);

  const total = principal * Math.pow(1 + rate / 100 / compound, compound * years);
  const interest = total - principal;
  const data = [
    { name: "Principal", value: Math.round(principal) },
    { name: "Interest Earned", value: Math.round(interest) },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))"];

  const growthData = Array.from({ length: years }, (_, i) => ({
    year: `Y${i + 1}`,
    value: Math.round(principal * Math.pow(1 + rate / 100 / compound, compound * (i + 1))),
  }));

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <ToolLayout title="Compound Interest Calculator" description="See how your money grows with compound interest" icon={<TrendingUp className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Enter Amount", "Choose Rate", "View Growth"]} current={principal > 1000 ? 2 : 0} />
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
                <span className="font-semibold text-foreground">{f.label.includes("Rate") ? `${f.value}%` : f.label.includes("Year") ? `${f.value} yrs` : fmt(f.value)}</span>
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
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={2}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie><Tooltip formatter={(v: number) => fmt(v)} /></PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Principal</span><span className="font-semibold">{fmt(principal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Interest Earned</span><AnimatedCounter value={Math.round(interest)} prefix="₹" className="font-semibold text-accent" /></div>
              <div className="border-t border-border pt-3 flex justify-between text-sm"><span className="font-semibold">Total Value</span><AnimatedCounter value={Math.round(total)} prefix="₹" className="font-bold text-primary text-lg" /></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Growth Timeline</p>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={growthData}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="value" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <AIInsight type="ai" title="Compound Power" message={`Your money grows ${(total / principal).toFixed(1)}x in ${years} years. ${compound === 12 ? "Monthly compounding gives the best results!" : "Try monthly compounding for faster growth."}`} />
          <ResultActions title="Compound Interest Result" data={{ "Principal": fmt(principal), "Rate": `${rate}%`, "Years": `${years}`, "Total": fmt(total), "Interest": fmt(interest) }} productLink="/fixed-deposits" />
        </div>
      </div>
    </ToolLayout>
  );
};

export default CompoundInterestCalc;
