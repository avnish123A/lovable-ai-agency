import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const emptyForm = {
  platform_name: "", account_type: "trading", account_opening_fee: "₹0",
  annual_maintenance: "", brokerage: "", features: "", apply_link: "",
  image_url: "", description: "", rating: "4.0", is_active: true,
};

const AdminDemat = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from("demat_accounts").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      platform_name: form.platform_name, account_type: form.account_type,
      account_opening_fee: form.account_opening_fee || "₹0",
      annual_maintenance: form.annual_maintenance || null, brokerage: form.brokerage || null,
      features: form.features ? form.features.split("\n").filter(Boolean) : [],
      apply_link: form.apply_link || null, image_url: form.image_url || null,
      description: form.description || null, rating: parseFloat(form.rating) || 4.0, is_active: form.is_active,
    };
    const { error } = editId
      ? await supabase.from("demat_accounts").update(payload).eq("id", editId)
      : await supabase.from("demat_accounts").insert(payload);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: editId ? "Updated" : "Created" });
    setOpen(false); setForm(emptyForm); setEditId(null); fetchData();
  };

  const handleEdit = (p: any) => {
    setForm({
      platform_name: p.platform_name, account_type: p.account_type,
      account_opening_fee: p.account_opening_fee || "₹0",
      annual_maintenance: p.annual_maintenance || "", brokerage: p.brokerage || "",
      features: (p.features || []).join("\n"), apply_link: p.apply_link || "",
      image_url: p.image_url || "", description: p.description || "",
      rating: String(p.rating || 4), is_active: p.is_active,
    });
    setEditId(p.id); setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this demat account?")) return;
    await supabase.from("demat_accounts").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-foreground">Demat Accounts</h1>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setOpen(true); }} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Demat Account
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold text-foreground">{p.platform_name}</h3>
                <p className="text-sm text-muted-foreground">{p.account_type} · Opening: {p.account_opening_fee} · Brokerage: {p.brokerage || "N/A"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No demat accounts yet.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Demat Account</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Platform Name *" value={form.platform_name} onChange={e => setForm(f => ({...f, platform_name: e.target.value}))} />
            <select value={form.account_type} onChange={e => setForm(f => ({...f, account_type: e.target.value}))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="trading">Trading & Demat</option>
              <option value="demat-only">Demat Only</option>
              <option value="commodity">Commodity</option>
            </select>
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Opening Fee" value={form.account_opening_fee} onChange={e => setForm(f => ({...f, account_opening_fee: e.target.value}))} />
              <Input placeholder="Annual Maintenance" value={form.annual_maintenance} onChange={e => setForm(f => ({...f, annual_maintenance: e.target.value}))} />
              <Input placeholder="Brokerage" value={form.brokerage} onChange={e => setForm(f => ({...f, brokerage: e.target.value}))} />
            </div>
            <Input placeholder="Apply Link" value={form.apply_link} onChange={e => setForm(f => ({...f, apply_link: e.target.value}))} />
            <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} />
            <Textarea placeholder="Features (one per line)" value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} rows={4} />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} />
            <Button onClick={handleSave} disabled={loading || !form.platform_name} className="w-full rounded-xl">
              {loading ? "Saving..." : editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDemat;
