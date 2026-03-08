import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const emptyForm = {
  product_name: "", company_name: "", insurance_type: "health", premium_starting: "",
  coverage_amount: "", features: "", apply_link: "", image_url: "", description: "",
  rating: "4.0", min_age: "18", max_age: "65", is_active: true,
};

const AdminInsurance = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    const { data } = await supabase.from("insurance_products").select("*").order("created_at", { ascending: false });
    setProducts(data ?? []);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      product_name: form.product_name, company_name: form.company_name,
      insurance_type: form.insurance_type, premium_starting: form.premium_starting || null,
      coverage_amount: form.coverage_amount || null,
      features: form.features ? form.features.split("\n").filter(Boolean) : [],
      apply_link: form.apply_link || null, image_url: form.image_url || null,
      description: form.description || null, rating: parseFloat(form.rating) || 4.0,
      min_age: parseInt(form.min_age) || 18, max_age: parseInt(form.max_age) || 65,
      is_active: form.is_active,
    };

    const { error } = editId
      ? await supabase.from("insurance_products").update(payload).eq("id", editId)
      : await supabase.from("insurance_products").insert(payload);

    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: editId ? "Updated" : "Created" });
    setOpen(false); setForm(emptyForm); setEditId(null); fetch();
  };

  const handleEdit = (p: any) => {
    setForm({
      product_name: p.product_name, company_name: p.company_name,
      insurance_type: p.insurance_type, premium_starting: p.premium_starting || "",
      coverage_amount: p.coverage_amount || "", features: (p.features || []).join("\n"),
      apply_link: p.apply_link || "", image_url: p.image_url || "",
      description: p.description || "", rating: String(p.rating || 4),
      min_age: String(p.min_age || 18), max_age: String(p.max_age || 65), is_active: p.is_active,
    });
    setEditId(p.id); setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this insurance product?")) return;
    await supabase.from("insurance_products").delete().eq("id", id);
    toast({ title: "Deleted" }); fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-foreground">Insurance Products</h1>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setOpen(true); }} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Insurance
        </Button>
      </div>

      <div className="grid gap-4">
        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold text-foreground">{p.product_name}</h3>
                <p className="text-sm text-muted-foreground">{p.company_name} · {p.insurance_type} · {p.coverage_amount || "N/A"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {products.length === 0 && <p className="text-sm text-muted-foreground">No insurance products yet.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Insurance Product</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Product Name *" value={form.product_name} onChange={e => setForm(f => ({...f, product_name: e.target.value}))} />
            <Input placeholder="Company Name *" value={form.company_name} onChange={e => setForm(f => ({...f, company_name: e.target.value}))} />
            <select value={form.insurance_type} onChange={e => setForm(f => ({...f, insurance_type: e.target.value}))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="health">Health</option>
              <option value="life">Life</option>
              <option value="motor">Motor</option>
              <option value="home">Home</option>
              <option value="travel">Travel</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Premium Starting" value={form.premium_starting} onChange={e => setForm(f => ({...f, premium_starting: e.target.value}))} />
              <Input placeholder="Coverage Amount" value={form.coverage_amount} onChange={e => setForm(f => ({...f, coverage_amount: e.target.value}))} />
            </div>
            <Input placeholder="Apply Link" value={form.apply_link} onChange={e => setForm(f => ({...f, apply_link: e.target.value}))} />
            <Input placeholder="Image URL" value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} />
            <Textarea placeholder="Features (one per line)" value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} rows={4} />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} />
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Rating" value={form.rating} onChange={e => setForm(f => ({...f, rating: e.target.value}))} />
              <Input placeholder="Min Age" value={form.min_age} onChange={e => setForm(f => ({...f, min_age: e.target.value}))} />
              <Input placeholder="Max Age" value={form.max_age} onChange={e => setForm(f => ({...f, max_age: e.target.value}))} />
            </div>
            <Button onClick={handleSave} disabled={loading || !form.product_name || !form.company_name} className="w-full rounded-xl">
              {loading ? "Saving..." : editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInsurance;
