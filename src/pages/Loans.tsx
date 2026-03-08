import { motion } from "framer-motion";
import { Landmark, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const loans = [
  {
    name: "Personal Loan",
    bank: "HDFC Bank",
    interest: "10.50%",
    amount: "₹50K - ₹40L",
    processing: "Up to 2%",
    tenure: "12 - 60 months",
    features: ["Instant Approval", "No Collateral", "Flexible EMI"],
  },
  {
    name: "Personal Loan",
    bank: "SBI",
    interest: "11.00%",
    amount: "₹1L - ₹20L",
    processing: "1% - 2%",
    tenure: "12 - 72 months",
    features: ["Low Interest", "Minimal Docs", "Quick Disbursal"],
  },
  {
    name: "Insta Loan",
    bank: "ICICI Bank",
    interest: "10.75%",
    amount: "₹50K - ₹25L",
    processing: "Up to 2.5%",
    tenure: "12 - 60 months",
    features: ["Pre-Approved", "Digital Process", "No Branch Visit"],
  },
  {
    name: "Personal Loan",
    bank: "Axis Bank",
    interest: "10.49%",
    amount: "₹50K - ₹15L",
    processing: "1% - 2%",
    tenure: "12 - 60 months",
    features: ["Competitive Rate", "Part Payment", "Top-Up Available"],
  },
  {
    name: "Flexi Loan",
    bank: "Bajaj Finserv",
    interest: "11.00%",
    amount: "₹1L - ₹35L",
    processing: "Up to 3%",
    tenure: "12 - 84 months",
    features: ["Withdraw Anytime", "Pay Interest Only", "No Foreclosure"],
  },
  {
    name: "Digital Loan",
    bank: "Kotak Bank",
    interest: "10.99%",
    amount: "₹50K - ₹40L",
    processing: "Up to 2.5%",
    tenure: "12 - 60 months",
    features: ["100% Digital", "Same Day Disbursal", "Flexible Tenure"],
  },
];

const Loans = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Compare <span className="text-gradient">Personal Loans</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find the best interest rates and get pre-approved for personal loans from top banks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan, i) => (
              <motion.div
                key={loan.bank + loan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-6 card-hover flex flex-col"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Landmark className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">{loan.name}</h3>
                    <p className="text-xs text-muted-foreground">{loan.bank}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Interest Rate</span>
                    <span className="text-primary font-semibold">{loan.interest}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Loan Amount</span>
                    <span className="text-foreground font-medium">{loan.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="text-foreground font-medium">{loan.processing}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tenure</span>
                    <span className="text-foreground font-medium">{loan.tenure}</span>
                  </div>
                </div>

                <div className="mb-5 space-y-2">
                  {loan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary" />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Apply Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Loans;
