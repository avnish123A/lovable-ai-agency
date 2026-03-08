import { useState } from "react";
import { Receipt, Plus, Trash2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import FinancialScore from "@/components/gamification/FinancialScore";
import AIInsight from "@/components/gamification/AIInsight";
import AchievementBadge from "@/components/gamification/AchievementBadge";
import ResultActions from "@/components/gamification/ResultActions";
import StepIndicator from "@/components/gamification/StepIndicator";

const CATEGORIES = [
  { label: "Food", emoji: "🍽️", color: "hsl(142,71%,45%)" },
  { label: "Transport", emoji: "🚗", color: "hsl(38,92%,50%)" },
  { label: "Shopping", emoji: "🛍️", color: "hsl(280,65%,60%)" },
  { label: "Bills", emoji: "💡", color: "hsl(200,80%,50%)" },
  { label: "Entertainment", emoji: "🎬", color: "hsl(330,80%,60%)" },
  { label: "Health", emoji: "🏥", color: "hsl(0,84%,60%)" },
  { label: "Education", emoji: "📚", color: "hsl(221,83%,53%)" },
  { label: "Other", emoji: "📦", color: "hsl(160,60%,45%)" },
];

type Expense = { id: number; name: string; amount: number; category: string };

const ExpenseTracker = () => {
  const [income, setIncome] = useState(50000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, name: "Rent", amount: 15000, category: "Bills" },
    { id: 2, name: "Groceries", amount: 5000, category: "Food" },
    { id: 3, name: "Petrol", amount: 3000, category: "Transport" },
  ]);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCat, setNewCat] = useState("Food");

  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const savings = income - totalExpenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const addExpense = () => {
    if (!newName.trim() || !newAmount || Number(newAmount) <= 0) return;
    setExpenses((p) => [...p, { id: Date.now(), name: newName.trim(), amount: Number(newAmount), category: newCat }]);
    setNewName("");
    setNewAmount("");
  };

  const removeExpense = (id: number) => setExpenses((p) => p.filter((e) => e.id !== id));

  const catTotals = CATEGORIES.map((c) => ({
    name: c.label,
    value: expenses.filter((e) => e.category === c.label).reduce((a, e) => a + e.amount, 0),
    color: c.color,
  })).filter((c) => c.value > 0);

  const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  const healthScore = Math.min(100, Math.max(0, Math.round(
    (savingsRate >= 20 ? 40 : savingsRate * 2) +
    (savingsRate >= 0 ? 30 : 0) +
    (totalExpenses < income * 0.8 ? 30 : 15)
  )));

  return (
    <ToolLayout title="Expense Tracker" description="Track spending, analyze habits, and find savings" icon={<Receipt className="w-7 h-7 text-primary" />}>
      <StepIndicator steps={["Set Income", "Add Expenses", "Analyze"]} current={expenses.length > 3 ? 2 : expenses.length > 0 ? 1 : 0} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Monthly Income</span>
              <span className="font-semibold">{fmt(income)}</span>
            </div>
            <input type="range" min={10000} max={500000} step={5000} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full accent-primary" />
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <p className="text-sm font-semibold">Add Expense</p>
            <div className="flex gap-2">
              <Input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1" />
              <Input placeholder="₹ Amount" type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-28" />
            </div>
            <div className="flex gap-2 items-center">
              <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c.label} value={c.label}>{c.emoji} {c.label}</option>)}
              </select>
              <Button size="sm" onClick={addExpense} className="rounded-xl"><Plus className="w-4 h-4 mr-1" /> Add</Button>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {expenses.map((e) => {
              const cat = CATEGORIES.find((c) => c.label === e.category);
              return (
                <div key={e.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span>{cat?.emoji}</span>
                    <span className="text-sm font-medium">{e.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{fmt(e.amount)}</span>
                    <button onClick={() => removeExpense(e.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-[10px] text-muted-foreground">Income</p>
              <p className="text-sm font-bold text-primary">{fmt(income)}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 text-center">
              <p className="text-[10px] text-muted-foreground">Expenses</p>
              <p className="text-sm font-bold text-destructive">{fmt(totalExpenses)}</p>
            </div>
            <div className={`rounded-xl border p-3 text-center ${savings >= 0 ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950" : "border-destructive/30 bg-destructive/5"}`}>
              <p className="text-[10px] text-muted-foreground">Savings</p>
              <p className={`text-sm font-bold ${savings >= 0 ? "text-emerald-600" : "text-destructive"}`}>{fmt(savings)}</p>
            </div>
          </div>

          {catTotals.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Spending Breakdown</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={catTotals} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={1}>
                    {catTotals.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {catTotals.map((c) => (
                  <span key={c.name} className="text-[10px] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    {c.name}: {fmt(c.value)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <FinancialScore score={healthScore} label="Spending Health" sublabel={savingsRate >= 20 ? "Great savings ratio!" : "Try saving at least 20%"} />

          <AIInsight
            type="ai"
            title="AI Spending Tip"
            message={
              savingsRate < 10
                ? "⚠️ Your savings rate is critically low. Try the 50-30-20 rule: 50% needs, 30% wants, 20% savings."
                : savingsRate < 20
                ? `You're saving ${savingsRate}% — aim for at least 20%. Consider cutting discretionary spending.`
                : `Excellent! You're saving ${savingsRate}% of your income (${fmt(savings)}/month). Keep it up!`
            }
          />

          <AchievementBadge type="smart_saver" show={savingsRate >= 20} message={`Saving ${savingsRate}% of income!`} />

          <ResultActions
            title="Expense Report"
            data={{ Income: fmt(income), Expenses: fmt(totalExpenses), Savings: fmt(savings), "Savings Rate": `${savingsRate}%` }}
            productLink="/bank-accounts"
          />
        </div>
      </div>
    </ToolLayout>
  );
};

export default ExpenseTracker;
