import { useState, useMemo } from "react";
import { Shield, TrendingUp, TrendingDown } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FinancialScore from "@/components/gamification/FinancialScore";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import AIInsight from "@/components/gamification/AIInsight";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const factors = [
  { key: "payment", label: "On-Time Payments (%)", min: 0, max: 100, step: 5, default: 90, weight: 0.35, emoji: "💳" },
  { key: "utilization", label: "Credit Utilization (%)", min: 0, max: 100, step: 5, default: 30, weight: 0.30, emoji: "📊", inverse: true },
  { key: "history", label: "Credit History (years)", min: 0, max: 30, step: 1, default: 5, weight: 0.15, emoji: "📅" },
  { key: "mix", label: "Credit Mix (1-5)", min: 1, max: 5, step: 1, default: 3, weight: 0.10, emoji: "🔀" },
  { key: "inquiries", label: "Hard Inquiries (last 2yr)", min: 0, max: 10, step: 1, default: 2, weight: 0.10, emoji: "🔍", inverse: true },
];

const CreditScoreSimulator = () => {
  const [values, setValues] = useState(factors.map((f) => f.default));

  const score = useMemo(() => {
    let total = 0;
    factors.forEach((f, i) => {
      const normalized = f.inverse
        ? 1 - values[i] / f.max
        : values[i] / f.max;
      total += normalized * f.weight;
    });
    return Math.round(300 + total * 600);
  }, [values]);

  const getLabel = (s: number) =>
    s >= 800 ? "Excellent" : s >= 750 ? "Very Good" : s >= 650 ? "Good" : s >= 550 ? "Fair" : "Poor";

  const chartData = factors.map((f, i) => ({
    name: f.label.split(" (")[0],
    value: Math.round((f.inverse ? 1 - values[i] / f.max : values[i] / f.max) * 100),
  }));

  const barColors = ["hsl(var(--primary))", "hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(280,65%,60%)", "hsl(200,80%,50%)"];

  const prevScore = useMemo(() => {
    let total = 0;
    factors.forEach((f) => {
      const normalized = f.inverse ? 1 - f.default / f.max : f.default / f.max;
      total += normalized * f.weight;
    });
    return Math.round(300 + total * 600);
  }, []);

  const diff = score - prevScore;

  return (
    <ToolLayout title="Credit Score Simulator" description="See how your financial habits impact your credit score" icon={<Shield className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Adjust Factors", "View Score", "Get Tips"]} current={score !== prevScore ? 2 : values.some((v, i) => v !== factors[i].default) ? 1 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {factors.map((f, i) => (
            <div key={f.key} className="rounded-xl border border-border bg-card p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{f.emoji} {f.label}</span>
                <span className="font-semibold">{values[i]}{f.key === "payment" || f.key === "utilization" ? "%" : ""}</span>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={values[i]}
                onChange={(e) => {
                  const n = [...values];
                  n[i] = Number(e.target.value);
                  setValues(n);
                }}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{f.min}</span>
                <span>{f.max}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Estimated Credit Score</p>
            <div className="text-5xl font-bold text-primary mb-1">{score}</div>
            <p className="text-sm font-medium">{getLabel(score)}</p>
            {diff !== 0 && (
              <div className={`inline-flex items-center gap-1 mt-2 text-sm font-medium ${diff > 0 ? "text-emerald-500" : "text-destructive"}`}>
                {diff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {diff > 0 ? "+" : ""}{diff} points from default
              </div>
            )}
          </div>

          <FinancialScore score={Math.round((score - 300) / 6)} label="Credit Health" sublabel={getLabel(score)} />

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">Factor Impact</p>
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
            title="AI Credit Tip"
            message={
              values[1] > 50
                ? "Your credit utilization is high. Try to keep it below 30% for a significant score boost."
                : values[0] < 80
                ? "Improving on-time payments is the single biggest factor. Even one missed payment can drop your score by 50+ points."
                : score >= 750
                ? `Great score of ${score}! You qualify for premium credit cards and lowest interest rates.`
                : "Focus on reducing hard inquiries and maintaining a diverse credit mix to push your score higher."
            }
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
            }}
            productLink="/credit-cards"
          />
        </div>
      </div>
    </ToolLayout>
  );
};

export default CreditScoreSimulator;
