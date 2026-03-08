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
  CheckCircle, XCircle, Clock, DollarSign, Eye, Copy
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
  created_at: string;
}

const emptyDeal = {
  merchant_name: "", merchant_logo: "", offer_title: "", cashback_amount: "",
  description: "", tracking_link: "", category: "general", is_active: true, source: "manual",
  coupon_code: "", expiry_date: "", terms: "",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  paid: "bg-blue-100 text-blue-700",
};

const AdminCashback = () => {
  const [deals, setDeals] = useState<CashbackDeal[]>([]);
  const [requests, setRequests] = useState<CashbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [reqSearch, setReqSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
    if (dealsRes.data) setDeals(dealsRes.data as any);
    if (reqRes.data) setRequests(reqRes.data as any);
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
    const csv = ["Name,Email,Phone,UPI ID,Tracking ID,Amount,Status,Date",
      ...requests.map(r => `"${r.user_name}","${r.email}","${r.phone}","${r.upi_id}","${r.tracking_id}","${r.cashback_amount || ''}","${r.status}","${new Date(r.created_at).toLocaleString()}"`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "cashback_requests.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDeals = deals.filter(d => d.merchant_name.toLowerCase().includes(search.toLowerCase()) || d.offer_title.toLowerCase().includes(search.toLowerCase()));
  const filteredRequests = requests.filter(r => {
    const matchSearch = r.user_name.toLowerCase().includes(reqSearch.toLowerCase()) || r.email.toLowerCase().includes(reqSearch.toLowerCase()) || r.tracking_id.toLowerCase().includes(reqSearch.toLowerCase());
    return matchSearch && (statusFilter === "all" || r.status === statusFilter);
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    paid: requests.filter(r => r.status === "paid").length,
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Cashback Management</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: stats.total, icon: Gift, color: "text-primary" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600" },
          { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-green-600" },
          { label: "Paid", value: stats.paid, icon: DollarSign, color: "text-blue-600" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 flex items-center gap-3">
            <s.icon className={`w-8 h-8 ${s.color}`} />
            <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Cashback Requests</TabsTrigger>
          <TabsTrigger value="deals">Manage Deals</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search name, email, tracking ID..." value={reqSearch} onChange={e => setReqSearch(e.target.value)} className="pl-9" />
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
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4 mr-1.5" /> Export</Button>
            {selectedReqIds.size > 0 && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => bulkUpdateStatus("approved")}><CheckCircle className="w-4 h-4 mr-1" /> Approve ({selectedReqIds.size})</Button>
                <Button size="sm" variant="destructive" onClick={() => bulkUpdateStatus("rejected")}><XCircle className="w-4 h-4 mr-1" /> Reject ({selectedReqIds.size})</Button>
              </div>
            )}
          </div>
          <Card><CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="p-3 w-10"><Checkbox checked={selectedReqIds.size === filteredRequests.length && filteredRequests.length > 0} onCheckedChange={() => { selectedReqIds.size === filteredRequests.length ? setSelectedReqIds(new Set()) : setSelectedReqIds(new Set(filteredRequests.map(r => r.id))); }} /></th>
                <th className="p-3 text-left font-medium text-muted-foreground">User</th>
                <th className="p-3 text-left font-medium text-muted-foreground">UPI ID</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Tracking</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Amount</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="p-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No requests</td></tr>
                ) : filteredRequests.map(req => (
                  <tr key={req.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3"><Checkbox checked={selectedReqIds.has(req.id)} onCheckedChange={() => { const n = new Set(selectedReqIds); n.has(req.id) ? n.delete(req.id) : n.add(req.id); setSelectedReqIds(n); }} /></td>
                    <td className="p-3"><div className="font-medium text-foreground">{req.user_name}</div><div className="text-xs text-muted-foreground">{req.email}</div></td>
                    <td className="p-3 font-mono text-xs">{req.upi_id}</td>
                    <td className="p-3 font-mono text-xs">{req.tracking_id}</td>
                    <td className="p-3 font-semibold">{req.cashback_amount || "—"}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[req.status] || ""}`}>{req.status}</span></td>
                    <td className="p-3 text-muted-foreground text-xs">{new Date(req.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setViewReq(req); setAdminNote(req.admin_notes || ""); }}><Eye className="w-3.5 h-3.5" /></Button>
                      {req.status === "pending" && (<>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => updateRequestStatus(req.id, "approved")}><CheckCircle className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => updateRequestStatus(req.id, "rejected")}><XCircle className="w-3.5 h-3.5" /></Button>
                      </>)}
                      {req.status === "approved" && <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => updateRequestStatus(req.id, "paid")}><DollarSign className="w-3.5 h-3.5" /></Button>}
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
                <th className="p-3 text-left font-medium text-muted-foreground">Source</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filteredDeals.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No deals</td></tr>
                ) : filteredDeals.map(deal => (
                  <tr key={deal.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 font-medium">{deal.merchant_name}</td>
                    <td className="p-3 text-muted-foreground max-w-[200px] truncate">{deal.offer_title}</td>
                    <td className="p-3 font-semibold text-primary">{deal.cashback_amount}</td>
                    <td className="p-3">
                      {deal.coupon_code ? (
                        <button onClick={() => { navigator.clipboard.writeText(deal.coupon_code!); toast.success("Coupon copied!"); }}
                          className="inline-flex items-center gap-1 font-mono text-xs bg-muted px-2 py-0.5 rounded border border-border hover:bg-muted/80">
                          {deal.coupon_code} <Copy className="w-3 h-3" />
                        </button>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{deal.expiry_date ? new Date(deal.expiry_date).toLocaleDateString() : "—"}</td>
                    <td className="p-3"><Badge variant="outline" className="text-xs">{deal.source}</Badge></td>
                    <td className="p-3"><Badge variant={deal.is_active ? "default" : "secondary"} className="text-xs">{deal.is_active ? "Active" : "Inactive"}</Badge></td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDeal(deal)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteDeals([deal.id])}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </td>
                  </tr>
                ))}
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

      {/* Request Detail Dialog */}
      <Dialog open={!!viewReq} onOpenChange={o => !o && setViewReq(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Request Details</DialogTitle></DialogHeader>
          {viewReq && <div className="space-y-4">
            <div className="space-y-2 text-sm">
              {([["Name", viewReq.user_name], ["Email", viewReq.email], ["Phone", viewReq.phone], ["UPI ID", viewReq.upi_id], ["Tracking ID", viewReq.tracking_id], ["Amount", viewReq.cashback_amount || "—"], ["Status", viewReq.status], ["Device", viewReq.device || "—"], ["Submitted", new Date(viewReq.created_at).toLocaleString()], ["Approved", viewReq.approved_at ? new Date(viewReq.approved_at).toLocaleString() : "—"], ["Paid", viewReq.paid_at ? new Date(viewReq.paid_at).toLocaleString() : "—"]] as [string, string][]).map(([l, v]) => (
                <div key={l} className="flex justify-between"><span className="text-muted-foreground">{l}</span><span className="font-medium text-foreground">{v}</span></div>
              ))}
            </div>
            <div>
              <Label>Admin Notes</Label>
              <Textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Add internal notes..." rows={3} />
              <Button size="sm" className="mt-2" onClick={() => saveAdminNote(viewReq.id)}>Save Note</Button>
            </div>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCashback;
