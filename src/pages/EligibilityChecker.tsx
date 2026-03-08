import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, CreditCard, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Result {
  name: string;
  type: "card" | "loan";
  reason: string;
}

const EligibilityChecker = () => {
  const [age, setAge] = useState("");
  const [salary, setSalary] = useState("");
  const [employment, setEmployment] = useState("salaried");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);

  const checkEligibility = () => {
    const ageNum = parseInt(age);
    const salaryNum = parseInt(salary);
    const eligible: Result[] = [];

    if (ageNum >= 21 && salaryNum >= 25000) {
      eligible.push({ name: "Axis Ace Credit Card", type: "card", reason: "No annual fee, great cashback" });
    }
    if (ageNum >= 21 && salaryNum >= 35000) {
      eligible.push({ name: "HDFC Platinum Rewards", type: "card", reason: "Premium rewards & lounge access" });
      eligible.push({ name: "SBI SimplyCLICK Card", type: "card", reason: "Best for online shopping" });
    }
    if (ageNum >= 21 && salaryNum >= 50000) {
      eligible.push({ name: "HDFC Infinia Card", type: "card", reason: "Ultra-premium benefits" });
    }
    if (ageNum >= 23 && salaryNum >= 20000 && employment === "salaried") {
      eligible.push({ name: "SBI Personal Loan", type: "loan", reason: "Low interest from 11%" });
    }
    if (ageNum >= 21 && salaryNum >= 30000) {
      eligible.push({ name: "HDFC Personal Loan", type: "loan", reason: "Quick disbursal, flexible EMI" });
    }
    if (eligible.length === 0) {
      eligible.push({ name: "Secured Credit Card", type: "card", reason: "Build your credit with a fixed deposit backed card" });
    }

    setResults(eligible);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="text-gradient">Eligibility</span> Checker
            </h1>
            <p className="text-muted-foreground">Check which credit cards and loans you're eligible for — instantly.</p>
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
                <Input
                  type="number"
                  placeholder="e.g. 28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Monthly Salary (₹)</label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Employment Type</label>
                <div className="flex gap-3">
                  {["salaried", "self-employed", "student"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setEmployment(type)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                        employment === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">City</label>
                <Input
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>

              <Button
                onClick={checkEligibility}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                disabled={!age || !salary}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Check Eligibility
              </Button>
            </div>
          </motion.div>

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              <h2 className="text-xl font-heading font-bold text-foreground">
                You're eligible for {results.length} product{results.length !== 1 ? "s" : ""}
              </h2>
              {results.map((r, i) => (
                <motion.div
                  key={r.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-border bg-card p-5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {r.type === "card" ? (
                      <CreditCard className="w-5 h-5 text-primary" />
                    ) : (
                      <Landmark className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-semibold text-foreground text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.reason}</p>
                  </div>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Apply
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EligibilityChecker;
