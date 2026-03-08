import { Sparkles } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const ranges = [
  { min: 300, max: 549, label: "Poor", color: "bg-red-500", desc: "Difficulty getting loans. Focus on paying bills on time." },
  { min: 550, max: 649, label: "Fair", color: "bg-orange-500", desc: "Some loan options available. Higher interest rates likely." },
  { min: 650, max: 749, label: "Good", color: "bg-yellow-500", desc: "Most loans available. Moderate interest rates." },
  { min: 750, max: 799, label: "Very Good", color: "bg-lime-500", desc: "Best interest rates on most products. Premium cards accessible." },
  { min: 800, max: 900, label: "Excellent", color: "bg-green-500", desc: "Best rates everywhere. All premium products available." },
];

const tips = [
  { title: "Pay Bills On Time", desc: "Payment history is 35% of your score. Set up auto-pay." },
  { title: "Keep Credit Utilization Below 30%", desc: "Don't use more than 30% of your credit limit." },
  { title: "Don't Close Old Cards", desc: "Length of credit history matters. Keep old accounts open." },
  { title: "Limit Hard Inquiries", desc: "Each credit application creates a hard inquiry. Space them out." },
  { title: "Check Your Report Regularly", desc: "Get free reports from CIBIL, Experian, or Equifax annually." },
  { title: "Mix of Credit Types", desc: "Having both secured and unsecured credit helps your score." },
];

const CreditScoreGuide = () => (
  <ToolLayout title="Credit Score Guide" description="Understand, check, and improve your credit score" icon={<Sparkles className="w-7 h-7 text-primary" />}>
    <div className="space-y-8">
      {/* Score ranges */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading font-bold text-lg mb-4">Credit Score Ranges (CIBIL)</h2>
        <div className="space-y-3">
          {ranges.map((r) => (
            <div key={r.label} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${r.color} shrink-0`} />
              <div className="w-20 font-semibold text-sm">{r.min}-{r.max}</div>
              <div className="w-20 text-sm font-medium">{r.label}</div>
              <div className="flex-1 text-xs text-muted-foreground">{r.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 h-4 rounded-full overflow-hidden flex">
          <div className="bg-red-500 flex-1" />
          <div className="bg-orange-500 flex-1" />
          <div className="bg-yellow-500 flex-1" />
          <div className="bg-lime-500 flex-1" />
          <div className="bg-green-500 flex-1" />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>300</span><span>550</span><span>650</span><span>750</span><span>800</span><span>900</span>
        </div>
      </div>

      {/* Tips */}
      <div>
        <h2 className="font-heading font-bold text-lg mb-4">6 Tips to Improve Your Score</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 card-hover">
              <div className="flex items-start gap-3">
                <span className="text-lg font-bold text-primary">{i + 1}</span>
                <div>
                  <p className="font-semibold text-sm text-foreground">{tip.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Where to check */}
      <div className="rounded-xl bg-secondary/50 p-5">
        <h3 className="font-semibold text-sm mb-2">📊 Where to Check Your Score (Free)</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• <strong>CIBIL</strong> — cibil.com (1 free report per year)</li>
          <li>• <strong>Experian</strong> — experian.in</li>
          <li>• <strong>Equifax</strong> — equifax.co.in</li>
          <li>• <strong>CRIF Highmark</strong> — crifhighmark.com</li>
        </ul>
      </div>
    </div>
  </ToolLayout>
);

export default CreditScoreGuide;
