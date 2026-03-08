import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const AdminContactSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "", phone: "", address: "", working_hours: "",
    whatsapp: "", instagram: "", facebook: "", twitter: "", map_embed: "",
  });

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "contact_info")
        .maybeSingle();
      if (data?.value && typeof data.value === "object") {
        const v = data.value as Record<string, string>;
        setForm({
          email: v.email || "", phone: v.phone || "", address: v.address || "",
          working_hours: v.working_hours || "", whatsapp: v.whatsapp || "",
          instagram: v.instagram || "", facebook: v.facebook || "",
          twitter: v.twitter || "", map_embed: v.map_embed || "",
        });
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ value: form as any, updated_at: new Date().toISOString() })
      .eq("key", "contact_info");
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Contact settings saved!", description: "Changes will reflect on the contact page immediately." });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Contact Page Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Email</label>
              <Input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Phone</label>
              <Input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Address</label>
              <Textarea value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} rows={2} />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Working Hours</label>
              <Input value={form.working_hours} onChange={e => setForm(f => ({...f, working_hours: e.target.value}))} placeholder="Mon-Fri: 10:00 AM - 6:00 PM" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Social Media & Map</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">WhatsApp</label>
              <Input value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Instagram URL</label>
              <Input value={form.instagram} onChange={e => setForm(f => ({...f, instagram: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Facebook URL</label>
              <Input value={form.facebook} onChange={e => setForm(f => ({...f, facebook: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Twitter URL</label>
              <Input value={form.twitter} onChange={e => setForm(f => ({...f, twitter: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Google Maps Embed URL</label>
              <Textarea value={form.map_embed} onChange={e => setForm(f => ({...f, map_embed: e.target.value}))} rows={2} placeholder="https://www.google.com/maps/embed?..." />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave} disabled={loading} className="rounded-xl">
        <Save className="w-4 h-4 mr-2" /> {loading ? "Saving..." : "Save Contact Settings"}
      </Button>
    </div>
  );
};

export default AdminContactSettings;
