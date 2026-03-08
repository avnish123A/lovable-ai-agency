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
  account_name: "", bank_name: "", account_type: "savings", min_balance: "",
  interest_rate: "", features: "", apply_link: "", image_url: "", description: "",
  rating: "4.0", is_active: true,
};

const AdminBankAccounts = () => {
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
    const { data } = await supabase.from("bank_accounts").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setFiltered(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(items); return; }
    const q = search.toLowerCase();
    setFiltered(items.filter(p => p.account_name?.toLowerCase().includes(q) || p.bank_name?.toLowerCase().includes(q)));
  }, [search, items]);

  const resetForm = () => { setForm(emptyForm); setEditId(null); };

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

  const handleAIEnhance = async () => {
    if (!form.account_name.trim() || !form.bank_name.trim()) { toast.error("Enter account & bank name first"); return; }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-product-enhance", {
        body: { product_type: "bank_account", product_name: form.account_name, bank_name: form.bank_name, existing_data: { account_type: form.account_type, min_balance: form.min_balance, interest_rate: form.interest_rate } },
      });
      if (error) throw error;
      if (data?.data) {
        const e = data.data;
        setForm(prev => ({ ...prev, description: e.description || prev.description, min_balance: e.min_balance || prev.min_balance, features: e.features?.join("\n") || prev.features }));
        toast.success("AI enhanced!");
      }
    } catch (err: any) { toast.error(err.message || "AI failed"); }
    setAiLoading(false);
  };

  const handleSave = async () => {
    if (!form.account_name || !form.bank_name) { toast.error("Account & bank name required"); return; }
    setSaving(true);
    const payload = {
      account_name: form.account_name, bank_name: form.bank_name, account_type: form.account_type,
      min_balance: form.min_balance || null, interest_rate: parseFloat(form.interest_rate) || null,
      features: form.features ? form.features.split("\n").filter(Boolean) : [],
      apply_link: form.apply_link || null, image_url: form.image_url || null,
      description: form.description || null, rating: parseFloat(form.rating) || 4.0, is_active: form.is_active,
    };
    const { error } = editId ? await supabase.from("bank_accounts").update(payload).eq("id", editId) : await supabase.from("bank_accounts").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? "Updated" : "Created");
    setOpen(false); resetForm(); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("bank_accounts").delete().eq("id", id);
    toast.success("Deleted"); fetchData();
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} accounts?`)) return;
    for (const id of selected) { await supabase.from("bank_accounts").delete().eq("id", id); }
    toast.success(`${selected.size} deleted`); setSelected(new Set()); fetchData();
  };

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Bank Accounts</h1>
        <div className="flex gap-3 flex-wrap">
          {selected.size > 0 && <Button variant="destructive" size="sm" onClick={handleBulkDelete}><Trash2 className="w-4 h-4 mr-1" /> Delete {selected.size}</Button>}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" />
          </div>
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
                    {p.image_url ? <img src={p.image_url} alt={p.account_name} className="w-12 h-12 object-contain rounded" /> : <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No img</div>}
                    <div>
                      <p className="font-semibold text-foreground">{p.account_name}</p>
                      <p className="text-sm text-muted-foreground">{p.bank_name} · {p.account_type} · {p.interest_rate ? `${p.interest_rate}%` : "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No accounts found.</p>}
          </div>
        </>
      )}

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editId ? "Edit" : "Add"} Bank Account</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2"><Label>Image</Label><ImageUpload value={form.image_url} onChange={url => setForm(f => ({...f, image_url: url}))} folder="bank-accounts" maxWidth={800} maxHeight={500} /></div>
            <Input placeholder="Account Name *" value={form.account_name} onChange={e => setForm(f => ({...f, account_name: e.target.value}))} />
            <Input placeholder="Bank Name *" value={form.bank_name} onChange={e => setForm(f => ({...f, bank_name: e.target.value}))} />
            <select value={form.account_type} onChange={e => setForm(f => ({...f, account_type: e.target.value}))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="savings">Savings</option><option value="current">Current</option><option value="salary">Salary</option><option value="nri">NRI</option>
            </select>

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
              <Input placeholder="Min Balance" value={form.min_balance} onChange={e => setForm(f => ({...f, min_balance: e.target.value}))} />
              <Input placeholder="Interest Rate %" value={form.interest_rate} onChange={e => setForm(f => ({...f, interest_rate: e.target.value}))} />
            </div>
            <Input placeholder="Apply Link" value={form.apply_link} onChange={e => setForm(f => ({...f, apply_link: e.target.value}))} />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} />
            <Textarea placeholder="Features (one per line)" value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} rows={4} />
            <Input placeholder="Rating" value={form.rating} onChange={e => setForm(f => ({...f, rating: e.target.value}))} />
            <Button onClick={handleSave} disabled={saving || !form.account_name || !form.bank_name} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}{editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBankAccounts;
