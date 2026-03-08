import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeDollarSign, CheckCircle2, ExternalLink, FileText, Shield, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";
import TrustBadge from "@/components/TrustBadge";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";
import { getBankLogo } from "@/lib/bank-utils";

const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leadOpen, setLeadOpen] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("finance_deals")
        .select("*")
        .eq("id", id)
        .single();
      setDeal(data);
      setLoading(false);
    };
    fetchDeal();
  }, [id]);

  const handleApply = () => {
    setLeadOpen(true);
  };

  const handleLeadSuccess = () => {
    if (deal) {
      supabase.functions.invoke("track-click", { body: { deal_id: deal.id } }).catch(() => {});
    }
  };

  const logoUrl = deal?.merchant ? getBankLogo(deal.merchant) : null;

  const renderSection = (icon: React.ReactNode, title: string, content: string | null) => {
    if (!content) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="text-lg font-heading font-semibold text-foreground">{title}</h2>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <Link to="/finance-deals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to All Deals
          </Link>

          {loading ? (
            <div className="space-y-6">
              <div className="h-48 rounded-2xl bg-card border border-border animate-pulse" />
              <div className="h-32 rounded-2xl bg-card border border-border animate-pulse" />
            </div>
          ) : !deal ? (
            <div className="text-center py-20">
              <BadgeDollarSign className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-semibold mb-2">Deal not found</h2>
              <Button asChild variant="outline" className="rounded-xl mt-4">
                <Link to="/finance-deals">Browse All Deals</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Hero Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card shadow-card p-8"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt={deal.merchant} className="w-12 h-12 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <BadgeDollarSign className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <TrustBadge variant="verified" />
                      <span className="text-xs text-muted-foreground capitalize">{(deal.subcategory || "finance").replace("_", " ")}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">{deal.title}</h1>
                    <p className="text-muted-foreground text-sm mb-4">{deal.merchant}</p>

                    <div className="flex flex-wrap gap-4 mb-6">
                      {deal.cashback && (
                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-semibold">
                          Reward: {deal.cashback}
                        </div>
                      )}
                      {deal.expiry_date && (
                        <div className="bg-secondary text-foreground px-4 py-2 rounded-xl text-sm">
                          Valid till: {new Date(deal.expiry_date).toLocaleDateString("en-IN")}
                        </div>
                      )}
                    </div>

                    <Button onClick={handleApply} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                      Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              <AffiliateDisclaimer variant="banner" />

              {/* AI Description */}
              {deal.ai_description && renderSection(
                <Sparkles className="w-5 h-5 text-accent" />,
                "AI Summary",
                deal.ai_description
              )}

              {/* Description */}
              {deal.description && !deal.ai_description && renderSection(
                <FileText className="w-5 h-5 text-primary" />,
                "Product Overview",
                deal.description.replace(/<[^>]*>/g, "")
              )}

              {/* Benefits */}
              {renderSection(
                <CheckCircle2 className="w-5 h-5 text-green-500" />,
                "Key Benefits",
                deal.ai_benefits
              )}

              {/* Eligibility */}
              {renderSection(
                <Users className="w-5 h-5 text-blue-500" />,
                "Eligibility Requirements",
                deal.ai_eligibility
              )}

              {/* Terms */}
              {renderSection(
                <Shield className="w-5 h-5 text-orange-500" />,
                "Terms & Conditions",
                deal.ai_terms
              )}

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <h3 className="text-lg font-heading font-semibold mb-2">Interested in this offer?</h3>
                <p className="text-sm text-muted-foreground mb-4">Apply now and our team will connect you with the best deal.</p>
                <Button onClick={handleApply} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                  Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>

              <AffiliateDisclaimer variant="inline" />
            </div>
          )}
        </div>
      </section>
      <Footer />

      <LeadCaptureDialog
        open={leadOpen}
        onOpenChange={setLeadOpen}
        deal={deal}
        onSuccess={handleLeadSuccess}
      />
    </div>
  );
};

export default DealDetail;
