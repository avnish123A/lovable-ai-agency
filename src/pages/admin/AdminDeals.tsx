import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminDeals = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    deal_id: "", title: "", merchant: "", category: "finance", subcategory: "",
    description: "", cashback: "", tracking_link: "", offer_type: "", expiry_date: "",
  });

  const fetchDeals = async () => {
    setLoading(true);
    const { data } = await supabase.from("finance_deals").select("*").order("created_at", { ascending: false });
    setDeals(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchDeals(); }, []);

  const resetForm = () => {
    setForm({ deal_id: "", title: "", merchant: "", category: "finance", subcategory: "",
      description: "", cashback: "", tracking_link: "", offer_type: "", expiry_date: "" });
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
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
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

  const fields = [
    { key: "deal_id", label: "Deal ID", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "merchant", label: "Merchant", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "subcategory", label: "Subcategory", type: "text" },
    { key: "cashback", label: "Cashback", type: "text" },
    { key: "tracking_link", label: "Tracking/Affiliate Link", type: "text" },
    { key: "offer_type", label: "Offer Type", type: "text" },
    { key: "expiry_date", label: "Expiry Date", type: "date" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Finance Deals</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Deal</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{editing ? "Edit" : "Add"} Deal</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {fields.map((f) => (
                <div key={f.key} className="space-y-1">
                  <Label className="text-xs">{f.label}</Label>
                  <Input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Deal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {deals.map((deal) => (
            <Card key={deal.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-semibold text-foreground">{deal.title}</p>
                  <p className="text-sm text-muted-foreground">{deal.merchant} • {deal.category} • {deal.cashback || "No cashback"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(deal)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(deal.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {deals.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No deals found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminDeals;
