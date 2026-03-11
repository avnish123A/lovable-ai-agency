import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Landmark, Shield, TrendingUp, PiggyBank, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const productOptions = [
  { id: "credit-cards", label: "Credit Card", desc: "Rewards, cashback & travel", icon: CreditCard, route: "/credit-cards" },
  { id: "loans", label: "Personal Loan", desc: "Low interest, quick approval", icon: Landmark, route: "/loans" },
  { id: "insurance", label: "Insurance", desc: "Life, health & motor cover", icon: Shield, route: "/insurance" },
  { id: "investments", label: "Investments", desc: "FDs, demat & mutual funds", icon: TrendingUp, route: "/demat-accounts" },
  { id: "savings", label: "Savings Account", desc: "High interest, zero balance", icon: PiggyBank, route: "/bank-accounts" },
];

const incomeRanges = [
  "Below ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000 – ₹2,50,000",
  "Above ₹2,50,000",
];

const stepLabels = ["Choose Product", "Your Income", "Your Name"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
};

const InteractiveWizard = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selected, setSelected] = useState("");
  const [income, setIncome] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const progress = ((step + 1) / stepLabels.length) * 100;

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, stepLabels.length - 1));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleFinish = () => {
    const product = productOptions.find((p) => p.id === selected);
    if (product) navigate(product.route);
  };

  const canProceed =
    (step === 0 && selected) ||
    (step === 1 && income) ||
    (step === 2 && name.trim().length >= 2);

  return (
    <section className="py-24 relative overflow-hidden" id="wizard">
      {/* Neon glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Smart Product Finder
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mb-4">
            Let's Find Your <span className="text-gradient text-glow">Perfect Match</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Answer 3 quick questions and we'll recommend the best financial products for you.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-3">
              {stepLabels.map((label, i) => (
                <span key={label} className={`font-medium transition-colors ${i <= step ? "text-primary" : ""}`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4 inline mr-1" /> : null}
                  {label}
                </span>
              ))}
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-cta rounded-full shadow-glow-sm"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Wizard card */}
          <div className="glass-card rounded-3xl p-8 md:p-10 border-glow min-h-[380px] flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 0 && (
                <motion.div
                  key="step-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    What are you looking for today?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">Choose one to get started</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productOptions.map((opt) => (
                      <motion.button
                        key={opt.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelected(opt.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 ${
                          selected === opt.id
                            ? "border-primary/50 bg-primary/10 shadow-neon"
                            : "border-border bg-muted/30 hover:border-primary/20 hover:bg-muted/50"
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          selected === opt.id ? "bg-gradient-cta" : "bg-muted"
                        }`}>
                          <opt.icon className={`w-5 h-5 ${selected === opt.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${selected === opt.id ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                          <p className="text-xs text-muted-foreground">{opt.desc}</p>
                        </div>
                        {selected === opt.id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    What is your monthly income?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">This helps us filter the best options</p>
                  <div className="grid grid-cols-1 gap-3">
                    {incomeRanges.map((range) => (
                      <motion.button
                        key={range}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIncome(range)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between ${
                          income === range
                            ? "border-primary/50 bg-primary/10 shadow-neon"
                            : "border-border bg-muted/30 hover:border-primary/20"
                        }`}
                      >
                        <span className={`font-medium text-sm ${income === range ? "text-primary" : "text-foreground"}`}>{range}</span>
                        {income === range && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Almost done! What's your name?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">We'll personalize your results</p>
                  <div className="space-y-4">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-14 rounded-2xl bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 text-base"
                    />
                    {name.trim().length >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-primary/5 border border-primary/20"
                      >
                        <p className="text-sm text-primary font-medium">
                          <Sparkles className="w-4 h-4 inline mr-1.5" />
                          Hey {name.split(" ")[0]}! We'll show you the best{" "}
                          {productOptions.find((p) => p.id === selected)?.label || "products"} for {income || "your range"}.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={goBack}
                disabled={step === 0}
                className="text-muted-foreground hover:text-foreground rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {step < stepLabels.length - 1 ? (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={goNext}
                    disabled={!canProceed}
                    className="bg-gradient-cta text-primary-foreground rounded-xl px-8 h-12 font-bold btn-neon disabled:opacity-40"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handleFinish}
                    disabled={!canProceed}
                    className="bg-gradient-cta text-primary-foreground rounded-xl px-8 h-12 font-bold btn-neon disabled:opacity-40"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Show My Results
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveWizard;
