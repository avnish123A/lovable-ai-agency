import { useState } from "react";
import { BadgeDollarSign } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const DebtPayoffCalc = () => {
  const [debt, setDebt] = useState(500000);
  const [rate, setRate] = useState(15);
  const [payment, setPayment] = useState(15000);

  const r = rate / 100 / 12;
  const minPayment = debt * r * 1.01; // minimum to cover interest + a bit

  let months = 0;
  let balance = debt;
  let totalInterest = 0;
  const effectivePayment = Math.max(payment, Math.ceil(minPayment));

  while (balance > 0 && months < 600) {
    const interest = balance * r;
    totalInterest += interest;
    balance = balance + interest - effectivePayment;
    months++;
    if (balance < 0) balance = 0;
  }

  const totalPaid = debt + totalInterest;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  return (
    <ToolLayout title="Debt Payoff Calculator" description="Plan your debt-free journey with a repayment schedule" icon={<BadgeDollarSign className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { label: "Total Debt (₹)", value: debt, set: setDebt, min: 10000, max: 10000000, step: 10000 },
            { label: "Interest Rate (%)", value: rate, set: setRate, min: 5, max: 40, step: 0.5 },
            { label: "Monthly Payment (₹)", value: payment, set: setPayment, min: Math.ceil(minPayment), max: debt, step: 1000 },
          ].map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">{f.label}</span><span className="font-semibold">{f.label.includes("Rate") ? `${f.value}%` : `₹${f.value.toLocaleString("en-IN")}`}</span></div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Debt-Free In</p>
            <p className="text-3xl font-bold text-primary">{years > 0 ? `${years} yr${years > 1 ? "s" : ""} ` : ""}{remainingMonths} mo</p>
            <p className="text-xs text-muted-foreground mt-1">{months} total months</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Debt</span><span className="font-semibold">₹{debt.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Interest</span><span className="font-semibold text-destructive">₹{Math.round(totalInterest).toLocaleString("en-IN")}</span></div>
            <div className="border-t border-border pt-2 flex justify-between text-sm"><span className="font-semibold">Total Paid</span><span className="font-bold">₹{Math.round(totalPaid).toLocaleString("en-IN")}</span></div>
          </div>
          <div className="rounded-xl bg-accent/10 p-4 text-xs">
            <p className="font-semibold text-foreground mb-1">💡 Tip</p>
            <p className="text-muted-foreground">Increasing your monthly payment by just ₹{Math.round(payment * 0.1).toLocaleString("en-IN")} could save you months of interest!</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default DebtPayoffCalc;
