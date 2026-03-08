import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, CreditCard, Landmark, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface CardResult {
  id: string;
  card_name: string;
  bank_name: string;
  annual_fee: number;
  cashback_rate: string;
  reward_points: string;
  welcome_bonus: string;
  rating: number;
  card_type: string;
  features: string[];
}

interface LoanResult {
  id: string;
  loan_name: string;
  bank_name: string;
  interest_rate: number;
  min_amount: number;
  max_amount: number;
  processing_fee: string;
  features: string[];
}

interface RecommendationResult {
  cards: CardResult[];
  loans: LoanResult[];
  explanation: string;
  ai_powered: boolean;
}

const EligibilityChecker = () => {
  const [age, setAge] = useState("");
  const [salary, setSalary] = useState("");
  const [employment, setEmployment] = useState("salaried");
  const [creditScore, setCreditScore] = useState("");
  const [spendingCategory, setSpendingCategory] = useState("general");
  const [results, setResults] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const checkEligibility = async () => {
    if (!age || !salary) {
      toast({ title: "Please fill in age and salary", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-recommend", {
        body: {
          salary: parseInt(salary),
          age: parseInt(age),
          employment_type: employment,
          credit_score: creditScore ? parseInt(creditScore) : null,
          spending_category: spendingCategory,
        },
      });

      if (error) throw error;
      setResults(data);
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to get recommendations", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Recommendations</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="text-gradient">Smart</span> Eligibility Checker
            </h1>
            <p className="text-muted-foreground">
              Get AI-powered recommendations for credit cards and loans based on your profile.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Age</label>
                <Input type="number" placeholder="e.g. 28" value={age} onChange={(e) => setAge(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Monthly Salary (₹)</label>
                <Input type="number" placeholder="e.g. 50000" value={salary} onChange={(e) => setSalary(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Employment Type</label>
                <div className="flex gap-3">
                  {["salaried", "self-employed", "student"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setEmployment(type)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                        employment === type ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Credit Score (optional)</label>
                <Input type="number" placeholder="e.g. 750" value={creditScore} onChange={(e) => setCreditScore(e.target.value)} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Primary Spending Category</label>
                <div className="flex flex-wrap gap-2">
                  {["general", "travel", "shopping", "dining", "fuel"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSpendingCategory(cat)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                        spendingCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={checkEligibility}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                disabled={!age || !salary || loading}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Get AI Recommendations</>
                )}
              </Button>
            </div>
          </motion.div>

          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
              {/* AI Explanation */}
              <div className={`rounded-xl border p-5 ${results.ai_powered ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className={`w-4 h-4 ${results.ai_powered ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-heading font-semibold text-foreground">
                    {results.ai_powered ? "AI Analysis" : "Recommendation"}
                  </span>
                  {results.ai_powered && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">AI Powered</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{results.explanation}</p>
              </div>

              {/* Credit Cards */}
              {results.cards.length > 0 && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                    Top {results.cards.length} Credit Cards for You
                  </h2>
                  <div className="space-y-3">
                    {results.cards.map((card, i) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-xl border border-border bg-card p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-heading font-semibold text-foreground text-sm">{card.card_name}</p>
                              <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full capitalize">{card.card_type}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{card.bank_name}</p>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                              <div>
                                <span className="text-muted-foreground">Fee</span>
                                <p className="font-medium text-foreground">{card.annual_fee === 0 ? "Free" : fmt(card.annual_fee)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Cashback</span>
                                <p className="font-medium text-primary">{card.cashback_rate}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Rating</span>
                                <p className="font-medium text-foreground">⭐ {card.rating}</p>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0">
                            Apply
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loans */}
              {results.loans.length > 0 && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                    Top {results.loans.length} Loans for You
                  </h2>
                  <div className="space-y-3">
                    {results.loans.map((loan, i) => (
                      <motion.div
                        key={loan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.3 }}
                        className="rounded-xl border border-border bg-card p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Landmark className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-foreground text-sm">{loan.loan_name}</p>
                            <p className="text-xs text-muted-foreground mb-2">{loan.bank_name}</p>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                              <div>
                                <span className="text-muted-foreground">Rate</span>
                                <p className="font-medium text-primary">{loan.interest_rate}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Amount</span>
                                <p className="font-medium text-foreground">{fmt(loan.min_amount)} - {fmt(loan.max_amount)}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Fee</span>
                                <p className="font-medium text-foreground">{loan.processing_fee}</p>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0">
                            Apply
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EligibilityChecker;
