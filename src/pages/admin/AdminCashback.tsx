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

const AdminCashback = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    store_name: "", category: "", cashback_value: "", description: "",
    claim_instructions: "", validity: "",
  });

  const fetchOffers = async () => {
    setLoading(true);
    const { data } = await supabase.from("cashback_offers").select("*").order("created_at", { ascending: false });
    setOffers(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOffers(); }, []);

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

  const handleSave = async () => {
    if (editing) {
      const { error } = await supabase.from("cashback_offers").update(form).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Offer updated");
    } else {
      const { error } = await supabase.from("cashback_offers").insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success("Offer added");
    }
    setDialogOpen(false);
    resetForm();
    fetchOffers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this offer?")) return;
    const { error } = await supabase.from("cashback_offers").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Offer deleted");
    fetchOffers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Cashback Offers</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Offer</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{editing ? "Edit" : "Add"} Cashback Offer</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {[
                { key: "store_name", label: "Store Name", type: "text" },
                { key: "category", label: "Category", type: "text" },
                { key: "cashback_value", label: "Cashback Value", type: "text" },
                { key: "validity", label: "Validity (date)", type: "date" },
              ].map((f) => (
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
              <div className="space-y-1">
                <Label className="text-xs">Claim Instructions</Label>
                <Textarea value={form.claim_instructions} onChange={(e) => setForm({ ...form, claim_instructions: e.target.value })} />
              </div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Offer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-semibold text-foreground">{offer.store_name}</p>
                  <p className="text-sm text-muted-foreground">{offer.category} • {offer.cashback_value}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(offer)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(offer.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {offers.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No cashback offers found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminCashback;
