import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus, Pencil, Trash2, Loader2, ExternalLink, Globe } from "lucide-react";
import { toast } from "sonner";

interface Bank {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  created_at: string;
}

const AdminBanks = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [form, setForm] = useState({ name: "", logo_url: "", website_url: "", is_active: true });

  const fetchBanks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("banks")
      .select("*")
      .order("name", { ascending: true });
    setBanks((data as Bank[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const openCreate = () => {
    setEditingBank(null);
    setForm({ name: "", logo_url: "", website_url: "", is_active: true });
    setDialogOpen(true);
  };

  const openEdit = (bank: Bank) => {
    setEditingBank(bank);
    setForm({
      name: bank.name,
      logo_url: bank.logo_url || "",
      website_url: bank.website_url || "",
      is_active: bank.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Bank name is required");
      return;
    }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      logo_url: form.logo_url.trim() || null,
      website_url: form.website_url.trim() || null,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    if (editingBank) {
      const { error } = await supabase.from("banks").update(payload).eq("id", editingBank.id);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Bank updated");
        setDialogOpen(false);
        fetchBanks();
      }
    } else {
      const { error } = await supabase.from("banks").insert(payload);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Bank added");
        setDialogOpen(false);
        fetchBanks();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bank?")) return;
    const { error } = await supabase.from("banks").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Bank deleted");
      fetchBanks();
    }
  };

  const toggleActive = async (bank: Bank) => {
    const { error } = await supabase
      .from("banks")
      .update({ is_active: !bank.is_active })
      .eq("id", bank.id);
    if (error) {
      toast.error(error.message);
    } else {
      fetchBanks();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Partner Banks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage partner banks and their logos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Bank
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">
                {editingBank ? "Edit Bank" : "Add New Bank"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bank Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="HDFC Bank"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={form.logo_url}
                  onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
                {form.logo_url && (
                  <div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-white p-2">
                    <img src={form.logo_url} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  value={form.website_url}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  placeholder="https://hdfcbank.com"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingBank ? "Update Bank" : "Add Bank"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : banks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No banks added yet.</p>
            <Button variant="link" onClick={openCreate} className="mt-2">
              Add your first bank
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {banks.map((bank) => (
            <Card key={bank.id} className={!bank.is_active ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg border bg-white flex items-center justify-center shrink-0 p-2">
                    {bank.logo_url ? (
                      <img src={bank.logo_url} alt={bank.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Building2 className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{bank.name}</h3>
                    {bank.website_url && (
                      <a
                        href={bank.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary flex items-center gap-1 hover:underline"
                      >
                        <Globe className="w-3 h-3" />
                        Website
                      </a>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(bank)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(bank.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <Switch
                        checked={bank.is_active}
                        onCheckedChange={() => toggleActive(bank)}
                        className="ml-auto"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBanks;
