import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Landmark, Shield, TrendingUp, PiggyBank, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
};

const InteractiveWizard = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selected, setSelected] = useState("");
  const [income, setIncome] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const progress = ((step + 1) / stepLabels.length) * 100;

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, stepLabels.length - 1)); };
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  const handleFinish = () => {
    const product = productOptions.find(p => p.id === selected);
    if (product) navigate(product.route);
  };

  const canProceed =
    (step === 0 && selected) ||
    (step === 1 && income) ||
    (step === 2 && name.trim().length >= 2);

  return (
    <section className="py-28 relative overflow-hidden" id="wizard">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-border" />
            <span className="text-sm font-body font-medium tracking-widest uppercase text-muted-foreground">Product Finder</span>
            <div className="h-px w-12 bg-border" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground tracking-tight mb-4">
            Let's Find Your <em className="text-gradient not-italic">Perfect Match</em>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Answer 3 quick questions — we'll recommend the best financial products for you.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-3 font-medium">
              {stepLabels.map((label, i) => (
                <span key={label} className={`transition-colors duration-500 ${i <= step ? "text-foreground" : ""}`}>
                  {i < step ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-primary" /> : null}
                  {label}
                </span>
              ))}
            </div>
            <div className="h-1 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full bg-gradient-cta rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* Wizard card */}
          <div className="rounded-2xl bg-card border border-border p-8 md:p-10 shadow-card min-h-[380px] flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 0 && (
                <motion.div
                  key="step-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    What are you looking for today?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">Choose one to get started</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productOptions.map(opt => (
                      <motion.button
                        key={opt.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelected(opt.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-500 ease-luxury ${
                          selected === opt.id
                            ? "border-primary/50 bg-primary/10"
                            : "border-border bg-background hover:border-primary/20"
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          selected === opt.id ? "bg-gradient-cta" : "bg-secondary"
                        }`}>
                          <opt.icon className={`w-5 h-5 ${selected === opt.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${selected === opt.id ? "text-foreground" : "text-foreground"}`}>{opt.label}</p>
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
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    What is your monthly income?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">This helps us filter the best options</p>
                  <div className="grid grid-cols-1 gap-3">
                    {incomeRanges.map(range => (
                      <motion.button
                        key={range}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIncome(range)}
                        className={`p-4 rounded-xl border text-left transition-all duration-500 ease-luxury flex items-center justify-between ${
                          income === range
                            ? "border-primary/50 bg-primary/10"
                            : "border-border bg-background hover:border-primary/20"
                        }`}
                      >
                        <span className={`font-mono text-sm font-medium ${income === range ? "text-foreground" : "text-foreground"}`}>{range}</span>
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
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1"
                >
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Almost done! What's your name?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">We'll personalize your results</p>
                  <div className="space-y-4">
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-14 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 text-base"
                    />
                    {name.trim().length >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ease: [0.16, 1, 0.3, 1] }}
                        className="p-4 rounded-xl bg-primary/5 border border-primary/15"
                      >
                        <p className="text-sm text-foreground font-medium">
                          Hey <span className="font-mono">{name.split(" ")[0]}</span>! We'll show you the best{" "}
                          {productOptions.find(p => p.id === selected)?.label || "products"} for <span className="font-mono">{income || "your range"}</span>.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={goBack}
                disabled={step === 0}
                className="text-muted-foreground hover:text-foreground rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {step < stepLabels.length - 1 ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={goNext}
                    disabled={!canProceed}
                    className="bg-gradient-cta text-primary-foreground rounded-lg px-8 h-12 font-bold btn-neon disabled:opacity-40"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleFinish}
                    disabled={!canProceed}
                    className="bg-gradient-cta text-primary-foreground rounded-lg px-8 h-12 font-bold btn-neon disabled:opacity-40"
                  >
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
