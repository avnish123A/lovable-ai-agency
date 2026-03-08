import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { MousePointerClick, TrendingUp, Calendar, Users, RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";

const CHART_COLORS = [
  "hsl(210, 100%, 15%)",
  "hsl(145, 63%, 49%)",
  "hsl(37, 90%, 61%)",
  "hsl(210, 80%, 45%)",
  "hsl(145, 50%, 35%)",
  "hsl(0, 84%, 60%)",
  "hsl(270, 60%, 50%)",
  "hsl(30, 80%, 55%)",
];

const AdminAnalytics = () => {
  const [totalClicks, setTotalClicks] = useState(0);
  const [todayClicks, setTodayClicks] = useState(0);
  const [weekClicks, setWeekClicks] = useState(0);
  const [topDeals, setTopDeals] = useState<{ name: string; clicks: number }[]>([]);
  const [dailyTrend, setDailyTrend] = useState<{ date: string; clicks: number }[]>([]);
  const [merchantBreakdown, setMerchantBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [recentClicks, setRecentClicks] = useState<any[]>([]);

  // Lead analytics
  const [totalLeads, setTotalLeads] = useState(0);
  const [todayLeads, setTodayLeads] = useState(0);
  const [weekLeads, setWeekLeads] = useState(0);
  const [leadsByStatus, setLeadsByStatus] = useState<{ name: string; value: number }[]>([]);
  const [leadsTrend, setLeadsTrend] = useState<{ date: string; leads: number }[]>([]);
  const [leadsByProduct, setLeadsByProduct] = useState<{ name: string; leads: number }[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchClickAnalytics = useCallback(async () => {
    const { data: clicksData, count } = await supabase
      .from("deal_clicks")
      .select("deal_id, clicked_at", { count: "exact" })
      .order("clicked_at", { ascending: false })
      .limit(1000);

    const { data: dealsData } = await supabase.from("finance_deals").select("id, title, merchant");
    const dealsMap = new Map((dealsData || []).map((d) => [d.id, d]));

    const enriched = (clicksData || []).map((c) => ({
      ...c,
      deal_title: dealsMap.get(c.deal_id)?.title || "Unknown",
      deal_merchant: dealsMap.get(c.deal_id)?.merchant || "Unknown",
    }));

    setRecentClicks(enriched.slice(0, 20));
    setTotalClicks(count ?? 0);

    const today = new Date().toISOString().split("T")[0];
    setTodayClicks(enriched.filter((c) => c.clicked_at?.startsWith(today)).length);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    setWeekClicks(enriched.filter((c) => new Date(c.clicked_at) >= weekAgo).length);

    // Top deals
    const dealCounts: Record<string, { name: string; clicks: number }> = {};
    enriched.forEach((c) => {
      if (!dealCounts[c.deal_id]) dealCounts[c.deal_id] = { name: c.deal_title, clicks: 0 };
      dealCounts[c.deal_id].clicks++;
    });
    setTopDeals(Object.values(dealCounts).sort((a, b) => b.clicks - a.clicks).slice(0, 8));

    // Daily trend
    const dayMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dayMap[d.toISOString().split("T")[0]] = 0;
    }
    enriched.forEach((c) => {
      const day = c.clicked_at?.split("T")[0];
      if (day && day in dayMap) dayMap[day]++;
    });
    setDailyTrend(Object.entries(dayMap).map(([date, clicks]) => ({
      date: new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      clicks,
    })));

    // Merchant breakdown
    const merchantMap: Record<string, number> = {};
    enriched.forEach((c) => { merchantMap[c.deal_merchant] = (merchantMap[c.deal_merchant] || 0) + 1; });
    setMerchantBreakdown(
      Object.entries(merchantMap).sort(([, a], [, b]) => b - a).slice(0, 8).map(([name, value]) => ({ name, value }))
    );
  }, []);

  const fetchLeadAnalytics = useCallback(async () => {
    const { data: leadsData, count } = await supabase
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(1000);

    const leads = leadsData || [];
    setTotalLeads(count ?? 0);

    const today = new Date().toISOString().split("T")[0];
    setTodayLeads(leads.filter((l) => l.created_at?.startsWith(today)).length);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    setWeekLeads(leads.filter((l) => new Date(l.created_at) >= weekAgo).length);

    // By status
    const statusMap: Record<string, number> = {};
    leads.forEach((l) => { statusMap[l.status] = (statusMap[l.status] || 0) + 1; });
    setLeadsByStatus(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

    // By product/bank
    const productMap: Record<string, number> = {};
    leads.forEach((l) => {
      const key = l.product_name || l.bank_name || l.service || "Other";
      productMap[key] = (productMap[key] || 0) + 1;
    });
    setLeadsByProduct(
      Object.entries(productMap).sort(([, a], [, b]) => b - a).slice(0, 8).map(([name, leads]) => ({ name, leads }))
    );

    // Daily trend
    const dayMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dayMap[d.toISOString().split("T")[0]] = 0;
    }
    leads.forEach((l) => {
      const day = l.created_at?.split("T")[0];
      if (day && day in dayMap) dayMap[day]++;
    });
    setLeadsTrend(Object.entries(dayMap).map(([date, leads]) => ({
      date: new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      leads,
    })));
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchClickAnalytics(), fetchLeadAnalytics()]);
    setLoading(false);
  }, [fetchClickAnalytics, fetchLeadAnalytics]);

  useEffect(() => {
    fetchAll();

    // Realtime: refresh analytics when leads or clicks change
    const leadsChannel = supabase
      .channel("analytics-leads")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => {
        fetchLeadAnalytics();
      })
      .subscribe();

    const clicksChannel = supabase
      .channel("analytics-clicks")
      .on("postgres_changes", { event: "*", schema: "public", table: "deal_clicks" }, () => {
        fetchClickAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(clicksChannel);
    };
  }, [fetchAll, fetchLeadAnalytics, fetchClickAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-accent" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time tracking of leads, clicks and engagement.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAll} className="rounded-xl">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="leads">Lead Analytics</TabsTrigger>
          <TabsTrigger value="clicks">Click Analytics</TabsTrigger>
        </TabsList>

        {/* ===== LEAD ANALYTICS TAB ===== */}
        <TabsContent value="leads" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                <Users className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-heading font-bold">{totalLeads}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
                <Calendar className="w-5 h-5 text-accent" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-heading font-bold">{todayLeads}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
                <ArrowUpRight className="w-5 h-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-heading font-bold">{weekLeads}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base font-heading">Lead Trend (Last 14 Days)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={leadsTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(210, 9%, 40%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(210, 9%, 40%)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(210, 13%, 90%)", borderRadius: "8px", fontSize: 13 }} />
                  <Line type="monotone" dataKey="leads" stroke="hsl(210, 100%, 15%)" strokeWidth={2.5} dot={{ fill: "hsl(210, 100%, 15%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base font-heading">Leads by Status</CardTitle></CardHeader>
              <CardContent>
                {leadsByStatus.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No lead data yet.</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={leadsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                          {leadsByStatus.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base font-heading">Top Products (by Leads)</CardTitle></CardHeader>
              <CardContent>
                {leadsByProduct.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={leadsByProduct} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fill: "hsl(210, 9%, 40%)", fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" width={140} tick={{ fill: "hsl(210, 9%, 40%)", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(210, 13%, 90%)", borderRadius: "8px", fontSize: 13 }} />
                      <Bar dataKey="leads" fill="hsl(210, 100%, 15%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== CLICK ANALYTICS TAB ===== */}
        <TabsContent value="clicks" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
                <MousePointerClick className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent><p className="text-3xl font-heading font-bold">{totalClicks}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
                <Calendar className="w-5 h-5 text-accent" />
              </CardHeader>
              <CardContent><p className="text-3xl font-heading font-bold">{todayClicks}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </CardHeader>
              <CardContent><p className="text-3xl font-heading font-bold">{weekClicks}</p></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base font-heading">Click Trend (Last 14 Days)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(210, 9%, 40%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(210, 9%, 40%)", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(210, 13%, 90%)", borderRadius: "8px", fontSize: 13 }} />
                  <Line type="monotone" dataKey="clicks" stroke="hsl(145, 63%, 49%)" strokeWidth={2.5} dot={{ fill: "hsl(145, 63%, 49%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base font-heading">Top Clicked Deals</CardTitle></CardHeader>
              <CardContent>
                {topDeals.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No click data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topDeals} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fill: "hsl(210, 9%, 40%)", fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" width={140} tick={{ fill: "hsl(210, 9%, 40%)", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(210, 13%, 90%)", borderRadius: "8px", fontSize: 13 }} />
                      <Bar dataKey="clicks" fill="hsl(210, 100%, 15%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base font-heading">Clicks by Merchant</CardTitle></CardHeader>
              <CardContent>
                {merchantBreakdown.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No data yet.</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={merchantBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                          {merchantBreakdown.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base font-heading">Recent Clicks</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">Deal</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Merchant</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Clicked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClicks.map((c, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2.5 text-foreground max-w-[250px] truncate">{c.deal_title}</td>
                        <td className="py-2.5"><Badge variant="secondary" className="text-xs">{c.deal_merchant}</Badge></td>
                        <td className="py-2.5 text-muted-foreground text-xs">
                          {c.clicked_at ? new Date(c.clicked_at).toLocaleString("en-IN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recentClicks.length === 0 && (
                  <p className="text-sm text-muted-foreground py-6 text-center">No clicks recorded yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
