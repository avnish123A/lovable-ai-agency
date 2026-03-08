import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BankLogo from "@/components/BankLogo";
import TrustBadge from "@/components/TrustBadge";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";
import SEOHead from "@/components/SEOHead";
import CategoryComingSoon from "@/components/CategoryComingSoon";
import { useCategoryComingSoon } from "@/hooks/useCategoryComingSoon";

const Loans = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isComingSoon } = useCategoryComingSoon("loans");

  useEffect(() => {
    const fetchLoans = async () => {
      const { data } = await supabase
        .from("loan_products")
        .select("*")
        .eq("is_active", true)
        .order("interest_rate", { ascending: true });
      setLoans(data || []);
      setLoading(false);
    };
    fetchLoans();
  }, []);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const handleApply = (loan: any) => {
    const dealLike = {
      id: loan.id,
      title: loan.loan_name,
      merchant: loan.bank_name,
      subcategory: "loans",
      tracking_link: loan.apply_link || null,
    };
    setSelectedLoan(dealLike);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setDialogOpen(false);
    setSelectedLoan(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Best Personal Loans in India 2026 – Compare Interest Rates | Kriyapay"
        description="Compare personal loans from HDFC, SBI, ICICI, Axis Bank & Bajaj Finserv. Check interest rates, EMI & eligibility. Apply online via Kriyapay."
        canonical="https://kriyapay.co.in/loans"
      />
      <Navbar />
      {isComingSoon ? (
        <CategoryComingSoon title="Loans" description="Best loan comparisons are coming soon!" />
      ) : (
      <>
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Compare <span className="text-gradient">Personal Loans</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">
              Find the best interest rates and get pre-approved for personal loans from top banks.
            </p>
            <div className="flex items-center justify-center gap-4">
              <TrustBadge variant="verified" />
              <TrustBadge variant="secure" />
            </div>
          </motion.div>

          <AffiliateDisclaimer variant="banner" className="mb-8" />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loans.map((loan, i) => (
                <motion.div
                  key={loan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-card shadow-card card-hover flex flex-col"
                >
                  {/* Bank header */}
                  <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div className="flex items-center gap-3">
                      <BankLogo bankName={loan.bank_name} size="md" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{loan.bank_name}</p>
                        <TrustBadge variant="partner" className="mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Product image or Interest rate highlight */}
                  {loan.image_url ? (
                    <div className="mx-6 mb-4">
                      <img src={loan.image_url} alt={loan.loan_name} className="w-full h-24 object-contain rounded-lg" />
                    </div>
                  ) : (
                    <div className="mx-6 mb-4 p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Starting Interest Rate</p>
                      <p className="text-3xl font-heading font-bold text-primary">{loan.interest_rate}%</p>
                      <p className="text-xs text-muted-foreground">per annum</p>
                    </div>
                  )}

                  <div className="px-6 pb-6 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-foreground text-base mb-4">{loan.loan_name}</h3>

                    <div className="space-y-2.5 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Loan Amount</span>
                        <span className="text-foreground font-medium">{fmt(loan.min_amount)} - {fmt(loan.max_amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Interest Rate</span>
                        <span className="text-primary font-semibold">{loan.interest_rate}% p.a.</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span className="text-foreground font-medium">{loan.processing_fee || "—"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tenure</span>
                        <span className="text-foreground font-medium">{loan.min_tenure} - {loan.max_tenure} months</span>
                      </div>
                    </div>

                    <div className="mb-5 space-y-1.5">
                      {(loan.features || []).slice(0, 3).map((f: string) => (
                        <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-border">
                      <Button 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                        onClick={() => handleApply(loan)}
                      >
                        Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <AffiliateDisclaimer variant="inline" className="mt-8" />
        </div>
      </section>
      <Footer />

      {/* Lead Capture Dialog */}
      <LeadCaptureDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        deal={selectedLoan}
        onSuccess={handleDialogSuccess}
      />
      </>
      )}
    </div>
  );
};

export default Loans;
