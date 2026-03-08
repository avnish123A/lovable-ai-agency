import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download, Loader2, Search, Trash2, Mail, Pencil } from "lucide-react";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editSub, setEditSub] = useState<Subscriber | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from("coming_soon_subscribers" as any)
      .select("*")
      .order("subscribed_at", { ascending: false });
    if (!error && data) setSubscribers(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(s => s.id)));
  };

  const handleDelete = async (ids: string[]) => {
    if (!confirm(`Delete ${ids.length} subscriber(s)?`)) return;
    const { error } = await supabase
      .from("coming_soon_subscribers" as any)
      .delete()
      .in("id", ids);
    if (error) toast.error("Failed to delete");
    else {
      toast.success(`${ids.length} subscriber(s) deleted`);
      setSelectedIds(new Set());
      fetchSubscribers();
    }
  };

  const handleEdit = async () => {
    if (!editSub || !editEmail.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("coming_soon_subscribers" as any)
      .update({ email: editEmail.trim().toLowerCase() } as any)
      .eq("id", editSub.id);
    if (error) toast.error("Failed to update");
    else {
      toast.success("Updated!");
      setEditSub(null);
      fetchSubscribers();
    }
    setSaving(false);
  };

  const handleExport = () => {
    const csv = ["Email,Subscribed At,Active", ...subscribers.map(s =>
      `${s.email},${new Date(s.subscribed_at).toLocaleString()},${s.is_active}`
    )].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Subscribers</h1>
          <p className="text-sm text-muted-foreground">{subscribers.length} total subscribers</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-1.5" /> Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        {selectedIds.size > 0 && (
          <Button variant="destructive" size="sm" onClick={() => handleDelete(Array.from(selectedIds))}>
            <Trash2 className="w-4 h-4 mr-1.5" /> Delete ({selectedIds.size})
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-3 w-10">
                    <Checkbox checked={selectedIds.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                  </th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Subscribed</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No subscribers yet</td></tr>
                ) : filtered.map(sub => (
                  <tr key={sub.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <Checkbox checked={selectedIds.has(sub.id)} onCheckedChange={() => toggleSelect(sub.id)} />
                    </td>
                    <td className="p-3 font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" /> {sub.email}
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${sub.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {sub.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditSub(sub); setEditEmail(sub.email); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete([sub.id])}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editSub} onOpenChange={(o) => !o && setEditSub(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Subscriber</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            </div>
            <Button onClick={handleEdit} disabled={saving} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubscribers;
