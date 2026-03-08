import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Search, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const AdminDeals = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    deal_id: "", title: "", merchant: "", category: "finance", subcategory: "",
    description: "", cashback: "", tracking_link: "", offer_type: "", expiry_date: "",
    ai_description: "", ai_benefits: "", ai_eligibility: "", ai_terms: "",
  });

  const fetchDeals = async () => {
    setLoading(true);
    const { data } = await supabase.from("finance_deals").select("*").order("created_at", { ascending: false });
    setDeals(data ?? []);
    setFiltered(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchDeals(); }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(deals);
    } else {
      const q = search.toLowerCase();
      setFiltered(deals.filter(d => 
        d.title?.toLowerCase().includes(q) || 
        d.merchant?.toLowerCase().includes(q) ||
        d.subcategory?.toLowerCase().includes(q)
      ));
    }
  }, [search, deals]);

  const resetForm = () => {
    setForm({ deal_id: "", title: "", merchant: "", category: "finance", subcategory: "",
      description: "", cashback: "", tracking_link: "", offer_type: "", expiry_date: "",
      ai_description: "", ai_benefits: "", ai_eligibility: "", ai_terms: "" });
    setEditing(null);
  };

  const openEdit = (deal: any) => {
    setEditing(deal);
    setForm({
      deal_id: deal.deal_id, title: deal.title, merchant: deal.merchant,
      category: deal.category, subcategory: deal.subcategory || "",
      description: deal.description || "", cashback: deal.cashback || "",
      tracking_link: deal.tracking_link || "", offer_type: deal.offer_type || "",
      expiry_date: deal.expiry_date || "",
      ai_description: deal.ai_description || "",
      ai_benefits: deal.ai_benefits || "",
      ai_eligibility: deal.ai_eligibility || "",
      ai_terms: deal.ai_terms || "",
    });
    setDialogOpen(true);
  };

  const handleAIEnhance = async () => {
    if (!form.title.trim() || !form.merchant.trim()) {
      toast.error("Enter title and merchant first");
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-product-enhance", {
        body: {
          product_type: "deal",
          product_name: form.title,
          bank_name: form.merchant,
          existing_data: {
            cashback: form.cashback,
            description: form.description,
            offer_type: form.offer_type,
          },
        },
      });

      if (error) throw error;

      if (data?.data) {
        const enhanced = data.data;
        setForm(prev => ({
          ...prev,
          ai_description: enhanced.ai_description || prev.ai_description,
          ai_benefits: enhanced.ai_benefits || prev.ai_benefits,
          ai_eligibility: enhanced.ai_eligibility || prev.ai_eligibility,
          ai_terms: enhanced.ai_terms || prev.ai_terms,
        }));
        toast.success("AI generated official T&C and offer details!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "AI enhancement failed");
    }
    setAiLoading(false);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.merchant.trim()) {
      toast.error("Title and merchant are required");
      return;
    }

    if (editing) {
      const { error } = await supabase.from("finance_deals").update(form).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Deal updated");
    } else {
      const { error } = await supabase.from("finance_deals").insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success("Deal added");
    }
    setDialogOpen(false);
    resetForm();
    fetchDeals();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this deal?")) return;
    const { error } = await supabase.from("finance_deals").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deal deleted");
    fetchDeals();
  };

  const basicFields = [
    { key: "deal_id", label: "Deal ID *", type: "text" },
    { key: "title", label: "Title *", type: "text" },
    { key: "merchant", label: "Merchant/Bank *", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "subcategory", label: "Subcategory", type: "text" },
    { key: "cashback", label: "Cashback/Offer Value", type: "text" },
    { key: "offer_type", label: "Offer Type", type: "text" },
    { key: "expiry_date", label: "Expiry Date", type: "date" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Finance Deals</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Deal</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading">{editing ? "Edit" : "Add"} Deal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Basic Fields */}
                <div className="grid grid-cols-2 gap-3">
                  {basicFields.map((f) => (
                    <div key={f.key} className="space-y-1">
                      <Label className="text-xs">{f.label}</Label>
                      <Input
                        type={f.type}
                        value={(form as any)[f.key]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                {/* Tracking Link - Highlighted */}
                <div className="border border-accent/30 rounded-lg p-4 bg-accent/5">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-4 h-4 text-accent" />
                    <Label className="text-sm font-semibold text-accent">Affiliate/Tracking Link</Label>
                  </div>
                  <Input
                    value={form.tracking_link}
                    onChange={(e) => setForm({ ...form, tracking_link: e.target.value })}
                    placeholder="https://your-affiliate-link.com/..."
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your custom affiliate or tracking URL. This will be used for the Apply/Get Deal button.
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Short Description</Label>
                  <Textarea 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                  />
                </div>

                {/* AI Enhancement Section */}
                <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">Official T&C Generator</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={handleAIEnhance}
                      disabled={aiLoading}
                      className="gap-2"
                    >
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {aiLoading ? "Generating..." : "Generate Official Content"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    AI generates official bank/merchant-style T&C, benefits, and eligibility in formal language.
                  </p>
                </div>

                {/* AI Generated Fields - Editable */}
                <div className="space-y-3 border-l-2 border-primary/30 pl-4">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">AI Generated (Editable)</p>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">AI Description</Label>
                    <Textarea 
                      value={form.ai_description} 
                      onChange={(e) => setForm({ ...form, ai_description: e.target.value })}
                      rows={2}
                      placeholder="Official description will appear here..."
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">AI Benefits</Label>
                    <Textarea 
                      value={form.ai_benefits} 
                      onChange={(e) => setForm({ ...form, ai_benefits: e.target.value })}
                      rows={4}
                      placeholder="• Benefit 1&#10;• Benefit 2&#10;• Benefit 3"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">AI Eligibility</Label>
                    <Textarea 
                      value={form.ai_eligibility} 
                      onChange={(e) => setForm({ ...form, ai_eligibility: e.target.value })}
                      rows={3}
                      placeholder="• Eligibility criteria 1&#10;• Eligibility criteria 2"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">AI Terms & Conditions</Label>
                    <Textarea 
                      value={form.ai_terms} 
                      onChange={(e) => setForm({ ...form, ai_terms: e.target.value })}
                      rows={3}
                      placeholder="• *Terms and conditions apply&#10;• *Subject to bank approval"
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Deal</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((deal) => (
            <Card key={deal.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{deal.title}</p>
                    {deal.ai_description && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">AI Enhanced</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{deal.merchant} • {deal.subcategory || deal.category} • {deal.cashback || "—"}</p>
                  {deal.tracking_link && (
                    <p className="text-xs text-accent truncate max-w-md mt-1">{deal.tracking_link}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(deal)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(deal.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No deals found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminDeals;
