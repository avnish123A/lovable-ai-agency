import { useState, useMemo, useRef } from "react";
import { Shield, TrendingUp, TrendingDown } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FinancialScore from "@/components/gamification/FinancialScore";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AIInsight from "@/components/gamification/AIInsight";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";
import EditableSliderInput from "@/components/gamification/EditableSliderInput";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { getCreditScoreInsights, INDIAN_BENCHMARKS } from "@/lib/financial-ai-engine";

const factors = [
  { key: "payment", label: "On-Time Payments", min: 0, max: 100, step: 5, default: 90, weight: 0.35, emoji: "💳", suffix: "%" },
  { key: "utilization", label: "Credit Utilization", min: 0, max: 100, step: 5, default: 30, weight: 0.30, emoji: "📊", inverse: true, suffix: "%" },
  { key: "history", label: "Credit History", min: 0, max: 30, step: 1, default: 5, weight: 0.15, emoji: "📅", suffix: " yrs" },
  { key: "mix", label: "Credit Mix (1-5)", min: 1, max: 5, step: 1, default: 3, weight: 0.10, emoji: "🔀", suffix: "" },
  { key: "inquiries", label: "Hard Inquiries (last 2yr)", min: 0, max: 10, step: 1, default: 2, weight: 0.10, emoji: "🔍", inverse: true, suffix: "" },
];

function calculateCIBILScore(vals: number[]) {
  let total = 0;
  factors.forEach((f, i) => {
    let normalized: number;
    if (f.key === "payment") {
      normalized = vals[i] >= 99 ? 1 : vals[i] >= 95 ? 0.9 : vals[i] >= 90 ? 0.75 : vals[i] >= 80 ? 0.5 : vals[i] / 100 * 0.4;
    } else if (f.key === "utilization") {
      if (vals[i] === 0) normalized = 0.85;
      else if (vals[i] <= 10) normalized = 1;
      else if (vals[i] <= 30) normalized = 0.9;
      else if (vals[i] <= 50) normalized = 0.6;
      else normalized = Math.max(0, 1 - vals[i] / 100);
    } else if (f.key === "history") {
      normalized = Math.min(1, Math.log(1 + vals[i]) / Math.log(31));
    } else if (f.key === "mix") {
      normalized = (vals[i] - 1) / 4;
    } else {
      normalized = Math.max(0, 1 - vals[i] * 0.12);
    }
    total += normalized * f.weight;
  });
  return Math.round(300 + total * 600);
}

const CreditScoreSimulator = () => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState(factors.map((f) => f.default));

  const score = useMemo(() => calculateCIBILScore(values), [values]);

  const getLabel = (s: number) =>
    s >= 800 ? "Excellent" : s >= 750 ? "Very Good" : s >= 650 ? "Good" : s >= 550 ? "Fair" : "Poor";

  const chartData = factors.map((f, i) => {
    let normalized: number;
    if (f.inverse) normalized = Math.round((1 - values[i] / f.max) * 100);
    else normalized = Math.round((values[i] / f.max) * 100);
    return { name: f.label.split(" (")[0], value: normalized };
  });

  const barColors = ["hsl(var(--primary))", "hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(280,65%,60%)", "hsl(200,80%,50%)"];

  const prevScore = useMemo(() => calculateCIBILScore(factors.map(f => f.default)), []);
  const diff = score - prevScore;

  const aiInsights = useMemo(() => getCreditScoreInsights(score, {
    payment: values[0], utilization: values[1], history: values[2], mix: values[3], inquiries: values[4],
  }), [score, values]);

  const updateValue = (index: number, newVal: number) => {
    const n = [...values];
    n[index] = newVal;
    setValues(n);
  };

  return (
    <ToolLayout title="Credit Score Simulator" description="See how your financial habits impact your CIBIL credit score (300-900)" icon={<Shield className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Adjust Factors", "View Score", "Get Tips"]} current={score !== prevScore ? 2 : values.some((v, i) => v !== factors[i].default) ? 1 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {factors.map((f, i) => (
            <div key={f.key} className="rounded-xl border border-border bg-card p-4">
              <EditableSliderInput
                label={`${f.emoji} ${f.label}`}
                value={values[i]}
                onChange={(v) => updateValue(i, v)}
                min={f.min}
                max={f.max}
                step={f.step}
                suffix={f.suffix}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{f.min}</span>
                <span className="text-primary font-medium">Weight: {(f.weight * 100)}%</span>
                <span>{f.max}</span>
              </div>
            </div>
          ))}
        </div>

        <div ref={resultRef} data-result-capture className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Estimated CIBIL Score</p>
            <div className="text-5xl font-bold text-primary mb-1">{score}</div>
            <p className="text-sm font-medium">{getLabel(score)}</p>
            <div className="mt-2 h-3 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((score - 300) / 600) * 100}%`,
                  background: score >= 800 ? "hsl(142,71%,45%)" : score >= 750 ? "hsl(82,71%,45%)" : score >= 650 ? "hsl(38,92%,50%)" : score >= 550 ? "hsl(25,92%,50%)" : "hsl(0,84%,60%)",
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>300</span><span>550</span><span>650</span><span>750</span><span>900</span>
            </div>
            {diff !== 0 && (
              <div className={`inline-flex items-center gap-1 mt-3 text-sm font-medium ${diff > 0 ? "text-emerald-500" : "text-destructive"}`}>
                {diff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {diff > 0 ? "+" : ""}{diff} points from default
              </div>
            )}
          </div>

          <FinancialScore score={Math.round((score - 300) / 6)} label="Credit Health" sublabel={getLabel(score)} />

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">Factor Impact (CIBIL Weights)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <AIInsight
            type="ai"
            title="AI Credit Analysis (Real Data)"
            message={aiInsights[0] || "Adjust the sliders to see personalized insights."}
            insights={aiInsights.slice(1)}
          />

          <AchievementBadge type="smart_planner" show={score >= 750} message="Credit Score Pro — Score above 750!" />

          <ResultActions
            title="Credit Score Simulation"
            data={{
              "Estimated Score": score.toString(),
              "Rating": getLabel(score),
              "Payment History": `${values[0]}%`,
              "Credit Utilization": `${values[1]}%`,
              "Credit History": `${values[2]} years`,
              "Credit Mix": `${values[3]}/5`,
              "Hard Inquiries": `${values[4]}`,
            }}
            productLink="/credit-cards"
          />
        </div>
      </div>
    </ToolLayout>
  );
};

export default CreditScoreSimulator;
