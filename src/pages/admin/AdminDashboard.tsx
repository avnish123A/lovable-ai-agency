import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, MessageSquare, TrendingUp, Gift, RefreshCw, Shield, Landmark, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface Stats {
  totalCards: number; totalLoans: number; totalInsurance: number;
  totalBankAccounts: number; totalDemat: number; totalFD: number;
  totalLeads: number; totalMessages: number; totalCashback: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalCards: 0, totalLoans: 0, totalInsurance: 0, totalBankAccounts: 0,
    totalDemat: 0, totalFD: 0, totalLeads: 0, totalMessages: 0, totalCashback: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  const fetchStats = useCallback(async () => {
    const [cards, loans, insurance, bankAcc, demat, fd, leads, messages, cashback] = await Promise.all([
      supabase.from("credit_cards").select("id", { count: "exact", head: true }),
      supabase.from("loan_products").select("id", { count: "exact", head: true }),
      supabase.from("insurance_products").select("id", { count: "exact", head: true }),
      supabase.from("bank_accounts").select("id", { count: "exact", head: true }),
      supabase.from("demat_accounts").select("id", { count: "exact", head: true }),
      supabase.from("fixed_deposits").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      supabase.from("cashback_offers").select("id", { count: "exact", head: true }),
    ]);
    setStats({
      totalCards: cards.count ?? 0, totalLoans: loans.count ?? 0,
      totalInsurance: insurance.count ?? 0, totalBankAccounts: bankAcc.count ?? 0,
      totalDemat: demat.count ?? 0, totalFD: fd.count ?? 0,
      totalLeads: leads.count ?? 0, totalMessages: messages.count ?? 0,
      totalCashback: cashback.count ?? 0,
    });
  }, []);

  const fetchRecentLeads = useCallback(async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5);
    setRecentLeads(data ?? []);
  }, []);

  useEffect(() => {
    fetchStats(); fetchRecentLeads();
    const ch = supabase.channel("dashboard-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => { fetchStats(); fetchRecentLeads(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () => fetchStats())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchStats, fetchRecentLeads]);

  const statCards = [
    { label: "Credit Cards", value: stats.totalCards, icon: CreditCard, color: "text-blue-500" },
    { label: "Loans", value: stats.totalLoans, icon: TrendingUp, color: "text-emerald-500" },
    { label: "Insurance", value: stats.totalInsurance, icon: Shield, color: "text-violet-500" },
    { label: "Bank Accounts", value: stats.totalBankAccounts, icon: Landmark, color: "text-cyan-500" },
    { label: "Demat", value: stats.totalDemat, icon: TrendingUp, color: "text-orange-500" },
    { label: "Fixed Deposits", value: stats.totalFD, icon: Percent, color: "text-indigo-500" },
    { label: "Leads", value: stats.totalLeads, icon: Users, color: "text-amber-500" },
    { label: "Messages", value: stats.totalMessages, icon: MessageSquare, color: "text-rose-500" },
    { label: "Cashback", value: stats.totalCashback, icon: Gift, color: "text-teal-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchStats(); fetchRecentLeads(); }} className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-heading font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Recent Leads</CardTitle></CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border/50">
                      <td className="py-2.5 text-foreground">{lead.name}</td>
                      <td className="py-2.5 text-muted-foreground">{lead.email}</td>
                      <td className="py-2.5 text-muted-foreground">{lead.product_name || lead.service || "—"}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/15 text-accent">{lead.status}</span>
                      </td>
                      <td className="py-2.5 text-muted-foreground text-xs">{new Date(lead.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
