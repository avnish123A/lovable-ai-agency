import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

const AdminCreditCards = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    card_name: "", bank_name: "", card_type: "rewards", annual_fee: 0, joining_fee: 0,
    reward_points: "", cashback_rate: "", welcome_bonus: "", apply_link: "",
    min_salary: 0, min_age: 18, rating: 4.0, features: "", image_url: "",
  });

  const fetchCards = async () => {
    setLoading(true);
    const { data } = await supabase.from("credit_cards").select("*").order("created_at", { ascending: false });
    setCards(data ?? []);
    setFiltered(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCards(); }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(cards);
    } else {
      const q = search.toLowerCase();
      setFiltered(cards.filter(c => 
        c.card_name?.toLowerCase().includes(q) || 
        c.bank_name?.toLowerCase().includes(q) ||
        c.card_type?.toLowerCase().includes(q)
      ));
    }
  }, [search, cards]);

  const resetForm = () => {
    setForm({ card_name: "", bank_name: "", card_type: "rewards", annual_fee: 0, joining_fee: 0,
      reward_points: "", cashback_rate: "", welcome_bonus: "", apply_link: "",
      min_salary: 0, min_age: 18, rating: 4.0, features: "", image_url: "" });
    setEditing(null);
  };

  const openEdit = (card: any) => {
    setEditing(card);
    setForm({
      card_name: card.card_name, bank_name: card.bank_name, card_type: card.card_type || "rewards",
      annual_fee: card.annual_fee, joining_fee: card.joining_fee,
      reward_points: card.reward_points || "", cashback_rate: card.cashback_rate || "",
      welcome_bonus: card.welcome_bonus || "", apply_link: card.apply_link || "",
      min_salary: card.min_salary || 0, min_age: card.min_age || 18, rating: card.rating || 4.0,
      features: (card.features || []).join(", "), image_url: card.image_url || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.card_name.trim() || !form.bank_name.trim()) {
      toast.error("Card name and bank name are required");
      return;
    }

    const payload = {
      ...form,
      features: form.features.split(",").map((f: string) => f.trim()).filter(Boolean),
    };

    if (editing) {
      const { error } = await supabase.from("credit_cards").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Card updated");
    } else {
      const { error } = await supabase.from("credit_cards").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Card added");
    }
    setDialogOpen(false);
    resetForm();
    fetchCards();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this card?")) return;
    const { error } = await supabase.from("credit_cards").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Card deleted");
    fetchCards();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Credit Cards</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Card</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading">{editing ? "Edit" : "Add"} Credit Card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Card Image</Label>
                  <ImageUpload
                    value={form.image_url}
                    onChange={(url) => setForm({ ...form, image_url: url })}
                    folder="credit-cards"
                  />
                </div>
                {[
                  { key: "card_name", label: "Card Name *", type: "text" },
                  { key: "bank_name", label: "Bank Name *", type: "text" },
                  { key: "card_type", label: "Card Type", type: "text" },
                  { key: "annual_fee", label: "Annual Fee (₹)", type: "number" },
                  { key: "joining_fee", label: "Joining Fee (₹)", type: "number" },
                  { key: "reward_points", label: "Reward Points", type: "text" },
                  { key: "cashback_rate", label: "Cashback Rate", type: "text" },
                  { key: "welcome_bonus", label: "Welcome Bonus", type: "text" },
                  { key: "apply_link", label: "Apply Link", type: "text" },
                  { key: "min_salary", label: "Min Salary (₹)", type: "number" },
                  { key: "min_age", label: "Min Age", type: "number" },
                  { key: "rating", label: "Rating", type: "number" },
                ].map((f) => (
                  <div key={f.key} className="space-y-1">
                    <Label className="text-xs">{f.label}</Label>
                    <Input
                      type={f.type}
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <Label className="text-xs">Features (comma separated)</Label>
                  <Textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
                </div>
                <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Card</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((card) => (
            <Card key={card.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  {card.image_url ? (
                    <img src={card.image_url} alt={card.card_name} className="w-16 h-10 object-contain rounded" />
                  ) : (
                    <div className="w-16 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No img</div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{card.card_name}</p>
                    <p className="text-sm text-muted-foreground">{card.bank_name} • ₹{card.annual_fee}/yr • {card.card_type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(card)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(card.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No credit cards found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminCreditCards;
