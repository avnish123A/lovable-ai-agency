import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Plus, Search, Trash2, Pencil, Gift, Download,
  CheckCircle, XCircle, Clock, DollarSign, Eye, Copy,
  IndianRupee, TrendingUp, Users, Calendar, Phone, Mail, Hash, Smartphone, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface CashbackDeal {
  id: string;
  merchant_name: string;
  merchant_logo: string | null;
  offer_title: string;
  cashback_amount: string;
  description: string | null;
  tracking_link: string;
  category: string;
  is_active: boolean;
  source: string;
  coupon_code: string | null;
  expiry_date: string | null;
  terms: string | null;
  created_at: string;
}

interface CashbackRequest {
  id: string;
  deal_id: string;
  tracking_id: string;
  user_name: string;
  email: string;
  phone: string;
  upi_id: string;
  status: string;
  cashback_amount: string | null;
  click_timestamp: string;
  approved_at: string | null;
  paid_at: string | null;
  admin_notes: string | null;
  device: string | null;
  ip_hash: string | null;
  created_at: string;
  updated_at: string;
  deal?: CashbackDeal | null;
}

const emptyDeal = {
  merchant_name: "", merchant_logo: "", offer_title: "", cashback_amount: "",
  description: "", tracking_link: "", category: "general", is_active: true, source: "manual",
  coupon_code: "", expiry_date: "", terms: "",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-700 border-red-500/20",
  paid: "bg-primary/10 text-primary border-primary/20",
};

const AdminCashback = () => {
  const [deals, setDeals] = useState<CashbackDeal[]>([]);
  const [requests, setRequests] = useState<CashbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [reqSearch, setReqSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [editDeal, setEditDeal] = useState<CashbackDeal | null>(null);
  const [dealForm, setDealForm] = useState(emptyDeal);
  const [saving, setSaving] = useState(false);
  const [selectedReqIds, setSelectedReqIds] = useState<Set<string>>(new Set());
  const [viewReq, setViewReq] = useState<CashbackRequest | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const fetchData = async () => {
    const [dealsRes, reqRes] = await Promise.all([
      supabase.from("cashback_deals" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("cashback_requests" as any).select("*").order("created_at", { ascending: false }),
    ]);
    const dealsData = (dealsRes.data || []) as any as CashbackDeal[];
    const reqsData = (reqRes.data || []) as any as CashbackRequest[];
    
    // Map deal info to requests
    const dealsMap = new Map(dealsData.map(d => [d.id, d]));
    const enrichedReqs = reqsData.map(r => ({ ...r, deal: dealsMap.get(r.deal_id) || null }));
    
    setDeals(dealsData);
    setRequests(enrichedReqs);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveDeal = async () => {
    setSaving(true);
    const payload: any = {
      ...dealForm,
      merchant_logo: dealForm.merchant_logo || null,
      description: dealForm.description || null,
      coupon_code: dealForm.coupon_code || null,
      expiry_date: dealForm.expiry_date || null,
      terms: dealForm.terms || null,
    };
    if (editDeal) {
      const { error } = await supabase.from("cashback_deals" as any).update(payload).eq("id", editDeal.id);
      if (error) toast.error("Failed to update"); else toast.success("Deal updated!");
    } else {
      const { error } = await supabase.from("cashback_deals" as any).insert(payload);
      if (error) toast.error("Failed to create"); else toast.success("Deal created!");
    }
    setSaving(false);
    setShowDealDialog(false);
    setEditDeal(null);
    setDealForm(emptyDeal);
    fetchData();
  };

  const handleDeleteDeals = async (ids: string[]) => {
    if (!confirm(`Delete ${ids.length} deal(s)?`)) return;
    await supabase.from("cashback_deals" as any).delete().in("id", ids);
    toast.success("Deleted!");
    fetchData();
  };

  const openEditDeal = (deal: CashbackDeal) => {
    setEditDeal(deal);
    setDealForm({
      merchant_name: deal.merchant_name, merchant_logo: deal.merchant_logo || "",
      offer_title: deal.offer_title, cashback_amount: deal.cashback_amount,
      description: deal.description || "", tracking_link: deal.tracking_link,
      category: deal.category, is_active: deal.is_active, source: deal.source,
      coupon_code: deal.coupon_code || "", expiry_date: deal.expiry_date || "",
      terms: deal.terms || "",
    });
    setShowDealDialog(true);
  };

  const updateRequestStatus = async (id: string, status: string) => {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (status === "approved") updates.approved_at = new Date().toISOString();
    if (status === "paid") updates.paid_at = new Date().toISOString();
    const { error } = await supabase.from("cashback_requests" as any).update(updates).eq("id", id);
    if (error) toast.error("Failed"); else toast.success(`Status → ${status}`);
    fetchData();
  };

  const saveAdminNote = async (id: string) => {
    const { error } = await supabase.from("cashback_requests" as any).update({ admin_notes: adminNote } as any).eq("id", id);
    if (error) toast.error("Failed"); else toast.success("Note saved!");
    fetchData();
  };

  const bulkUpdateStatus = async (status: string) => {
    for (const id of Array.from(selectedReqIds)) await updateRequestStatus(id, status);
    setSelectedReqIds(new Set());
  };

  const handleExport = () => {
    const csv = ["Name,Email,Phone,UPI ID,Tracking ID,Deal,Amount,Status,Device,Submitted,Approved,Paid",
      ...filteredRequests.map(r => `"${r.user_name}","${r.email}","${r.phone}","${r.upi_id}","${r.tracking_id}","${r.deal?.merchant_name || '—'}","${r.cashback_amount || r.deal?.cashback_amount || ''}","${r.status}","${r.device || '—'}","${new Date(r.created_at).toLocaleString()}","${r.approved_at ? new Date(r.approved_at).toLocaleString() : '—'}","${r.paid_at ? new Date(r.paid_at).toLocaleString() : '—'}"`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `cashback_requests_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDeals = deals.filter(d => d.merchant_name.toLowerCase().includes(search.toLowerCase()) || d.offer_title.toLowerCase().includes(search.toLowerCase()));
  
  const filteredRequests = requests.filter(r => {
    const q = reqSearch.toLowerCase();
    const matchSearch = r.user_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.tracking_id.toLowerCase().includes(q) || r.upi_id.toLowerCase().includes(q) || r.phone.includes(q) || (r.deal?.merchant_name || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchDateFrom = !dateFrom || new Date(r.created_at) >= new Date(dateFrom);
    const matchDateTo = !dateTo || new Date(r.created_at) <= new Date(dateTo + "T23:59:59");
    return matchSearch && matchStatus && matchDateFrom && matchDateTo;
  });

  const parseAmount = (s: string | null | undefined) => {
    if (!s) return 0;
    const n = parseFloat(s.replace(/[^\d.]/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    paid: requests.filter(r => r.status === "paid").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    totalPaidAmount: requests.filter(r => r.status === "paid").reduce((s, r) => s + parseAmount(r.cashback_amount || r.deal?.cashback_amount), 0),
    totalPendingAmount: requests.filter(r => r.status === "pending" || r.status === "approved").reduce((s, r) => s + parseAmount(r.cashback_amount || r.deal?.cashback_amount), 0),
    uniqueUsers: new Set(requests.map(r => r.upi_id)).size,
    activeDeals: deals.filter(d => d.is_active).length,
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Cashback Management</h1>
        <Badge variant="outline" className="text-xs">{stats.activeDeals} Active Deals</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Requests", value: stats.total, icon: Gift, color: "text-primary" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600" },
          { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-emerald-600" },
          { label: "Paid Out", value: stats.paid, icon: DollarSign, color: "text-primary" },
          { label: "Unique Users", value: stats.uniqueUsers, icon: Users, color: "text-foreground" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 flex items-center gap-3">
            <s.icon className={`w-8 h-8 ${s.color}`} />
            <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </CardContent></Card>
        ))}
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20 bg-primary/5"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><IndianRupee className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground font-medium">Total Paid Out</span></div>
          <p className="text-2xl font-bold text-primary">₹{stats.totalPaidAmount.toLocaleString("en-IN")}</p>
        </CardContent></Card>
        <Card className="border-yellow-500/20 bg-yellow-500/5"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-yellow-600" /><span className="text-xs text-muted-foreground font-medium">Pending Payout</span></div>
          <p className="text-2xl font-bold text-yellow-600">₹{stats.totalPendingAmount.toLocaleString("en-IN")}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><XCircle className="w-4 h-4 text-red-500" /><span className="text-xs text-muted-foreground font-medium">Rejected</span></div>
          <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Cashback Requests ({filteredRequests.length})</TabsTrigger>
          <TabsTrigger value="deals">Manage Deals ({deals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search name, email, UPI, phone, deal..." value={reqSearch} onChange={e => setReqSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-36" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-36" />
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4 mr-1.5" /> Export CSV</Button>
            {selectedReqIds.size > 0 && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => bulkUpdateStatus("approved")}><CheckCircle className="w-4 h-4 mr-1" /> Approve ({selectedReqIds.size})</Button>
                <Button size="sm" variant="outline" onClick={() => bulkUpdateStatus("paid")}><DollarSign className="w-4 h-4 mr-1" /> Mark Paid ({selectedReqIds.size})</Button>
                <Button size="sm" variant="destructive" onClick={() => bulkUpdateStatus("rejected")}><XCircle className="w-4 h-4 mr-1" /> Reject ({selectedReqIds.size})</Button>
              </div>
            )}
          </div>

          {/* Requests Table */}
          <Card><CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="p-3 w-10"><Checkbox checked={selectedReqIds.size === filteredRequests.length && filteredRequests.length > 0} onCheckedChange={() => { selectedReqIds.size === filteredRequests.length ? setSelectedReqIds(new Set()) : setSelectedReqIds(new Set(filteredRequests.map(r => r.id))); }} /></th>
                <th className="p-3 text-left font-medium text-muted-foreground">User</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Deal</th>
                <th className="p-3 text-left font-medium text-muted-foreground">UPI ID</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Tracking</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Amount</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="p-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">No requests found</td></tr>
                ) : filteredRequests.map(req => (
                  <tr key={req.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3"><Checkbox checked={selectedReqIds.has(req.id)} onCheckedChange={() => { const n = new Set(selectedReqIds); n.has(req.id) ? n.delete(req.id) : n.add(req.id); setSelectedReqIds(n); }} /></td>
                    <td className="p-3">
                      <div className="font-medium text-foreground">{req.user_name}</div>
                      <div className="text-xs text-muted-foreground">{req.email}</div>
                      <div className="text-xs text-muted-foreground">{req.phone}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-foreground text-xs">{req.deal?.merchant_name || "—"}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[120px]">{req.deal?.offer_title || ""}</div>
                    </td>
                    <td className="p-3 font-mono text-xs">{req.upi_id}</td>
                    <td className="p-3">
                      <button onClick={() => { navigator.clipboard.writeText(req.tracking_id); toast.success("Copied!"); }}
                        className="font-mono text-xs inline-flex items-center gap-1 hover:text-primary">
                        {req.tracking_id} <Copy className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="p-3 font-semibold text-sm">{req.cashback_amount || req.deal?.cashback_amount || "—"}</td>
                    <td className="p-3"><Badge variant="outline" className={`text-xs ${statusColors[req.status] || ""}`}>{req.status}</Badge></td>
                    <td className="p-3 text-muted-foreground text-xs whitespace-nowrap">{new Date(req.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setViewReq(req); setAdminNote(req.admin_notes || ""); }}><Eye className="w-3.5 h-3.5" /></Button>
                      {req.status === "pending" && (<>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" onClick={() => updateRequestStatus(req.id, "approved")}><CheckCircle className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => updateRequestStatus(req.id, "rejected")}><XCircle className="w-3.5 h-3.5" /></Button>
                      </>)}
                      {req.status === "approved" && <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => updateRequestStatus(req.id, "paid")}><DollarSign className="w-3.5 h-3.5" /></Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button onClick={() => { setEditDeal(null); setDealForm(emptyDeal); setShowDealDialog(true); }}><Plus className="w-4 h-4 mr-1.5" /> Add Deal</Button>
          </div>
          <Card><CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="p-3 text-left font-medium text-muted-foreground">Merchant</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Offer</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Cashback</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Coupon</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Expiry</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Requests</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Source</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filteredDeals.length === 0 ? (
                  <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">No deals</td></tr>
                ) : filteredDeals.map(deal => {
                  const dealReqs = requests.filter(r => r.deal_id === deal.id);
                  return (
                    <tr key={deal.id} className="border-b border-border hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {deal.merchant_logo ? <img src={deal.merchant_logo} alt="" className="w-8 h-8 rounded object-contain bg-muted p-0.5" /> : null}
                          <span className="font-medium">{deal.merchant_name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground max-w-[180px] truncate">{deal.offer_title}</td>
                      <td className="p-3 font-semibold text-primary">{deal.cashback_amount}</td>
                      <td className="p-3">
                        {deal.coupon_code ? (
                          <button onClick={() => { navigator.clipboard.writeText(deal.coupon_code!); toast.success("Copied!"); }}
                            className="inline-flex items-center gap-1 font-mono text-xs bg-muted px-2 py-0.5 rounded border border-border hover:bg-muted/80">
                            {deal.coupon_code} <Copy className="w-3 h-3" />
                          </button>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{deal.expiry_date ? new Date(deal.expiry_date).toLocaleDateString("en-IN") : "—"}</td>
                      <td className="p-3"><Badge variant="secondary" className="text-xs">{dealReqs.length} reqs</Badge></td>
                      <td className="p-3"><Badge variant="outline" className="text-xs">{deal.source}</Badge></td>
                      <td className="p-3"><Badge variant={deal.is_active ? "default" : "secondary"} className="text-xs">{deal.is_active ? "Active" : "Inactive"}</Badge></td>
                      <td className="p-3 text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDeal(deal)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteDeals([deal.id])}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Deal Add/Edit Dialog */}
      <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editDeal ? "Edit Deal" : "Add New Deal"}</DialogTitle></DialogHeader>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Merchant Name *</Label><Input value={dealForm.merchant_name} onChange={e => setDealForm({ ...dealForm, merchant_name: e.target.value })} /></div>
              <div><Label>Cashback Amount *</Label><Input placeholder="₹200 or 10%" value={dealForm.cashback_amount} onChange={e => setDealForm({ ...dealForm, cashback_amount: e.target.value })} /></div>
            </div>
            <div><Label>Offer Title *</Label><Input value={dealForm.offer_title} onChange={e => setDealForm({ ...dealForm, offer_title: e.target.value })} /></div>
            <div><Label>Tracking Link *</Label><Input placeholder="https://..." value={dealForm.tracking_link} onChange={e => setDealForm({ ...dealForm, tracking_link: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Coupon Code</Label><Input placeholder="SAVE20" value={dealForm.coupon_code} onChange={e => setDealForm({ ...dealForm, coupon_code: e.target.value })} /></div>
              <div><Label>Expiry Date</Label><Input type="date" value={dealForm.expiry_date} onChange={e => setDealForm({ ...dealForm, expiry_date: e.target.value })} /></div>
            </div>
            <div><Label>Merchant Logo URL</Label><Input placeholder="https://..." value={dealForm.merchant_logo} onChange={e => setDealForm({ ...dealForm, merchant_logo: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={dealForm.description} onChange={e => setDealForm({ ...dealForm, description: e.target.value })} rows={3} /></div>
            <div><Label>Terms & Conditions</Label><Textarea placeholder="Enter deal specific T&C..." value={dealForm.terms} onChange={e => setDealForm({ ...dealForm, terms: e.target.value })} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label><Input value={dealForm.category} onChange={e => setDealForm({ ...dealForm, category: e.target.value })} /></div>
              <div><Label>Source</Label>
                <Select value={dealForm.source} onValueChange={v => setDealForm({ ...dealForm, source: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="manual">Manual</SelectItem><SelectItem value="hiqmobi">Hiqmobi</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2"><Checkbox checked={dealForm.is_active} onCheckedChange={c => setDealForm({ ...dealForm, is_active: !!c })} /><Label>Active</Label></div>
            <Button onClick={handleSaveDeal} disabled={saving || !dealForm.merchant_name || !dealForm.tracking_link} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}{editDeal ? "Update Deal" : "Create Deal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Detail Dialog - Enhanced */}
      <Dialog open={!!viewReq} onOpenChange={o => !o && setViewReq(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Request Details</DialogTitle></DialogHeader>
          {viewReq && <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
            {/* Status banner */}
            <div className={`rounded-xl p-3 flex items-center justify-between ${statusColors[viewReq.status] || "bg-muted"}`}>
              <span className="font-semibold capitalize">{viewReq.status}</span>
              <span className="font-bold">{viewReq.cashback_amount || viewReq.deal?.cashback_amount || "—"}</span>
            </div>

            {/* Deal info */}
            {viewReq.deal && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border">
                {viewReq.deal.merchant_logo ? (
                  <img src={viewReq.deal.merchant_logo} alt="" className="w-10 h-10 rounded-lg object-contain bg-background p-1" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">{viewReq.deal.merchant_name[0]}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground text-sm">{viewReq.deal.merchant_name}</p>
                  <p className="text-xs text-muted-foreground">{viewReq.deal.offer_title}</p>
                </div>
              </div>
            )}

            {/* User info grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User Information</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Users, label: "Name", value: viewReq.user_name },
                  { icon: Mail, label: "Email", value: viewReq.email },
                  { icon: Phone, label: "Phone", value: viewReq.phone },
                  { icon: IndianRupee, label: "UPI ID", value: viewReq.upi_id },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                    <item.icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">{item.label}</p>
                      <p className="text-sm font-medium text-foreground break-all">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking info */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tracking Details</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Hash, label: "Tracking ID", value: viewReq.tracking_id },
                  { icon: Smartphone, label: "Device", value: viewReq.device || "Unknown" },
                  { icon: Hash, label: "IP Hash", value: viewReq.ip_hash ? viewReq.ip_hash.slice(0, 12) + "..." : "—" },
                  { icon: Hash, label: "Deal ID", value: viewReq.deal_id.slice(0, 8) + "..." },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                    <item.icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">{item.label}</p>
                      <p className="text-xs font-mono font-medium text-foreground break-all">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timeline</h4>
              <div className="space-y-2">
                {[
                  { label: "Submitted", time: viewReq.created_at, active: true },
                  { label: "Click Time", time: viewReq.click_timestamp, active: true },
                  { label: "Approved", time: viewReq.approved_at, active: !!viewReq.approved_at },
                  { label: "Paid", time: viewReq.paid_at, active: !!viewReq.paid_at },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${step.active ? "bg-primary" : "bg-border"}`} />
                    <span className="text-xs text-muted-foreground w-20">{step.label}</span>
                    <span className={`text-xs font-medium ${step.active ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.time ? new Date(step.time).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2">
              {viewReq.status === "pending" && (<>
                <Button size="sm" className="flex-1" onClick={() => { updateRequestStatus(viewReq.id, "approved"); setViewReq(null); }}>
                  <CheckCircle className="w-4 h-4 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => { updateRequestStatus(viewReq.id, "rejected"); setViewReq(null); }}>
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </Button>
              </>)}
              {viewReq.status === "approved" && (
                <Button size="sm" className="flex-1" onClick={() => { updateRequestStatus(viewReq.id, "paid"); setViewReq(null); }}>
                  <DollarSign className="w-4 h-4 mr-1" /> Mark as Paid
                </Button>
              )}
            </div>

            {/* Admin Notes */}
            <div>
              <Label>Admin Notes</Label>
              <Textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Add internal notes about this request..." rows={3} />
              <Button size="sm" className="mt-2" onClick={() => saveAdminNote(viewReq.id)}>Save Note</Button>
            </div>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCashback;
