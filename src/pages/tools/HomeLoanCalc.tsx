import { useState } from "react";
import { Building } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const HomeLoanCalc = () => {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [downPayment, setDownPayment] = useState(1000000);

  const loanAmount = amount - downPayment;
  const r = rate / 100 / 12;
  const n = years * 12;
  const emi = loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmount;

  const chartData = Array.from({ length: Math.min(years, 30) }, (_, i) => {
    const y = i + 1;
    const months = y * 12;
    const remaining = loanAmount * (Math.pow(1 + r, n) - Math.pow(1 + r, months)) / (Math.pow(1 + r, n) - 1);
    return { year: `Y${y}`, principal: Math.round(loanAmount - remaining), interest: Math.round(emi * months - (loanAmount - remaining)) };
  });

  return (
    <ToolLayout title="Home Loan Calculator" description="Plan your dream home purchase with detailed EMI breakdown" icon={<Building className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Property Value (₹)", value: amount, set: setAmount, min: 500000, max: 50000000, step: 100000 },
            { label: "Down Payment (₹)", value: downPayment, set: setDownPayment, min: 0, max: amount * 0.8, step: 50000 },
            { label: "Interest Rate (%)", value: rate, set: setRate, min: 5, max: 15, step: 0.1 },
            { label: "Loan Tenure (Years)", value: years, set: setYears, min: 5, max: 30, step: 1 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-semibold text-foreground">{f.label.includes("Rate") ? `${f.value}%` : f.label.includes("Year") ? `${f.value} yrs` : `₹${f.value.toLocaleString("en-IN")}`}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Monthly EMI</p>
              <p className="text-3xl font-bold text-primary">₹{Math.round(emi).toLocaleString("en-IN")}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Loan Amount</span><span className="font-semibold">₹{loanAmount.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Interest</span><span className="font-semibold text-destructive">₹{Math.round(totalInterest).toLocaleString("en-IN")}</span></div>
              <div className="border-t border-border pt-2 flex justify-between text-sm"><span className="font-semibold">Total Payment</span><span className="font-bold">₹{Math.round(totalPayment).toLocaleString("en-IN")}</span></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Principal vs Interest (Year-wise)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData.filter((_, i) => i % Math.ceil(years / 10) === 0)}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Bar dataKey="principal" fill="hsl(221,83%,53%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interest" fill="hsl(0,84%,60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default HomeLoanCalc;
