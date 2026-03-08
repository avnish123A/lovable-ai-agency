import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

const AdminCashback = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    store_name: "", category: "", cashback_value: "", description: "",
    claim_instructions: "", validity: "",
  });

  const fetchOffers = async () => {
    setLoading(true);
    const { data } = await supabase.from("cashback_offers").select("*").order("created_at", { ascending: false });
    setOffers(data ?? []);
    setFiltered(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOffers(); }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(offers); return; }
    const q = search.toLowerCase();
    setFiltered(offers.filter(o => o.store_name?.toLowerCase().includes(q) || o.category?.toLowerCase().includes(q)));
  }, [search, offers]);

  const resetForm = () => {
    setForm({ store_name: "", category: "", cashback_value: "", description: "", claim_instructions: "", validity: "" });
    setEditing(null);
  };

  const openEdit = (offer: any) => {
    setEditing(offer);
    setForm({
      store_name: offer.store_name, category: offer.category, cashback_value: offer.cashback_value,
      description: offer.description || "", claim_instructions: offer.claim_instructions || "",
      validity: offer.validity || "",
    });
    setDialogOpen(true);
  };

  const handleAIEnhance = async () => {
    if (!form.store_name.trim()) { toast.error("Enter store name first"); return; }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-product-enhance", {
        body: { product_type: "cashback", product_name: form.store_name, bank_name: form.store_name, existing_data: { category: form.category, cashback_value: form.cashback_value } },
      });
      if (error) throw error;
      if (data?.data) {
        const e = data.data;
        setForm(prev => ({ ...prev, description: e.description || prev.description, claim_instructions: e.claim_instructions || prev.claim_instructions }));
        toast.success("AI enhanced!");
      }
    } catch (err: any) { toast.error(err.message || "AI failed"); }
    setAiLoading(false);
  };

  const handleSave = async () => {
    if (editing) {
      const { error } = await supabase.from("cashback_offers").update(form).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Updated");
    } else {
      const { error } = await supabase.from("cashback_offers").insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success("Added");
    }
    setDialogOpen(false); resetForm(); fetchOffers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("cashback_offers").delete().eq("id", id);
    toast.success("Deleted"); fetchOffers();
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} offers?`)) return;
    for (const id of selected) { await supabase.from("cashback_offers").delete().eq("id", id); }
    toast.success(`${selected.size} deleted`); setSelected(new Set()); fetchOffers();
  };

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(o => o.id)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Cashback Offers</h1>
        <div className="flex gap-3 flex-wrap">
          {selected.size > 0 && <Button variant="destructive" size="sm" onClick={handleBulkDelete}><Trash2 className="w-4 h-4 mr-1" /> Delete {selected.size}</Button>}
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" /></div>
          <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add</Button></DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-heading">{editing ? "Edit" : "Add"} Cashback Offer</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                {[
                  { key: "store_name", label: "Store Name", type: "text" },
                  { key: "category", label: "Category", type: "text" },
                  { key: "cashback_value", label: "Cashback Value", type: "text" },
                  { key: "validity", label: "Validity", type: "date" },
                ].map(f => (
                  <div key={f.key} className="space-y-1">
                    <Label className="text-xs">{f.label}</Label>
                    <Input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                  </div>
                ))}

                <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /><span className="text-sm font-semibold text-primary">AI Enhancement</span></div>
                    <Button type="button" size="sm" variant="secondary" onClick={handleAIEnhance} disabled={aiLoading} className="gap-2">
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}{aiLoading ? "Enhancing..." : "Enhance with AI"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">AI will generate description & claim instructions.</p>
                </div>

                <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                <div className="space-y-1"><Label className="text-xs">Claim Instructions</Label><Textarea value={form.claim_instructions} onChange={e => setForm({ ...form, claim_instructions: e.target.value })} rows={3} /></div>
                <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Offer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
        <>
          {filtered.length > 0 && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Checkbox checked={selected.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} /><span>Select All ({filtered.length})</span></div>}
          <div className="grid gap-3">
            {filtered.map(offer => (
              <Card key={offer.id} className={selected.has(offer.id) ? "border-primary" : ""}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={selected.has(offer.id)} onCheckedChange={() => toggleSelect(offer.id)} />
                    <div>
                      <p className="font-semibold text-foreground">{offer.store_name}</p>
                      <p className="text-sm text-muted-foreground">{offer.category} • {offer.cashback_value}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(offer)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(offer.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No offers found.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCashback;
