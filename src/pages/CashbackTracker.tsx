import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Clock, CheckCircle2, XCircle, IndianRupee, Calendar, Phone, Mail, Hash, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface TrackedRequest {
  id: string;
  user_name: string;
  email: string;
  phone: string;
  upi_id: string;
  tracking_id: string;
  status: string;
  cashback_amount: string | null;
  created_at: string;
  approved_at: string | null;
  paid_at: string | null;
  deal: {
    merchant_name: string;
    offer_title: string;
    cashback_amount: string;
    merchant_logo: string | null;
  } | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
  approved: { label: "Approved", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
  paid: { label: "Paid", color: "bg-primary/10 text-primary border-primary/20", icon: IndianRupee },
};

const CashbackTracker = () => {
  const [upiId, setUpiId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState<TrackedRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const trimmed = upiId.trim();
    if (!trimmed) {
      setError("Please enter your UPI ID");
      return;
    }
    if (!trimmed.includes("@")) {
      setError("Please enter a valid UPI ID (e.g. name@upi)");
      return;
    }

    setError("");
    setLoading(true);
    setSearched(true);

    let query = supabase
      .from("cashback_requests")
      .select("*, cashback_deals(merchant_name, offer_title, cashback_amount, merchant_logo)")
      .eq("upi_id", trimmed)
      .order("created_at", { ascending: false });

    if (fromDate) {
      query = query.gte("created_at", new Date(fromDate).toISOString());
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      query = query.lte("created_at", end.toISOString());
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError("Something went wrong. Please try again.");
      setResults([]);
    } else {
      setResults(
        (data || []).map((r: any) => ({
          ...r,
          deal: r.cashback_deals || null,
        }))
      );
    }
    setLoading(false);
  };

  const stats = {
    total: results.length,
    pending: results.filter(r => r.status === "pending").length,
    approved: results.filter(r => r.status === "approved").length,
    paid: results.filter(r => r.status === "paid").length,
    totalEarned: results
      .filter(r => r.status === "paid" || r.status === "approved")
      .reduce((sum, r) => {
        const amt = r.cashback_amount || r.deal?.cashback_amount || "0";
        const num = parseFloat(amt.replace(/[^\d.]/g, ""));
        return sum + (isNaN(num) ? 0 : num);
      }, 0),
  };

  return (
    <>
      <SEOHead title="Track Your Cashback | ApniNivesh" description="Track your cashback status using your UPI ID. View pending, approved, and paid cashback rewards." />
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
                <ShieldCheck className="w-4 h-4" /> Secure Cashback Tracking
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4 tracking-tight">
                Track Your <span className="text-primary">Cashback</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Enter your UPI ID to check the status of all your cashback requests — no login required.
              </p>

              {/* Search Form */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="grid gap-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Enter your UPI ID (e.g. name@ybl)"
                        value={upiId}
                        onChange={e => { setUpiId(e.target.value); setError(""); }}
                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                        className="pl-12 h-12 rounded-xl border-border bg-background text-base"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block text-left">From Date</label>
                        <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="rounded-xl border-border bg-background" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block text-left">To Date</label>
                        <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="rounded-xl border-border bg-background" />
                      </div>
                    </div>
                    {error && <p className="text-sm text-destructive text-left">{error}</p>}
                    <Button onClick={handleSearch} disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-base">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
                      Track Cashback
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results */}
        {searched && !loading && (
          <section className="pb-16">
            <div className="container mx-auto px-4">
              {results.length > 0 ? (
                <>
                  {/* Stats */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {[
                      { label: "Total Requests", value: stats.total, color: "text-foreground" },
                      { label: "Pending", value: stats.pending, color: "text-yellow-600" },
                      { label: "Approved", value: stats.approved, color: "text-emerald-600" },
                      { label: "Paid", value: stats.paid, color: "text-primary" },
                      { label: "Total Earned", value: `₹${stats.totalEarned.toFixed(0)}`, color: "text-primary" },
                    ].map(s => (
                      <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                      </div>
                    ))}
                  </motion.div>

                  {/* Request cards */}
                  <div className="space-y-4">
                    <AnimatePresence>
                      {results.map((req, i) => {
                        const sc = statusConfig[req.status] || statusConfig.pending;
                        const StatusIcon = sc.icon;
                        return (
                          <motion.div
                            key={req.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              {/* Merchant info */}
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {req.deal?.merchant_logo ? (
                                  <img src={req.deal.merchant_logo} alt={req.deal.merchant_name} className="w-12 h-12 rounded-xl object-contain bg-muted p-1" />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-lg font-bold text-primary">{req.deal?.merchant_name?.[0] || "?"}</span>
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-foreground truncate">{req.deal?.merchant_name || "Unknown Merchant"}</h3>
                                  <p className="text-sm text-muted-foreground truncate">{req.deal?.offer_title || "Cashback Deal"}</p>
                                </div>
                              </div>

                              {/* Status & Amount */}
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className={`${sc.color} gap-1`}>
                                  <StatusIcon className="w-3 h-3" /> {sc.label}
                                </Badge>
                                <span className="font-bold text-foreground">
                                  {req.cashback_amount || req.deal?.cashback_amount || "—"}
                                </span>
                              </div>
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
                              <div className="flex items-center gap-2 text-sm">
                                <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground truncate" title={req.tracking_id}>{req.tracking_id}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">{new Date(req.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground truncate">{req.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">{req.phone}</span>
                              </div>
                            </div>

                            {/* Timeline */}
                            {(req.approved_at || req.paid_at) && (
                              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground flex-wrap">
                                <span>Submitted: {new Date(req.created_at).toLocaleDateString("en-IN")}</span>
                                {req.approved_at && (
                                  <>
                                    <ArrowRight className="w-3 h-3" />
                                    <span className="text-emerald-600">Approved: {new Date(req.approved_at).toLocaleDateString("en-IN")}</span>
                                  </>
                                )}
                                {req.paid_at && (
                                  <>
                                    <ArrowRight className="w-3 h-3" />
                                    <span className="text-primary">Paid: {new Date(req.paid_at).toLocaleDateString("en-IN")}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No cashback requests found</h3>
                  <p className="text-muted-foreground mb-4">We couldn't find any requests for this UPI ID. Make sure you entered the same UPI ID used while claiming.</p>
                  <Button asChild variant="outline" className="rounded-xl">
                    <a href="/cashback">Browse Cashback Deals</a>
                  </Button>
                </motion.div>
              )}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CashbackTracker;
