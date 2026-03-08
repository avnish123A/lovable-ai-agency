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

const AdminLoans = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    loan_name: "", bank_name: "", interest_rate: 0, min_amount: 50000, max_amount: 5000000,
    min_tenure: 12, max_tenure: 60, processing_fee: "", apply_link: "",
    min_salary: 0, min_age: 21, features: "", image_url: "",
  });

  const fetchLoans = async () => {
    setLoading(true);
    const { data } = await supabase.from("loan_products").select("*").order("created_at", { ascending: false });
    setLoans(data ?? []);
    setFiltered(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchLoans(); }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(loans);
    } else {
      const q = search.toLowerCase();
      setFiltered(loans.filter(l => 
        l.loan_name?.toLowerCase().includes(q) || 
        l.bank_name?.toLowerCase().includes(q)
      ));
    }
  }, [search, loans]);

  const resetForm = () => {
    setForm({ loan_name: "", bank_name: "", interest_rate: 0, min_amount: 50000, max_amount: 5000000,
      min_tenure: 12, max_tenure: 60, processing_fee: "", apply_link: "",
      min_salary: 0, min_age: 21, features: "", image_url: "" });
    setEditing(null);
  };

  const openEdit = (loan: any) => {
    setEditing(loan);
    setForm({
      loan_name: loan.loan_name, bank_name: loan.bank_name, interest_rate: loan.interest_rate,
      min_amount: loan.min_amount, max_amount: loan.max_amount,
      min_tenure: loan.min_tenure || 12, max_tenure: loan.max_tenure || 60,
      processing_fee: loan.processing_fee || "", apply_link: loan.apply_link || "",
      min_salary: loan.min_salary || 0, min_age: loan.min_age || 21,
      features: (loan.features || []).join(", "), image_url: loan.image_url || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.loan_name.trim() || !form.bank_name.trim()) {
      toast.error("Loan name and bank name are required");
      return;
    }

    const payload = {
      ...form,
      features: form.features.split(",").map((f: string) => f.trim()).filter(Boolean),
    };

    if (editing) {
      const { error } = await supabase.from("loan_products").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Loan updated");
    } else {
      const { error } = await supabase.from("loan_products").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Loan added");
    }
    setDialogOpen(false);
    resetForm();
    fetchLoans();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this loan product?")) return;
    const { error } = await supabase.from("loan_products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Loan deleted");
    fetchLoans();
  };

  const fields = [
    { key: "loan_name", label: "Loan Name *", type: "text" },
    { key: "bank_name", label: "Bank Name *", type: "text" },
    { key: "interest_rate", label: "Interest Rate (%)", type: "number" },
    { key: "min_amount", label: "Min Amount (₹)", type: "number" },
    { key: "max_amount", label: "Max Amount (₹)", type: "number" },
    { key: "min_tenure", label: "Min Tenure (months)", type: "number" },
    { key: "max_tenure", label: "Max Tenure (months)", type: "number" },
    { key: "processing_fee", label: "Processing Fee", type: "text" },
    { key: "apply_link", label: "Apply Link", type: "text" },
    { key: "min_salary", label: "Min Salary (₹)", type: "number" },
    { key: "min_age", label: "Min Age", type: "number" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Loan Products</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search loans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Loan</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading">{editing ? "Edit" : "Add"} Loan Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <ImageUpload
                    value={form.image_url}
                    onChange={(url) => setForm({ ...form, image_url: url })}
                    folder="loans"
                  />
                </div>
                {fields.map((f) => (
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
                <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Loan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((loan) => (
            <Card key={loan.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  {loan.image_url ? (
                    <img src={loan.image_url} alt={loan.loan_name} className="w-16 h-10 object-contain rounded" />
                  ) : (
                    <div className="w-16 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No img</div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{loan.loan_name}</p>
                    <p className="text-sm text-muted-foreground">{loan.bank_name} • {loan.interest_rate}% • ₹{loan.min_amount.toLocaleString()} - ₹{loan.max_amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(loan)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(loan.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No loan products found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminLoans;
