import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle, Wrench, Loader2 } from "lucide-react";

interface MaintenanceSettings {
  enabled: boolean;
  message: string;
  estimated_time: string;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [maintenance, setMaintenance] = useState<MaintenanceSettings>({
    enabled: false,
    message: "We are currently upgrading our platform to serve you better.",
    estimated_time: "2 hours",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "maintenance_mode")
        .single();

      if (data?.value) {
        setMaintenance(data.value as unknown as MaintenanceSettings);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ value: maintenance as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
      .eq("key", "maintenance_mode");

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success(maintenance.enabled ? "Maintenance mode enabled!" : "Settings saved!");
    }
    setSaving(false);
  };

  const toggleMaintenance = () => {
    setMaintenance({ ...maintenance, enabled: !maintenance.enabled });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-heading font-bold">Settings</h1>

      {/* Maintenance Mode Card */}
      <Card className={maintenance.enabled ? "border-destructive/50" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${maintenance.enabled ? "bg-destructive/10" : "bg-primary/10"}`}>
                <Wrench className={`w-5 h-5 ${maintenance.enabled ? "text-destructive" : "text-primary"}`} />
              </div>
              <div>
                <CardTitle className="font-heading text-lg">Maintenance Mode</CardTitle>
                <CardDescription>Instantly disable all public pages</CardDescription>
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <Switch
                checked={maintenance.enabled}
                onCheckedChange={toggleMaintenance}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {maintenance.enabled && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="font-medium">Maintenance mode is active! All public pages are disabled.</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Maintenance Message</Label>
            <Textarea
              id="message"
              value={maintenance.message}
              onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
              placeholder="We are currently upgrading our platform..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Estimated Time</Label>
            <Input
              id="time"
              value={maintenance.estimated_time}
              onChange={(e) => setMaintenance({ ...maintenance, estimated_time: e.target.value })}
              placeholder="2 hours"
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Maintenance Settings
          </Button>
        </CardContent>
      </Card>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium text-foreground">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">User ID</p>
            <p className="text-sm font-mono text-muted-foreground">{user?.id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Sign In</p>
            <p className="text-sm text-muted-foreground">
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;