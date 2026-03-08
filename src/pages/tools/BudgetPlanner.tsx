import { useState } from "react";
import { FileText } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const categories = [
  { label: "Housing", emoji: "🏠", default: 30 },
  { label: "Food", emoji: "🍽️", default: 15 },
  { label: "Transport", emoji: "🚗", default: 10 },
  { label: "Utilities", emoji: "💡", default: 8 },
  { label: "Healthcare", emoji: "🏥", default: 5 },
  { label: "Entertainment", emoji: "🎬", default: 7 },
  { label: "Shopping", emoji: "🛍️", default: 10 },
  { label: "Savings", emoji: "💰", default: 15 },
];

const BudgetPlanner = () => {
  const [income, setIncome] = useState(50000);
  const [allocations, setAllocations] = useState(categories.map((c) => c.default));

  const total = allocations.reduce((a, b) => a + b, 0);
  const remaining = 100 - total;

  return (
    <ToolLayout title="Budget Planner" description="Create a monthly spending plan based on your income" icon={<FileText className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Monthly Income (₹)</span><span className="font-semibold">₹{income.toLocaleString("en-IN")}</span></div>
            <input type="range" min={10000} max={500000} step={5000} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className="text-lg w-6">{cat.emoji}</span>
                <span className="text-sm text-muted-foreground w-24">{cat.label}</span>
                <input type="range" min={0} max={50} step={1} value={allocations[i]} onChange={(e) => { const n = [...allocations]; n[i] = Number(e.target.value); setAllocations(n); }} className="flex-1 accent-primary" />
                <span className="text-sm font-semibold w-10 text-right">{allocations[i]}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className={`rounded-2xl border p-4 ${remaining >= 0 ? "border-border bg-card" : "border-destructive/30 bg-destructive/5"}`}>
            <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Allocated</span><span className="font-semibold">{total}%</span></div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full rounded-full transition-all ${total > 100 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min(total, 100)}%` }} />
            </div>
            {remaining < 0 && <p className="text-xs text-destructive mt-1">⚠️ Over budget by {Math.abs(remaining)}%</p>}
            {remaining > 0 && <p className="text-xs text-accent mt-1">✅ {remaining}% unallocated</p>}
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground mb-3">Monthly Breakdown</p>
            {categories.map((cat, i) => (
              <div key={cat.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{cat.emoji} {cat.label}</span>
                <span className="font-semibold">₹{Math.round(income * allocations[i] / 100).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
              <span>Total</span>
              <span className={total > 100 ? "text-destructive" : "text-primary"}>₹{Math.round(income * total / 100).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default BudgetPlanner;
