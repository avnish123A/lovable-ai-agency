import { useState, useMemo } from "react";
import { BadgeDollarSign } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import FinancialScore from "@/components/gamification/FinancialScore";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import WhatIfSlider from "@/components/gamification/WhatIfSlider";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";
import EditableSliderInput from "@/components/gamification/EditableSliderInput";
import { getDebtInsights, INDIAN_BENCHMARKS } from "@/lib/financial-ai-engine";

const DebtPayoffCalc = () => {
  const [debt, setDebt] = useState(500000);
  const [rate, setRate] = useState(15);
  const [payment, setPayment] = useState(15000);

  const r = rate / 100 / 12;
  const minPayment = debt * r * 1.01;
  const effectivePayment = Math.max(payment, Math.ceil(minPayment));

  const { months, totalInterest, balanceChart } = useMemo(() => {
    let m = 0, bal = debt, ti = 0;
    const chart: { month: string; balance: number }[] = [];
    while (bal > 0 && m < 600) {
      const interest = bal * r;
      ti += interest;
      bal = Math.max(0, bal + interest - effectivePayment);
      m++;
      if (m % 3 === 0 || bal === 0) chart.push({ month: `M${m}`, balance: Math.round(bal) });
    }
    return { months: m, totalInterest: ti, balanceChart: chart };
  }, [debt, rate, effectivePayment, r]);

  const totalPaid = debt + totalInterest;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const debtScore = months <= 24 ? 90 : months <= 48 ? 70 : months <= 72 ? 50 : 30;
  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  const aiInsights = useMemo(() => getDebtInsights(debt, rate, effectivePayment, months, totalInterest), [debt, rate, effectivePayment, months, totalInterest]);

  return (
    <ToolLayout title="Debt Payoff Calculator" description="Plan your debt-free journey with real repayment strategies" icon={<BadgeDollarSign className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Enter Debt", "Set Payment", "Payoff Plan"]} current={payment > minPayment ? 2 : 1} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <EditableSliderInput label="Total Debt" value={debt} onChange={setDebt} min={10000} max={10000000} step={10000} prefix="₹" />
          <EditableSliderInput label={`Interest Rate (Avg PL: ${INDIAN_BENCHMARKS.personalLoanRates.mid}%)`} value={rate} onChange={setRate} min={5} max={40} step={0.5} suffix="%" />
          <EditableSliderInput label="Monthly Payment" value={payment} onChange={setPayment} min={Math.ceil(minPayment)} max={debt} step={1000} prefix="₹" />
          <WhatIfSlider label="What if you pay more?" baseValue={payment} min={Math.ceil(minPayment)} max={debt} step={1000}
            onResult={(delta) => {
              if (delta <= 0) return "Increase payment to save time";
              let m2 = 0, bal2 = debt;
              while (bal2 > 0 && m2 < 600) { bal2 = Math.max(0, bal2 + bal2 * r - (effectivePayment + delta)); m2++; }
              const saved = months - m2;
              return saved > 0 ? `Debt-free ${saved} months sooner!` : "Keep going!";
            }}
          />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Debt-Free In</p>
            <p className="text-3xl font-bold text-primary">{years > 0 ? `${years} yr${years > 1 ? "s" : ""} ` : ""}{remainingMonths} mo</p>
            <p className="text-xs text-muted-foreground mt-1">{months} total months</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Balance Over Time</p>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={balanceChart}>
                <XAxis dataKey="month" tick={{ fontSize: 9 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="balance" fill="hsl(var(--destructive) / 0.1)" stroke="hsl(var(--destructive))" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Debt</span><span className="font-semibold">{fmt(debt)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Interest</span><AnimatedCounter value={Math.round(totalInterest)} prefix="₹" className="font-semibold text-destructive" /></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Interest as % of Principal</span><span className="font-semibold text-destructive">{(totalInterest / debt * 100).toFixed(0)}%</span></div>
            <div className="border-t border-border pt-2 flex justify-between text-sm"><span className="font-semibold">Total Paid</span><span className="font-bold">{fmt(totalPaid)}</span></div>
          </div>
          <FinancialScore score={debtScore} label="Payoff Speed" sublabel={months <= 24 ? "Aggressive payoff!" : "Consider increasing payments"} />
          
          <AIInsight
            type="ai"
            title="AI Debt Strategy (Real Data)"
            message={aiInsights[0] || "Adjust values to see debt payoff insights."}
            insights={aiInsights.slice(1)}
          />
          
          <AchievementBadge type="debt_crusher" show={debtScore >= 70} message="You're on a fast track to debt freedom!" />
          <ResultActions title="Debt Payoff Plan" data={{ "Debt": fmt(debt), "Rate": `${rate}%`, "Payment": fmt(payment), "Duration": `${months} months`, "Total Interest": fmt(totalInterest) }} productLink="/loans" />
        </div>
      </div>
    </ToolLayout>
  );
};

export default DebtPayoffCalc;
