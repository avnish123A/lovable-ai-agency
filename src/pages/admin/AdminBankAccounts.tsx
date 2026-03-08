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
  account_name: "", bank_name: "", account_type: "savings", min_balance: "",
  interest_rate: "", features: "", apply_link: "", image_url: "", description: "",
  rating: "4.0", is_active: true,
};

const AdminBankAccounts = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from("bank_accounts").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      account_name: form.account_name, bank_name: form.bank_name, account_type: form.account_type,
      min_balance: form.min_balance || null, interest_rate: parseFloat(form.interest_rate) || null,
      features: form.features ? form.features.split("\n").filter(Boolean) : [],
      apply_link: form.apply_link || null, image_url: form.image_url || null,
      description: form.description || null, rating: parseFloat(form.rating) || 4.0, is_active: form.is_active,
    };
    const { error } = editId
      ? await supabase.from("bank_accounts").update(payload).eq("id", editId)
      : await supabase.from("bank_accounts").insert(payload);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: editId ? "Updated" : "Created" });
    setOpen(false); setForm(emptyForm); setEditId(null); fetchData();
  };

  const handleEdit = (p: any) => {
    setForm({
      account_name: p.account_name, bank_name: p.bank_name, account_type: p.account_type,
      min_balance: p.min_balance || "", interest_rate: String(p.interest_rate || ""),
      features: (p.features || []).join("\n"), apply_link: p.apply_link || "",
      image_url: p.image_url || "", description: p.description || "",
      rating: String(p.rating || 4), is_active: p.is_active,
    });
    setEditId(p.id); setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bank account?")) return;
    await supabase.from("bank_accounts").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-foreground">Bank Accounts</h1>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setOpen(true); }} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Account
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold text-foreground">{p.account_name}</h3>
                <p className="text-sm text-muted-foreground">{p.bank_name} · {p.account_type} · {p.interest_rate ? `${p.interest_rate}%` : "N/A"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No bank accounts yet.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Bank Account</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Account Name *" value={form.account_name} onChange={e => setForm(f => ({...f, account_name: e.target.value}))} />
            <Input placeholder="Bank Name *" value={form.bank_name} onChange={e => setForm(f => ({...f, bank_name: e.target.value}))} />
            <select value={form.account_type} onChange={e => setForm(f => ({...f, account_type: e.target.value}))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="savings">Savings</option>
              <option value="current">Current</option>
              <option value="salary">Salary</option>
              <option value="nri">NRI</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Min Balance" value={form.min_balance} onChange={e => setForm(f => ({...f, min_balance: e.target.value}))} />
              <Input placeholder="Interest Rate %" value={form.interest_rate} onChange={e => setForm(f => ({...f, interest_rate: e.target.value}))} />
            </div>
            <Input placeholder="Apply Link" value={form.apply_link} onChange={e => setForm(f => ({...f, apply_link: e.target.value}))} />
            <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} />
            <Textarea placeholder="Features (one per line)" value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} rows={4} />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} />
            <Button onClick={handleSave} disabled={loading || !form.account_name || !form.bank_name} className="w-full rounded-xl">
              {loading ? "Saving..." : editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBankAccounts;
