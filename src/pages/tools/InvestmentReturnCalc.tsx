import { useState } from "react";
import { LineChart as LineChartIcon } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const InvestmentReturnCalc = () => {
  const [initial, setInitial] = useState(100000);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const r = rate / 100 / 12;
  const n = years * 12;
  const lumpSum = initial * Math.pow(1 + r, n);
  const sipValue = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const totalValue = lumpSum + sipValue;
  const totalInvested = initial + monthly * n;
  const returns = totalValue - totalInvested;

  const chartData = Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const m = y * 12;
    const ls = initial * Math.pow(1 + r, m);
    const sv = monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
    return { year: `Y${y}`, value: Math.round(ls + sv), invested: initial + monthly * m };
  });

  return (
    <ToolLayout title="Investment Return Calculator" description="Estimate returns on lump sum + SIP investments" icon={<LineChartIcon className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Initial Investment (₹)", value: initial, set: setInitial, min: 0, max: 10000000, step: 10000 },
            { label: "Monthly SIP (₹)", value: monthly, set: setMonthly, min: 0, max: 200000, step: 500 },
            { label: "Expected Return (%)", value: rate, set: setRate, min: 1, max: 30, step: 0.5 },
            { label: "Time Period (Years)", value: years, set: setYears, min: 1, max: 30, step: 1 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{f.label}</span><span className="font-semibold">{f.label.includes("Return") ? `${f.value}%` : f.label.includes("Year") ? `${f.value} yrs` : `₹${f.value.toLocaleString("en-IN")}`}</span></div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-3xl font-bold text-primary">₹{Math.round(totalValue).toLocaleString("en-IN")}</p>
            <div className="flex justify-center gap-6 mt-3 text-xs">
              <span className="text-muted-foreground">Invested: <span className="font-semibold text-foreground">₹{totalInvested.toLocaleString("en-IN")}</span></span>
              <span className="text-muted-foreground">Returns: <span className="font-semibold text-accent">₹{Math.round(returns).toLocaleString("en-IN")}</span></span>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Line type="monotone" dataKey="invested" stroke="hsl(220,9%,46%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="value" stroke="hsl(142,71%,45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default InvestmentReturnCalc;
