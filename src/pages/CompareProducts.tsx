import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Plus, X, Check, Star, CreditCard, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BankLogo from "@/components/BankLogo";
import CreditCardVisual from "@/components/CreditCardVisual";
import TrustBadge from "@/components/TrustBadge";

type CompareType = "credit_cards" | "loans";

const CompareProducts = () => {
  const [type, setType] = useState<CompareType>("credit_cards");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [selectorOpen, setSelectorOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setSelected([]);
      if (type === "credit_cards") {
        const { data } = await supabase.from("credit_cards").select("*").eq("is_active", true).order("rating", { ascending: false });
        setAllProducts(data || []);
      } else {
        const { data } = await supabase.from("loan_products").select("*").eq("is_active", true).order("interest_rate", { ascending: true });
        setAllProducts(data || []);
      }
      setLoading(false);
    };
    fetch();
  }, [type]);

  const addProduct = (product: any, slot: number) => {
    setSelected((prev) => {
      const next = [...prev];
      next[slot] = product;
      return next;
    });
    setSelectorOpen(null);
  };

  const removeProduct = (slot: number) => {
    setSelected((prev) => prev.filter((_, i) => i !== slot));
  };

  const fmt = (n: number) => (n === 0 ? "Free" : `₹${n.toLocaleString("en-IN")}`);

  const selectedIds = selected.map((p) => p?.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Compare <span className="text-gradient">Products</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Compare credit cards and loans side-by-side to find the perfect fit for your needs.
            </p>
            <div className="flex items-center justify-center gap-3">
              <TrustBadge variant="verified" />
              <TrustBadge variant="secure" />
            </div>
          </motion.div>

          {/* Type toggle */}
          <div className="flex justify-center gap-3 mb-10">
            <button
              onClick={() => setType("credit_cards")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                type === "credit_cards"
                  ? "bg-primary text-primary-foreground shadow-glow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCard className="w-4 h-4" /> Credit Cards
            </button>
            <button
              onClick={() => setType("loans")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                type === "loans"
                  ? "bg-primary text-primary-foreground shadow-glow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Landmark className="w-4 h-4" /> Personal Loans
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-72 h-96 rounded-2xl border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Comparison slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[0, 1, 2].map((slot) => {
                  const product = selected[slot];

                  if (!product) {
                    return (
                      <motion.div
                        key={`empty-${slot}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-2xl border-2 border-dashed border-border bg-card/50 min-h-[400px] flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-colors"
                        onClick={() => setSelectorOpen(slot)}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mb-4">
                          <Plus className="w-7 h-7 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">Add {type === "credit_cards" ? "Credit Card" : "Loan"}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Click to select</p>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative rounded-2xl border border-border bg-card shadow-card overflow-hidden"
                    >
                      <button
                        onClick={() => removeProduct(slot)}
                        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </button>

                      {/* Header */}
                      <div className="flex items-center gap-2.5 px-5 pt-5 pb-2">
                        <BankLogo bankName={product.bank_name} size="sm" />
                        <span className="text-xs font-semibold text-foreground">{product.bank_name}</span>
                      </div>

                      {type === "credit_cards" && (
                        <div className="px-5 py-2">
                          <CreditCardVisual bankName={product.bank_name} cardName={product.card_name} />
                        </div>
                      )}

                      {type === "loans" && (
                        <div className="mx-5 my-3 p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                          <p className="text-3xl font-heading font-bold text-primary">{product.interest_rate}%</p>
                        </div>
                      )}

                      <div className="px-5 pb-5">
                        <h3 className="font-heading font-bold text-foreground text-sm mb-3">
                          {type === "credit_cards" ? product.card_name : product.loan_name}
                        </h3>

                        {type === "credit_cards" ? (
                          <div className="space-y-2">
                            <Row label="Annual Fee" value={fmt(product.annual_fee)} />
                            <Row label="Joining Fee" value={fmt(product.joining_fee)} />
                            <Row label="Welcome Bonus" value={product.welcome_bonus || "—"} />
                            <Row label="Cashback" value={product.cashback_rate || "—"} highlight />
                            <Row label="Rewards" value={product.reward_points || "—"} />
                            <Row label="Rating" value={product.rating ? `${product.rating}/5` : "—"} />
                            <Row label="Min Salary" value={product.min_salary ? fmt(product.min_salary) : "—"} />
                            <Row label="Min Age" value={product.min_age ? `${product.min_age}+` : "—"} />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Row label="Min Amount" value={fmt(product.min_amount)} />
                            <Row label="Max Amount" value={fmt(product.max_amount)} />
                            <Row label="Processing Fee" value={product.processing_fee || "—"} />
                            <Row label="Tenure" value={`${product.min_tenure}-${product.max_tenure} mo`} />
                            <Row label="Min Salary" value={product.min_salary ? fmt(product.min_salary) : "—"} />
                            <Row label="Min Age" value={product.min_age ? `${product.min_age}+` : "—"} />
                          </div>
                        )}

                        {/* Features */}
                        {(product.features || []).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                            {(product.features || []).slice(0, 3).map((f: string) => (
                              <div key={f} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <Check className="w-3 h-3 text-accent shrink-0" />
                                <span className="line-clamp-1">{f}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl" size="sm">
                          Apply Now
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Product selector modal */}
              {selectorOpen !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setSelectorOpen(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl shadow-elegant w-full max-w-lg max-h-[70vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                      <h3 className="font-heading font-bold text-foreground">
                        Select {type === "credit_cards" ? "Credit Card" : "Loan"}
                      </h3>
                      <button onClick={() => setSelectorOpen(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="overflow-y-auto max-h-[55vh] p-4 space-y-2">
                      {allProducts
                        .filter((p) => !selectedIds.includes(p.id))
                        .map((product) => (
                          <button
                            key={product.id}
                            onClick={() => addProduct(product, selectorOpen)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                          >
                            <BankLogo bankName={product.bank_name} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {type === "credit_cards" ? product.card_name : product.loan_name}
                              </p>
                              <p className="text-xs text-muted-foreground">{product.bank_name}</p>
                            </div>
                            {type === "credit_cards" && product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-primary fill-primary" />
                                <span className="text-xs font-medium text-foreground">{product.rating}</span>
                              </div>
                            )}
                            {type === "loans" && (
                              <span className="text-xs font-semibold text-primary">{product.interest_rate}%</span>
                            )}
                          </button>
                        ))}
                      {allProducts.filter((p) => !selectedIds.includes(p.id)).length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-8">No more products available to compare.</p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {selected.length === 0 && (
                <div className="text-center py-8">
                  <ArrowLeftRight className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Select products above to start comparing</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

const Row = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between text-xs">
    <span className="text-muted-foreground">{label}</span>
    <span className={`font-medium ${highlight ? "text-primary" : "text-foreground"}`}>{value}</span>
  </div>
);

export default CompareProducts;
