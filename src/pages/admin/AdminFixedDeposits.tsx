import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Search, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUpload from "@/components/admin/ImageUpload";

const emptyForm = {
  scheme_name: "", bank_name: "", interest_rate: "", min_amount: "1000",
  max_amount: "", min_tenure: "", max_tenure: "", features: "", apply_link: "",
  image_url: "", description: "", rating: "4.0", senior_citizen_rate: "", is_active: true,
};

const AdminFixedDeposits = () => {
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
    const { data } = await supabase.from("fixed_deposits").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setFiltered(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(items); return; }
    const q = search.toLowerCase();
    setFiltered(items.filter(p => p.scheme_name?.toLowerCase().includes(q) || p.bank_name?.toLowerCase().includes(q)));
  }, [search, items]);

  const resetForm = () => { setForm(emptyForm); setEditId(null); };

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

  const handleAIEnhance = async () => {
    if (!form.scheme_name.trim() || !form.bank_name.trim()) { toast.error("Enter scheme & bank name first"); return; }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-product-enhance", {
        body: { product_type: "fixed_deposit", product_name: form.scheme_name, bank_name: form.bank_name, existing_data: { interest_rate: form.interest_rate, senior_citizen_rate: form.senior_citizen_rate, min_tenure: form.min_tenure } },
      });
      if (error) throw error;
      if (data?.data) {
        const e = data.data;
        setForm(prev => ({ ...prev, description: e.description || prev.description, features: e.features?.join("\n") || prev.features }));
        toast.success("AI enhanced!");
      }
    } catch (err: any) { toast.error(err.message || "AI failed"); }
    setAiLoading(false);
  };

  const handleSave = async () => {
    if (!form.scheme_name || !form.bank_name || !form.interest_rate) { toast.error("Scheme, bank & rate required"); return; }
    setSaving(true);
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
    const { error } = editId ? await supabase.from("fixed_deposits").update(payload).eq("id", editId) : await supabase.from("fixed_deposits").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? "Updated" : "Created");
    setOpen(false); resetForm(); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("fixed_deposits").delete().eq("id", id);
    toast.success("Deleted"); fetchData();
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} FDs?`)) return;
    for (const id of selected) { await supabase.from("fixed_deposits").delete().eq("id", id); }
    toast.success(`${selected.size} deleted`); setSelected(new Set()); fetchData();
  };

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Fixed Deposits</h1>
        <div className="flex gap-3 flex-wrap">
          {selected.size > 0 && <Button variant="destructive" size="sm" onClick={handleBulkDelete}><Trash2 className="w-4 h-4 mr-1" /> Delete {selected.size}</Button>}
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" /></div>
          <Button onClick={() => { resetForm(); setOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Add</Button>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
        <>
          {filtered.length > 0 && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Checkbox checked={selected.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} /><span>Select All ({filtered.length})</span></div>}
          <div className="grid gap-3">
            {filtered.map(p => (
              <Card key={p.id} className={selected.has(p.id) ? "border-primary" : ""}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                    {p.image_url ? <img src={p.image_url} alt={p.scheme_name} className="w-12 h-12 object-contain rounded" /> : <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No img</div>}
                    <div>
                      <p className="font-semibold text-foreground">{p.scheme_name}</p>
                      <p className="text-sm text-muted-foreground">{p.bank_name} · {p.interest_rate}% · Senior: {p.senior_citizen_rate ? `${p.senior_citizen_rate}%` : "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No FDs found.</p>}
          </div>
        </>
      )}

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editId ? "Edit" : "Add"} Fixed Deposit</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2"><Label>Image</Label><ImageUpload value={form.image_url} onChange={url => setForm(f => ({...f, image_url: url}))} folder="fixed-deposits" maxWidth={800} maxHeight={500} /></div>
            <Input placeholder="Scheme Name *" value={form.scheme_name} onChange={e => setForm(f => ({...f, scheme_name: e.target.value}))} />
            <Input placeholder="Bank Name *" value={form.bank_name} onChange={e => setForm(f => ({...f, bank_name: e.target.value}))} />

            <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /><span className="text-sm font-semibold text-primary">AI Enhancement</span></div>
                <Button type="button" size="sm" variant="secondary" onClick={handleAIEnhance} disabled={aiLoading} className="gap-2">
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}{aiLoading ? "Enhancing..." : "Enhance with AI"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">AI will generate description & features.</p>
            </div>

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
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} />
            <Textarea placeholder="Features (one per line)" value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} rows={4} />
            <Button onClick={handleSave} disabled={saving || !form.scheme_name || !form.bank_name || !form.interest_rate} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}{editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFixedDeposits;
