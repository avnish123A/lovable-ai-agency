import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Tag, Users, MessageSquare, TrendingUp, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Stats {
  totalCards: number;
  totalLoans: number;
  totalDeals: number;
  totalLeads: number;
  totalMessages: number;
  totalCashback: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalCards: 0, totalLoans: 0, totalDeals: 0, totalLeads: 0, totalMessages: 0, totalCashback: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [cards, loans, deals, leads, messages, cashback] = await Promise.all([
        supabase.from("credit_cards").select("id", { count: "exact", head: true }),
        supabase.from("loan_products").select("id", { count: "exact", head: true }),
        supabase.from("finance_deals").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("cashback_offers").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        totalCards: cards.count ?? 0,
        totalLoans: loans.count ?? 0,
        totalDeals: deals.count ?? 0,
        totalLeads: leads.count ?? 0,
        totalMessages: messages.count ?? 0,
        totalCashback: cashback.count ?? 0,
      });
    };

    const fetchRecentLeads = async () => {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentLeads(data ?? []);
    };

    fetchStats();
    fetchRecentLeads();
  }, []);

  const statCards = [
    { label: "Credit Cards", value: stats.totalCards, icon: CreditCard, color: "text-blue-500" },
    { label: "Loan Products", value: stats.totalLoans, icon: TrendingUp, color: "text-emerald-500" },
    { label: "Finance Deals", value: stats.totalDeals, icon: Tag, color: "text-violet-500" },
    { label: "Leads", value: stats.totalLeads, icon: Users, color: "text-amber-500" },
    { label: "Messages", value: stats.totalMessages, icon: MessageSquare, color: "text-rose-500" },
    { label: "Cashback Offers", value: stats.totalCashback, icon: Gift, color: "text-teal-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.email}</p>
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
        <CardHeader>
          <CardTitle className="font-heading text-lg">Recent Leads</CardTitle>
        </CardHeader>
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
                    <th className="text-left py-2 font-medium text-muted-foreground">Phone</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border/50">
                      <td className="py-2.5 text-foreground">{lead.name}</td>
                      <td className="py-2.5 text-muted-foreground">{lead.email}</td>
                      <td className="py-2.5 text-muted-foreground">{lead.phone || "—"}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/15 text-accent">
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
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
