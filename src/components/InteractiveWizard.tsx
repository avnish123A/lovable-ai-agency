import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Landmark, Shield, TrendingUp, PiggyBank, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="tag-mono mb-6 inline-block">PRODUCT FINDER</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground tracking-tight mb-4">
            Let's Find Your <em className="not-italic font-heading italic text-gradient">Perfect Match</em>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Answer 3 quick questions — we'll recommend the best financial products for you.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-muted-foreground mb-3">
              {stepLabels.map((label, i) => (
                <span key={label} className={`font-mono text-[10px] font-bold tracking-[0.1em] uppercase transition-colors duration-500 ${i <= step ? "text-foreground" : ""}`}>
                  {i < step ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-primary" /> : null}
                  {label}
                </span>
              ))}
            </div>
            <div className="h-1 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* Wizard card — bento style */}
          <div className="bento-card p-8 md:p-10 min-h-[380px] flex flex-col">
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
                  <p className="text-sm text-muted-foreground mb-6 font-body">Choose one to get started</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelected(opt.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 ease-luxury ${
                          selected === opt.id
                            ? "border-foreground bg-primary/10 shadow-brutal-sm"
                            : "border-border bg-background hover:border-foreground/20"
                        }`}
                        style={selected === opt.id ? { boxShadow: '2px 2px 0px hsl(150 54% 7%)' } : {}}
                      >
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          selected === opt.id ? "bg-primary" : "bg-secondary"
                        }`}>
                          <opt.icon className={`w-5 h-5 ${selected === opt.id ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground font-body">{opt.label}</p>
                          <p className="text-xs text-muted-foreground font-body">{opt.desc}</p>
                        </div>
                        {selected === opt.id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </motion.div>
                        )}
                      </button>
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
                  <p className="text-sm text-muted-foreground mb-6 font-body">This helps us filter the best options</p>
                  <div className="grid grid-cols-1 gap-3">
                    {incomeRanges.map(range => (
                      <button
                        key={range}
                        onClick={() => setIncome(range)}
                        className={`p-4 rounded-xl border text-left transition-all duration-300 ease-luxury flex items-center justify-between ${
                          income === range
                            ? "border-foreground bg-primary/10"
                            : "border-border bg-background hover:border-foreground/20"
                        }`}
                        style={income === range ? { boxShadow: '2px 2px 0px hsl(150 54% 7%)' } : {}}
                      >
                        <span className="font-mono text-sm font-medium text-foreground">{range}</span>
                        {income === range && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </motion.div>
                        )}
                      </button>
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
                  <p className="text-sm text-muted-foreground mb-6 font-body">We'll personalize your results</p>
                  <div className="space-y-4">
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-14 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-foreground/10 text-base font-body"
                    />
                    {name.trim().length >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ease: [0.16, 1, 0.3, 1] }}
                        className="p-4 rounded-xl bg-primary/5 border border-primary/20"
                      >
                        <p className="text-sm text-foreground font-body">
                          Hey <span className="font-mono font-bold">{name.split(" ")[0]}</span>! We'll show you the best{" "}
                          {productOptions.find(p => p.id === selected)?.label || "products"} for <span className="font-mono font-bold">{income || "your range"}</span>.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="text-muted-foreground hover:text-foreground text-sm font-medium font-body inline-flex items-center gap-2 disabled:opacity-30 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              {step < stepLabels.length - 1 ? (
                <button
                  onClick={goNext}
                  disabled={!canProceed}
                  className="btn-brutal px-8 py-3 rounded-lg text-sm inline-flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={!canProceed}
                  className="btn-brutal px-8 py-3 rounded-lg text-sm inline-flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
                >
                  Show My Results
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveWizard;
