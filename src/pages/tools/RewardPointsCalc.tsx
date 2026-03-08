import { useState } from "react";
import { Star } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const RewardPointsCalc = () => {
  const [spend, setSpend] = useState(50000);
  const [pointsPerRupee, setPointsPerRupee] = useState(2);
  const [pointValue, setPointValue] = useState(0.25);

  const monthlyPoints = spend * pointsPerRupee;
  const monthlyValue = monthlyPoints * pointValue;
  const yearlyPoints = monthlyPoints * 12;
  const yearlyValue = monthlyValue * 12;

  return (
    <ToolLayout title="Reward Points Calculator" description="Calculate the real value of your credit card reward points" icon={<Star className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Monthly Card Spend (₹)", value: spend, set: setSpend, min: 1000, max: 500000, step: 1000, fmt: (v: number) => `₹${v.toLocaleString("en-IN")}` },
            { label: "Points per ₹100 spent", value: pointsPerRupee, set: setPointsPerRupee, min: 1, max: 10, step: 1, fmt: (v: number) => `${v} pts` },
            { label: "Point Value (₹ per point)", value: pointValue, set: setPointValue, min: 0.1, max: 1, step: 0.05, fmt: (v: number) => `₹${v}` },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{f.label}</span><span className="font-semibold">{f.fmt(f.value)}</span></div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground">Monthly Points</p>
              <p className="text-xl font-bold text-primary">{monthlyPoints.toLocaleString("en-IN")}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground">Monthly Value</p>
              <p className="text-xl font-bold text-accent">₹{Math.round(monthlyValue).toLocaleString("en-IN")}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground">Yearly Points</p>
              <p className="text-xl font-bold text-primary">{yearlyPoints.toLocaleString("en-IN")}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground">Yearly Value</p>
              <p className="text-xl font-bold text-accent">₹{Math.round(yearlyValue).toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 text-xs space-y-2">
            <p className="font-semibold text-foreground">📊 Point Value Guide</p>
            <div className="space-y-1 text-muted-foreground">
              <p>• HDFC Infinia: ~₹0.50/point</p>
              <p>• HDFC Regalia: ~₹0.30/point</p>
              <p>• Axis Magnus: ~₹0.40/point</p>
              <p>• SBI SimplyCLICK: ~₹0.25/point</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default RewardPointsCalc;
