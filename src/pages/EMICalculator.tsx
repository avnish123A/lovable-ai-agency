import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import FinancialScore from "@/components/gamification/FinancialScore";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AnimatedCounter from "@/components/gamification/AnimatedCounter";
import AIInsight from "@/components/gamification/AIInsight";
import WhatIfSlider from "@/components/gamification/WhatIfSlider";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";
import EditableSliderInput from "@/components/gamification/EditableSliderInput";

const EMICalculator = () => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(24);

  const result = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    if (r === 0) return { emi: amount / n, totalInterest: 0, totalPayment: amount };
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - amount;
    return { emi, totalInterest, totalPayment };
  }, [amount, rate, tenure]);

  const affordabilityScore = useMemo(() => {
    const emiToLoanRatio = result.totalInterest / amount;
    if (emiToLoanRatio < 0.1) return 95;
    if (emiToLoanRatio < 0.2) return 80;
    if (emiToLoanRatio < 0.35) return 60;
    if (emiToLoanRatio < 0.5) return 40;
    return 20;
  }, [result, amount]);

  const pieData = [
    { name: "Principal", value: Math.round(amount) },
    { name: "Interest", value: Math.round(result.totalInterest) },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))"];

  const yearlyBreakdown = useMemo(() => {
    const r = rate / 12 / 100;
    const monthlyEMI = result.emi;
    const years = Math.ceil(tenure / 12);
    return Array.from({ length: years }, (_, i) => {
      const startMonth = i * 12;
      const endMonth = Math.min((i + 1) * 12, tenure);
      let principal = 0, interest = 0, balance = amount;
      for (let m = 0; m < startMonth; m++) {
        const intPart = balance * r;
        balance -= (monthlyEMI - intPart);
      }
      for (let m = startMonth; m < endMonth; m++) {
        const intPart = balance * r;
        interest += intPart;
        principal += (monthlyEMI - intPart);
        balance -= (monthlyEMI - intPart);
      }
      return { year: `Y${i + 1}`, principal: Math.round(principal), interest: Math.round(interest) };
    });
  }, [amount, rate, tenure, result.emi]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const showBadge = affordabilityScore >= 80;
  const currentStep = result.emi > 0 ? 2 : amount > 50000 ? 1 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
              <span className="text-gradient">EMI</span> Calculator
            </h1>
            <p className="text-muted-foreground">Plan your loan repayment with AI-powered insights</p>
          </motion.div>

          <StepIndicator steps={["Enter Details", "View Results", "Get Recommendations"]} current={currentStep} />

          <div className="grid lg:grid-cols-5 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-6">
              <EditableSliderInput label="Loan Amount" value={amount} onChange={setAmount} min={50000} max={5000000} step={10000} prefix="₹" />
              <EditableSliderInput label="Interest Rate (% p.a.)" value={rate} onChange={setRate} min={5} max={30} step={0.25} suffix="%" />
              <EditableSliderInput label="Loan Tenure" value={tenure} onChange={setTenure} min={6} max={84} step={1} suffix=" mo" />

              <WhatIfSlider
                label="What if tenure changes?"
                baseValue={tenure}
                min={6} max={84} step={1}
                format={(v) => `${v} months`}
                onResult={(delta) => {
                  if (delta === 0) return "";
                  const r2 = rate / 12 / 100;
                  const n2 = tenure + delta;
                  const newEmi = (amount * r2 * Math.pow(1 + r2, n2)) / (Math.pow(1 + r2, n2) - 1);
                  const diff = result.emi - newEmi;
                  return diff > 0
                    ? `EMI reduces by ${fmt(diff)}/month`
                    : `EMI increases by ${fmt(Math.abs(diff))}/month`;
                }}
              />
            </motion.div>

            <motion.div ref={resultRef} data-result-capture initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Monthly EMI", value: result.emi, highlight: true },
                  { label: "Total Interest", value: result.totalInterest },
                  { label: "Total Payment", value: result.totalPayment },
                ].map((item) => (
                  <div key={item.label}
                    className={`rounded-xl p-4 text-center ${item.highlight ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}
                  >
                    <p className="text-[11px] text-muted-foreground mb-1">{item.label}</p>
                    <AnimatedCounter value={Math.round(item.value)} prefix="₹"
                      className={`text-lg font-heading font-bold ${item.highlight ? "text-primary" : "text-foreground"}`} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Payment Breakdown</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" strokeWidth={2}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 text-[10px] mt-1">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" />Principal</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" />Interest</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Yearly Breakdown</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={yearlyBreakdown}>
                      <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip formatter={(v: number) => fmt(v)} />
                      <Bar dataKey="principal" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="interest" fill="hsl(var(--destructive) / 0.5)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FinancialScore score={affordabilityScore} label="Loan Affordability" sublabel={rate <= 12 ? "Great interest rate!" : "Consider negotiating rate"} />
                <div className="space-y-3">
                  <AIInsight type="ai" title="AI Recommendation"
                    message={result.emi < 20000 ? `Your EMI of ${fmt(result.emi)} looks manageable. Keep EMI under 40% of income for healthy finances.` : `Your EMI is ${fmt(result.emi)}. Consider increasing tenure to reduce monthly burden.`}
                  />
                  <AIInsight type="tip" title="Pro Tip" delay={0.2}
                    message={`Paying just ${fmt(result.emi * 0.1)} extra monthly can save you ${fmt(result.totalInterest * 0.15)} in interest!`}
                  />
                </div>
              </div>

              <AchievementBadge type="smart_planner" show={showBadge} message="You've chosen an affordable loan structure!" />

              <ResultActions
                title="EMI Calculation Result"
                data={{
                  "Loan Amount": fmt(amount),
                  "Interest Rate": `${rate}%`,
                  "Tenure": `${tenure} months`,
                  "Monthly EMI": fmt(result.emi),
                  "Total Interest": fmt(result.totalInterest),
                  "Total Payment": fmt(result.totalPayment),
                }}
                productLink="/loans"
                captureRef={resultRef}
              />
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EMICalculator;
