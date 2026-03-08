import { useState, useRef } from "react";
import { Gift } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";
import EditableSliderInput from "@/components/gamification/EditableSliderInput";

const CashbackCalc = () => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [spend, setSpend] = useState(50000);
  const [cashbackRate, setCashbackRate] = useState(2);
  const [cap, setCap] = useState(1000);

  const monthlyCashback = Math.min(spend * cashbackRate / 100, cap);
  const yearlyCashback = monthlyCashback * 12;
  const hitsCap = monthlyCashback >= cap;

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    cashback: Math.round(monthlyCashback),
  }));

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <ToolLayout title="Cashback Calculator" description="Calculate how much cashback you can earn from your spending" icon={<Gift className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Set Spend", "Choose Card", "View Cashback"]} current={spend > 1000 ? 2 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <EditableSliderInput label="Monthly Spend" value={spend} onChange={setSpend} min={1000} max={500000} step={1000} prefix="₹" />
          <EditableSliderInput label="Cashback Rate" value={cashbackRate} onChange={setCashbackRate} min={0.5} max={10} step={0.5} suffix="%" />
          <EditableSliderInput label="Monthly Cap" value={cap} onChange={setCap} min={100} max={10000} step={100} prefix="₹" />
        </div>
        <div ref={resultRef} data-result-capture className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground">Monthly</p>
              <AnimatedCounter value={Math.round(monthlyCashback)} prefix="₹" className="text-2xl font-bold text-accent" />
              {hitsCap && <p className="text-[10px] text-amber-500 mt-1">⚡ Cap reached</p>}
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground">Yearly</p>
              <AnimatedCounter value={Math.round(yearlyCashback)} prefix="₹" className="text-2xl font-bold text-primary" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Monthly Cashback Timeline</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 9 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Bar dataKey="cashback" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <AIInsight type={hitsCap ? "warning" : "ai"} title={hitsCap ? "Cap Alert" : "AI Cashback Tip"}
            message={hitsCap ? `You're hitting the ${fmt(cap)} monthly cap. Consider a card with higher cap or use category-specific cards.` : `At ${cashbackRate}% rate, you're earning ${fmt(monthlyCashback)} monthly. Try cards with 5%+ on specific categories for even more.`}
          />
          <AchievementBadge type="cashback_pro" show={yearlyCashback >= 6000} message={`${fmt(yearlyCashback)} yearly cashback — that's a free vacation!`} />
          <ResultActions title="Cashback Calculation" data={{ "Spend": fmt(spend), "Rate": `${cashbackRate}%`, "Monthly": fmt(monthlyCashback), "Yearly": fmt(yearlyCashback) }} productLink="/credit-cards" captureRef={resultRef} />
        </div>
      </div>
    </ToolLayout>
  );
};

export default CashbackCalc;
