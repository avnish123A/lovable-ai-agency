import { useState } from "react";
import { CreditCard, Sparkles } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import EditableSliderInput from "@/components/gamification/EditableSliderInput";

const SPENDING_CATEGORIES = ["Shopping", "Travel", "Dining", "Fuel", "Bills & Utilities", "Groceries"];

const CreditCardFinder = () => {
  const [income, setIncome] = useState(50000);
  const [spending, setSpending] = useState<string[]>([]);
  const [preference, setPreference] = useState<"cashback" | "rewards" | "travel">("cashback");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const findCards = async () => {
    setLoading(true);
    setResult("");
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nivesh-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `I need credit card recommendations. My monthly income is ₹${income.toLocaleString("en-IN")}. I spend most on: ${spending.join(", ") || "general"}. I prefer: ${preference} cards. Suggest the best 3 cards with reasons.`,
            },
          ],
          action: "fetch_products",
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) { text += c; setResult(text); }
          } catch {}
        }
      }
    } catch {
      toast.error("Could not get recommendations. Try again.");
    }
    setLoading(false);
  };

  return (
    <ToolLayout title="AI Credit Card Finder" description="Tell us about yourself and AI finds the perfect card" icon={<CreditCard className="w-7 h-7 text-primary" />}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <EditableSliderInput label="Monthly Income" value={income} onChange={setIncome} min={10000} max={500000} step={5000} prefix="₹" />

          <div>
            <p className="text-sm text-muted-foreground mb-2">Top Spending Categories</p>
            <div className="flex flex-wrap gap-2">
              {SPENDING_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setSpending((p) => p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${spending.includes(cat) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                >{cat}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">I prefer</p>
            <div className="flex gap-2">
              {(["cashback", "rewards", "travel"] as const).map((p) => (
                <button key={p} onClick={() => setPreference(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${preference === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                >{p}</button>
              ))}
            </div>
          </div>

          <Button onClick={findCards} disabled={loading} className="w-full rounded-xl">
            <Sparkles className="w-4 h-4 mr-2" />
            {loading ? "Finding best cards..." : "Find My Perfect Card"}
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          {!result && !loading && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Set your preferences and click "Find My Perfect Card"</p>
            </div>
          )}
          {loading && !result && (
            <div className="text-center py-12">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 animate-pulse" />
              <p className="text-sm text-muted-foreground">AI is analyzing your profile...</p>
            </div>
          )}
          {result && (
            <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1.5 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default CreditCardFinder;
