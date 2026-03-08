import { useState, useRef } from "react";
import { Percent } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";
import EditableSliderInput from "@/components/gamification/EditableSliderInput";

const InterestRateCalc = () => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [principal, setPrincipal] = useState(100000);
  const [finalAmount, setFinalAmount] = useState(150000);
  const [years, setYears] = useState(3);

  const interestEarned = finalAmount - principal;
  const simpleRate = ((finalAmount - principal) / (principal * years)) * 100;
  const compoundRate = (Math.pow(finalAmount / principal, 1 / years) - 1) * 100;

  const growthData = Array.from({ length: years + 1 }, (_, i) => ({
    year: `Y${i}`,
    simple: Math.round(principal + (interestEarned / years) * i),
    compound: Math.round(principal * Math.pow(finalAmount / principal, i / years)),
  }));

  const fmt = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return (
    <ToolLayout title="Interest Rate Calculator" description="Find the interest rate from principal, final amount and time" icon={<Percent className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Enter Amounts", "Set Period", "View Rates"]} current={finalAmount > principal ? 2 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <EditableSliderInput label="Principal" value={principal} onChange={setPrincipal} min={1000} max={10000000} step={1000} prefix="₹" />
          <EditableSliderInput label="Final Amount" value={finalAmount} onChange={setFinalAmount} min={principal} max={50000000} step={1000} prefix="₹" />
          <EditableSliderInput label="Time Period" value={years} onChange={setYears} min={1} max={30} step={1} suffix=" yrs" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Simple Interest Rate</p>
              <AnimatedCounter value={parseFloat(simpleRate.toFixed(1))} className="text-3xl font-bold text-primary" />
              <p className="text-primary text-lg font-bold">% p.a.</p>
            </div>
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Compound Rate</p>
              <AnimatedCounter value={parseFloat(compoundRate.toFixed(1))} className="text-3xl font-bold text-accent" />
              <p className="text-accent text-lg font-bold">% p.a.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <p className="text-xs text-muted-foreground">Interest Earned</p>
            <AnimatedCounter value={interestEarned} prefix="₹" className="text-2xl font-bold text-foreground" />
            <p className="text-xs text-muted-foreground mt-1">over {years} year{years > 1 ? "s" : ""}</p>
            <p className="text-xs text-primary font-semibold mt-1">Money grew {(finalAmount / principal).toFixed(2)}x</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Growth Comparison</p>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={growthData}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis hide />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="simple" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Area type="monotone" dataKey="compound" fill="hsl(var(--accent) / 0.1)" stroke="hsl(var(--accent))" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-[10px] mt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />Simple</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" />Compound</span>
            </div>
          </div>

          <AIInsight type="ai" title="AI Rate Analysis" message={compoundRate > 10 ? `${compoundRate.toFixed(1)}% compound return is excellent — better than most FDs. This could be equity-like growth.` : `${compoundRate.toFixed(1)}% compound return is moderate. FDs offer 6-8%, mutual funds can give 12%+.`} />
          <ResultActions title="Interest Rate Analysis" data={{ "Principal": fmt(principal), "Final": fmt(finalAmount), "Years": `${years}`, "Simple Rate": `${simpleRate.toFixed(2)}%`, "Compound Rate": `${compoundRate.toFixed(2)}%`, "Interest": fmt(interestEarned) }} productLink="/fixed-deposits" captureRef={resultRef} />
        </div>
      </div>
    </ToolLayout>
  );
};

export default InterestRateCalc;
