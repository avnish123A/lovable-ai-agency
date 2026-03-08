import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Key, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface APIKey {
  id: string;
  key_name: string;
  key_value: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminAPIKeys = () => {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<APIKey | null>(null);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    key_name: "",
    key_value: "",
    description: "",
    is_active: true,
  });

  const fetchKeys = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .order("key_name", { ascending: true });
    
    if (error) {
      toast.error("Failed to load API keys");
    } else {
      setKeys(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

  const resetForm = () => {
    setForm({ key_name: "", key_value: "", description: "", is_active: true });
    setEditing(null);
  };

  const openEdit = (key: APIKey) => {
    setEditing(key);
    setForm({
      key_name: key.key_name,
      key_value: key.key_value,
      description: key.description || "",
      is_active: key.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.key_name.trim() || !form.key_value.trim()) {
      toast.error("Key name and value are required");
      return;
    }

    const payload = {
      key_name: form.key_name.trim().toUpperCase().replace(/\s+/g, "_"),
      key_value: form.key_value.trim(),
      description: form.description.trim() || null,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      const { error } = await supabase.from("api_keys").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("API key updated - changes will reflect immediately");
    } else {
      const { error } = await supabase.from("api_keys").insert(payload);
      if (error) { 
        if (error.code === "23505") {
          toast.error("Key name already exists");
        } else {
          toast.error(error.message);
        }
        return;
      }
      toast.success("API key added");
    }
    setDialogOpen(false);
    resetForm();
    fetchKeys();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete API key "${name}"? This may break integrations using this key.`)) return;
    const { error } = await supabase.from("api_keys").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("API key deleted");
    fetchKeys();
  };

  const toggleActive = async (key: APIKey) => {
    const { error } = await supabase
      .from("api_keys")
      .update({ is_active: !key.is_active, updated_at: new Date().toISOString() })
      .eq("id", key.id);
    
    if (error) { toast.error(error.message); return; }
    toast.success(`Key ${!key.is_active ? "activated" : "deactivated"}`);
    fetchKeys();
  };

  const toggleShowValue = (id: string) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskValue = (value: string) => {
    if (value.length <= 8) return "••••••••";
    return value.slice(0, 4) + "••••••••" + value.slice(-4);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">API Keys</h1>
          <p className="text-sm text-muted-foreground">Manage all API keys for integrations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchKeys} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Key</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading">{editing ? "Edit" : "Add"} API Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Key Name *</Label>
                  <Input
                    placeholder="e.g., CUELINKS_API_KEY"
                    value={form.key_name}
                    onChange={(e) => setForm({ ...form, key_name: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Will be converted to UPPERCASE_WITH_UNDERSCORES</p>
                </div>
                <div className="space-y-2">
                  <Label>Key Value *</Label>
                  <Input
                    type="password"
                    placeholder="Enter API key value"
                    value={form.key_value}
                    onChange={(e) => setForm({ ...form, key_value: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="What is this key used for?"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Key</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {keys.map((key) => (
            <Card key={key.id} className={!key.is_active ? "opacity-60" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${key.is_active ? "bg-primary/10" : "bg-muted"}`}>
                      <Key className={`w-5 h-5 ${key.is_active ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground font-mono text-sm">{key.key_name}</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {showValues[key.id] ? key.key_value : maskValue(key.key_value)}
                        </code>
                        <button onClick={() => toggleShowValue(key.id)} className="text-muted-foreground hover:text-foreground">
                          {showValues[key.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                      {key.description && <p className="text-xs text-muted-foreground mt-1">{key.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={key.is_active} onCheckedChange={() => toggleActive(key)} />
                    <Button variant="ghost" size="icon" onClick={() => openEdit(key)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(key.id, key.key_name)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {keys.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No API keys configured yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Add keys like CUELINKS_API_KEY, EARNKARO_API_KEY to manage integrations.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-heading">How API Keys Work</CardTitle>
          <CardDescription>
            API keys stored here are used by edge functions for affiliate integrations. 
            Changes reflect immediately when functions fetch keys from the database.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminAPIKeys;
