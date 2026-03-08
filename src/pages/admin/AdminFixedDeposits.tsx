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
  scheme_name: "", bank_name: "", interest_rate: "", min_amount: "1000",
  max_amount: "", min_tenure: "", max_tenure: "", features: "", apply_link: "",
  image_url: "", description: "", rating: "4.0", senior_citizen_rate: "", is_active: true,
};

const AdminFixedDeposits = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from("fixed_deposits").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      scheme_name: form.scheme_name, bank_name: form.bank_name,
      interest_rate: parseFloat(form.interest_rate), min_amount: parseFloat(form.min_amount) || 1000,
      max_amount: form.max_amount ? parseFloat(form.max_amount) : null,
      min_tenure: form.min_tenure || null, max_tenure: form.max_tenure || null,
      features: form.features ? form.features.split("\n").filter(Boolean) : [],
      apply_link: form.apply_link || null, image_url: form.image_url || null,
      description: form.description || null, rating: parseFloat(form.rating) || 4.0,
      senior_citizen_rate: form.senior_citizen_rate ? parseFloat(form.senior_citizen_rate) : null,
      is_active: form.is_active,
    };
    const { error } = editId
      ? await supabase.from("fixed_deposits").update(payload).eq("id", editId)
      : await supabase.from("fixed_deposits").insert(payload);
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: editId ? "Updated" : "Created" });
    setOpen(false); setForm(emptyForm); setEditId(null); fetchData();
  };

  const handleEdit = (p: any) => {
    setForm({
      scheme_name: p.scheme_name, bank_name: p.bank_name,
      interest_rate: String(p.interest_rate), min_amount: String(p.min_amount || 1000),
      max_amount: p.max_amount ? String(p.max_amount) : "", min_tenure: p.min_tenure || "",
      max_tenure: p.max_tenure || "", features: (p.features || []).join("\n"),
      apply_link: p.apply_link || "", image_url: p.image_url || "",
      description: p.description || "", rating: String(p.rating || 4),
      senior_citizen_rate: p.senior_citizen_rate ? String(p.senior_citizen_rate) : "",
      is_active: p.is_active,
    });
    setEditId(p.id); setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FD?")) return;
    await supabase.from("fixed_deposits").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-foreground">Fixed Deposits</h1>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setOpen(true); }} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add FD
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold text-foreground">{p.scheme_name}</h3>
                <p className="text-sm text-muted-foreground">{p.bank_name} · {p.interest_rate}% · Senior: {p.senior_citizen_rate ? `${p.senior_citizen_rate}%` : "N/A"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No fixed deposits yet.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Fixed Deposit</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Scheme Name *" value={form.scheme_name} onChange={e => setForm(f => ({...f, scheme_name: e.target.value}))} />
            <Input placeholder="Bank Name *" value={form.bank_name} onChange={e => setForm(f => ({...f, bank_name: e.target.value}))} />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Interest Rate % *" value={form.interest_rate} onChange={e => setForm(f => ({...f, interest_rate: e.target.value}))} />
              <Input placeholder="Senior Citizen Rate %" value={form.senior_citizen_rate} onChange={e => setForm(f => ({...f, senior_citizen_rate: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Min Amount" value={form.min_amount} onChange={e => setForm(f => ({...f, min_amount: e.target.value}))} />
              <Input placeholder="Max Amount" value={form.max_amount} onChange={e => setForm(f => ({...f, max_amount: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Min Tenure (e.g. 7 days)" value={form.min_tenure} onChange={e => setForm(f => ({...f, min_tenure: e.target.value}))} />
              <Input placeholder="Max Tenure (e.g. 10 years)" value={form.max_tenure} onChange={e => setForm(f => ({...f, max_tenure: e.target.value}))} />
            </div>
            <Input placeholder="Apply Link" value={form.apply_link} onChange={e => setForm(f => ({...f, apply_link: e.target.value}))} />
            <Textarea placeholder="Features (one per line)" value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} rows={4} />
            <Button onClick={handleSave} disabled={loading || !form.scheme_name || !form.bank_name || !form.interest_rate} className="w-full rounded-xl">
              {loading ? "Saving..." : editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFixedDeposits;
