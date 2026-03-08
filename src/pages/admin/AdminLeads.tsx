import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download, Loader2, Search, Trash2, Users, Eye, Pencil, X } from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  service: string | null;
  status: string;
  created_at: string;
  device: string | null;
  ip_hash: string | null;
  source_page: string | null;
  user_agent: string | null;
  product_name: string | null;
  bank_name: string | null;
  notes: string | null;
}

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search) ||
      l.product_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Status updated");
    fetchLeads();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filtered.map((l) => l.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} lead(s)?`)) return;

    const { error } = await supabase.from("leads").delete().in("id", Array.from(selectedIds));
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${selectedIds.size} lead(s) deleted`);
      setSelectedIds(new Set());
      fetchLeads();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Lead deleted");
      fetchLeads();
    }
  };

  const exportCSV = () => {
    const toExport = selectedIds.size > 0 ? filtered.filter((l) => selectedIds.has(l.id)) : filtered;
    const headers = [
      "Name",
      "Email",
      "Phone",
      "City",
      "Product",
      "Bank",
      "Service",
      "Status",
      "Source Page",
      "Device",
      "Date",
    ];
    const rows = toExport.map((l) => [
      l.name,
      l.email,
      l.phone || "",
      l.city || "",
      l.product_name || "",
      l.bank_name || "",
      l.service || "",
      l.status,
      l.source_page || "",
      l.device || "",
      new Date(l.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const openEdit = (lead: Lead) => {
    setEditLead(lead);
    setEditForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      city: lead.city || "",
      service: lead.service || "",
      status: lead.status,
      notes: lead.notes || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editLead) return;
    setSaving(true);
    const { error } = await supabase
      .from("leads")
      .update({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || null,
        city: editForm.city || null,
        service: editForm.service || null,
        status: editForm.status,
        notes: editForm.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editLead.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Lead updated");
      setEditLead(null);
      fetchLeads();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Leads ({filtered.length})
          </h1>
          {selectedIds.size > 0 && (
            <p className="text-sm text-primary mt-1">{selectedIds.size} selected</p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {selectedIds.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          )}
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export {selectedIds.size > 0 ? `(${selectedIds.size})` : "All"}
          </Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, product..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-3 w-10">
                      <Checkbox
                        checked={selectedIds.size === filtered.length && filtered.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Phone</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">City</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedIds.has(lead.id)}
                          onCheckedChange={(checked) => handleSelect(lead.id, !!checked)}
                        />
                      </td>
                      <td className="p-3 text-foreground font-medium">{lead.name}</td>
                      <td className="p-3 text-muted-foreground">{lead.email}</td>
                      <td className="p-3 text-muted-foreground">{lead.phone || "—"}</td>
                      <td className="p-3 text-muted-foreground">{lead.city || "—"}</td>
                      <td className="p-3 text-muted-foreground max-w-[120px] truncate">
                        {lead.product_name || lead.service || "—"}
                      </td>
                      <td className="p-3">
                        <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v)}>
                          <SelectTrigger className="h-7 text-xs w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setViewLead(lead)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openEdit(lead)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(lead.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-muted-foreground">
                        No leads found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Lead Dialog */}
      <Dialog open={!!viewLead} onOpenChange={() => setViewLead(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Lead Details</DialogTitle>
          </DialogHeader>
          {viewLead && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="font-medium">{viewLead.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-medium">{viewLead.email}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="font-medium">{viewLead.phone || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">City</Label>
                <p className="font-medium">{viewLead.city || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Product</Label>
                <p className="font-medium">{viewLead.product_name || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Bank</Label>
                <p className="font-medium">{viewLead.bank_name || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Service</Label>
                <p className="font-medium">{viewLead.service || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <p className="font-medium">{viewLead.status}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Source Page</Label>
                <p className="font-medium truncate">{viewLead.source_page || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Device</Label>
                <p className="font-medium">{viewLead.device || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">IP Hash</Label>
                <p className="font-medium font-mono text-xs">{viewLead.ip_hash || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Created</Label>
                <p className="font-medium">{new Date(viewLead.created_at).toLocaleString()}</p>
              </div>
              {viewLead.user_agent && (
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">User Agent</Label>
                  <p className="font-mono text-xs break-all">{viewLead.user_agent}</p>
                </div>
              )}
              {viewLead.notes && (
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Notes</Label>
                  <p className="text-sm">{viewLead.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={!!editLead} onOpenChange={() => setEditLead(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Lead</DialogTitle>
          </DialogHeader>
          {editLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editForm.phone || ""}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={editForm.city || ""}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-service">Service</Label>
                <Input
                  id="edit-service"
                  value={editForm.service || ""}
                  onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm({ ...editForm, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Input
                  id="edit-notes"
                  value={editForm.notes || ""}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Add notes..."
                />
              </div>
              <Button onClick={handleSaveEdit} disabled={saving} className="w-full">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeads;
