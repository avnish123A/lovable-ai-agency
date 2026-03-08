import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Search, Sparkles, CheckSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUpload from "@/components/admin/ImageUpload";

const emptyForm = {
  product_name: "", company_name: "", insurance_type: "health", premium_starting: "",
  coverage_amount: "", features: "", apply_link: "", image_url: "", description: "",
  rating: "4.0", min_age: "18", max_age: "65", is_active: true,
};

const AdminInsurance = () => {
  const [items, setItems] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("insurance_products").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setFiltered(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(items); return; }
    const q = search.toLowerCase();
    setFiltered(items.filter(p => p.product_name?.toLowerCase().includes(q) || p.company_name?.toLowerCase().includes(q) || p.insurance_type?.toLowerCase().includes(q)));
  }, [search, items]);

  const resetForm = () => { setForm(emptyForm); setEditId(null); };

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

  const handleAIEnhance = async () => {
    if (!form.product_name.trim() || !form.company_name.trim()) { toast.error("Enter product & company name first"); return; }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-product-enhance", {
        body: { product_type: "insurance", product_name: form.product_name, bank_name: form.company_name, existing_data: { insurance_type: form.insurance_type, premium_starting: form.premium_starting, coverage_amount: form.coverage_amount } },
      });
      if (error) throw error;
      if (data?.data) {
        const e = data.data;
        setForm(prev => ({ ...prev, description: e.description || prev.description, premium_starting: e.premium_starting || prev.premium_starting, coverage_amount: e.coverage_amount || prev.coverage_amount, features: e.features?.join("\n") || prev.features }));
        toast.success("AI enhanced product details!");
      }
    } catch (err: any) { toast.error(err.message || "AI enhancement failed"); }
    setAiLoading(false);
  };

  const handleSave = async () => {
    if (!form.product_name || !form.company_name) { toast.error("Product & company name required"); return; }
    setSaving(true);
    const payload = {
      product_name: form.product_name, company_name: form.company_name, insurance_type: form.insurance_type,
      premium_starting: form.premium_starting || null, coverage_amount: form.coverage_amount || null,
      features: form.features ? form.features.split("\n").filter(Boolean) : [],
      apply_link: form.apply_link || null, image_url: form.image_url || null,
      description: form.description || null, rating: parseFloat(form.rating) || 4.0,
      min_age: parseInt(form.min_age) || 18, max_age: parseInt(form.max_age) || 65, is_active: form.is_active,
    };
    const { error } = editId ? await supabase.from("insurance_products").update(payload).eq("id", editId) : await supabase.from("insurance_products").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? "Updated" : "Created");
    setOpen(false); resetForm(); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("insurance_products").delete().eq("id", id);
    toast.success("Deleted"); fetchData();
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} products?`)) return;
    for (const id of selected) { await supabase.from("insurance_products").delete().eq("id", id); }
    toast.success(`${selected.size} products deleted`);
    setSelected(new Set()); fetchData();
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleAll = () => {
    setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Insurance Products</h1>
        <div className="flex gap-3 flex-wrap">
          {selected.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-1" /> Delete {selected.size}
            </Button>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" />
          </div>
          <Button onClick={() => { resetForm(); setOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <>
          {filtered.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={selected.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
              <span>Select All ({filtered.length})</span>
            </div>
          )}
          <div className="grid gap-3">
            {filtered.map(p => (
              <Card key={p.id} className={selected.has(p.id) ? "border-primary" : ""}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                    {p.image_url ? <img src={p.image_url} alt={p.product_name} className="w-12 h-12 object-contain rounded" /> : <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No img</div>}
                    <div>
                      <p className="font-semibold text-foreground">{p.product_name}</p>
                      <p className="text-sm text-muted-foreground">{p.company_name} · {p.insurance_type} · {p.coverage_amount || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No products found.</p>}
          </div>
        </>
      )}

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editId ? "Edit" : "Add"} Insurance Product</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Product Image</Label>
              <ImageUpload value={form.image_url} onChange={url => setForm(f => ({...f, image_url: url}))} folder="insurance" maxWidth={800} maxHeight={500} />
            </div>
            <Input placeholder="Product Name *" value={form.product_name} onChange={e => setForm(f => ({...f, product_name: e.target.value}))} />
            <Input placeholder="Company Name *" value={form.company_name} onChange={e => setForm(f => ({...f, company_name: e.target.value}))} />
            <select value={form.insurance_type} onChange={e => setForm(f => ({...f, insurance_type: e.target.value}))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="health">Health</option><option value="life">Life</option><option value="motor">Motor</option><option value="home">Home</option><option value="travel">Travel</option>
            </select>

            {/* AI Enhancement */}
            <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /><span className="text-sm font-semibold text-primary">AI Enhancement</span></div>
                <Button type="button" size="sm" variant="secondary" onClick={handleAIEnhance} disabled={aiLoading} className="gap-2">
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {aiLoading ? "Enhancing..." : "Enhance with AI"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">AI will generate description, features, premium & coverage info.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Premium Starting" value={form.premium_starting} onChange={e => setForm(f => ({...f, premium_starting: e.target.value}))} />
              <Input placeholder="Coverage Amount" value={form.coverage_amount} onChange={e => setForm(f => ({...f, coverage_amount: e.target.value}))} />
            </div>
            <Input placeholder="Apply Link" value={form.apply_link} onChange={e => setForm(f => ({...f, apply_link: e.target.value}))} />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} />
            <Textarea placeholder="Features (one per line)" value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} rows={4} />
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Rating" value={form.rating} onChange={e => setForm(f => ({...f, rating: e.target.value}))} />
              <Input placeholder="Min Age" value={form.min_age} onChange={e => setForm(f => ({...f, min_age: e.target.value}))} />
              <Input placeholder="Max Age" value={form.max_age} onChange={e => setForm(f => ({...f, max_age: e.target.value}))} />
            </div>
            <Button onClick={handleSave} disabled={saving || !form.product_name || !form.company_name} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}{editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInsurance;
