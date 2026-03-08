import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calculator, CreditCard, TrendingUp, PiggyBank, Target, Wallet,
  Building, Percent, LineChart, Landmark, Shield, Gift, Star, FileText,
  BadgeDollarSign, ArrowUpDown, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tools = [
  { icon: Calculator, title: "EMI Calculator", desc: "Calculate monthly installments for any loan", path: "/emi-calculator", color: "from-blue-500/15 to-indigo-500/15", iconColor: "text-blue-500" },
  { icon: Shield, title: "Loan Eligibility Checker", desc: "Check if you qualify for a loan", path: "/eligibility", color: "from-emerald-500/15 to-green-500/15", iconColor: "text-emerald-500" },
  { icon: CreditCard, title: "Credit Card Finder", desc: "AI finds the perfect card for you", path: "/tools/card-finder", color: "from-violet-500/15 to-purple-500/15", iconColor: "text-violet-500", ai: true },
  { icon: ArrowUpDown, title: "Credit Card Comparison", desc: "Compare cards side by side", path: "/compare", color: "from-cyan-500/15 to-blue-500/15", iconColor: "text-cyan-500" },
  { icon: Building, title: "Home Loan Calculator", desc: "Plan your dream home purchase", path: "/tools/home-loan", color: "from-amber-500/15 to-orange-500/15", iconColor: "text-amber-500" },
  { icon: Wallet, title: "Personal Loan Calculator", desc: "Estimate personal loan payments", path: "/tools/personal-loan", color: "from-rose-500/15 to-pink-500/15", iconColor: "text-rose-500" },
  { icon: TrendingUp, title: "Compound Interest", desc: "Watch your money grow over time", path: "/tools/compound-interest", color: "from-teal-500/15 to-emerald-500/15", iconColor: "text-teal-500" },
  { icon: Percent, title: "Interest Rate Calculator", desc: "Compare interest rates easily", path: "/tools/interest-rate", color: "from-sky-500/15 to-blue-500/15", iconColor: "text-sky-500" },
  { icon: PiggyBank, title: "Savings Calculator", desc: "Plan your savings journey", path: "/tools/savings", color: "from-green-500/15 to-lime-500/15", iconColor: "text-green-500" },
  { icon: LineChart, title: "Investment Return Calculator", desc: "Estimate returns on investments", path: "/tools/investment-return", color: "from-indigo-500/15 to-violet-500/15", iconColor: "text-indigo-500" },
  { icon: Target, title: "Financial Goal Planner", desc: "Plan and track financial goals", path: "/tools/goal-planner", color: "from-pink-500/15 to-rose-500/15", iconColor: "text-pink-500" },
  { icon: FileText, title: "Budget Planner", desc: "Create a monthly spending plan", path: "/tools/budget-planner", color: "from-orange-500/15 to-amber-500/15", iconColor: "text-orange-500" },
  { icon: BadgeDollarSign, title: "Debt Payoff Calculator", desc: "Plan your debt-free journey", path: "/tools/debt-payoff", color: "from-red-500/15 to-rose-500/15", iconColor: "text-red-500" },
  { icon: Landmark, title: "Tax Estimator", desc: "Estimate your income tax", path: "/tools/tax-estimator", color: "from-slate-500/15 to-gray-500/15", iconColor: "text-slate-500" },
  { icon: Sparkles, title: "Credit Score Guide", desc: "Understand and improve your score", path: "/tools/credit-score", color: "from-yellow-500/15 to-amber-500/15", iconColor: "text-yellow-500" },
  { icon: Gift, title: "Cashback Calculator", desc: "Maximize your cashback earnings", path: "/tools/cashback-calc", color: "from-emerald-500/15 to-teal-500/15", iconColor: "text-emerald-500" },
  { icon: Star, title: "Reward Points Calculator", desc: "Calculate reward points value", path: "/tools/reward-points", color: "from-purple-500/15 to-violet-500/15", iconColor: "text-purple-500" },
];

const FinanceTools = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Finance <span className="text-gradient">Power Tools</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            17+ interactive calculators and AI-powered tools to help you make smarter financial decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((t, i) => (
            <motion.div
              key={t.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={t.path}
                className={`group block rounded-2xl border border-border bg-gradient-to-br ${t.color} p-5 card-hover transition-all h-full`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-card/80 border border-border/50 flex items-center justify-center shrink-0 ${t.iconColor} group-hover:scale-110 transition-transform`}>
                    <t.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-1.5">
                      {t.title}
                      {t.ai && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-bold">AI</span>}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default FinanceTools;
