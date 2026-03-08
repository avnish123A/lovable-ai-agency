import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EMICalculator = () => {
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

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              <span className="text-gradient">EMI</span> Calculator
            </h1>
            <p className="text-muted-foreground">Plan your loan repayment with our easy-to-use calculator.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-8"
          >
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Loan Amount</label>
                  <span className="text-sm text-primary font-semibold">{fmt(amount)}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={5000000}
                  step={10000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹50K</span>
                  <span>₹50L</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Interest Rate (% p.a.)</label>
                  <span className="text-sm text-primary font-semibold">{rate}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={0.25}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Loan Tenure (months)</label>
                  <span className="text-sm text-primary font-semibold">{tenure} months</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={84}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>6 mo</span>
                  <span>84 mo</span>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Monthly EMI", value: fmt(result.emi), highlight: true },
                { label: "Total Interest", value: fmt(result.totalInterest) },
                { label: "Total Payment", value: fmt(result.totalPayment) },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-lg p-5 text-center ${
                    item.highlight ? "bg-primary/10 border border-primary/20" : "bg-secondary"
                  }`}
                >
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-xl font-heading font-bold ${item.highlight ? "text-primary" : "text-foreground"}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EMICalculator;
