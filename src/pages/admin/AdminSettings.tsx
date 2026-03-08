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
import { AlertTriangle, Wrench, Loader2, Rocket, Eye } from "lucide-react";
import { CategoryKey } from "@/hooks/useCategoryComingSoon";

interface MaintenanceSettings {
  enabled: boolean;
  message: string;
  estimated_time: string;
}

interface ComingSoonSettings {
  enabled: boolean;
  headline: string;
  description: string;
  countdown_days: number;
  countdown_hours: number;
  countdown_minutes: number;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingComingSoon, setSavingComingSoon] = useState(false);
  const [maintenance, setMaintenance] = useState<MaintenanceSettings>({
    enabled: false,
    message: "We are currently upgrading our platform to serve you better.",
    estimated_time: "2 hours",
  });
  const [comingSoon, setComingSoon] = useState<ComingSoonSettings>({
    enabled: false,
    headline: "Something Powerful is Coming",
    description: "We're building the future of financial comparison. Be the first to know.",
    countdown_days: 30,
    countdown_hours: 0,
    countdown_minutes: 0,
  });
  const [categoryCS, setCategoryCS] = useState<Record<CategoryKey, boolean>>({
    credit_cards: false, loans: false, insurance: false, bank_accounts: false,
    demat_accounts: false, fixed_deposits: false, cashback: false,
  });
  const [savingCS, setSavingCS] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["maintenance_mode", "coming_soon_mode", "category_coming_soon"]);

      if (data) {
        data.forEach((item) => {
          if (item.key === "maintenance_mode" && item.value) {
            setMaintenance(item.value as unknown as MaintenanceSettings);
          }
          if (item.key === "coming_soon_mode" && item.value) {
            setComingSoon(item.value as unknown as ComingSoonSettings);
          }
          if (item.key === "category_coming_soon" && item.value) {
            setCategoryCS(prev => ({ ...prev, ...(item.value as Record<string, boolean>) }));
          }
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const valueToSave = {
      enabled: maintenance.enabled,
      message: maintenance.message,
      estimated_time: maintenance.estimated_time,
    };
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: "maintenance_mode", value: valueToSave, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success(maintenance.enabled ? "Maintenance mode enabled!" : "Settings saved!");
    }
    setSaving(false);
  };

  const handleSaveComingSoon = async () => {
    setSavingComingSoon(true);
    const valueToSave = {
      enabled: comingSoon.enabled,
      headline: comingSoon.headline,
      description: comingSoon.description,
      countdown_days: comingSoon.countdown_days,
      countdown_hours: comingSoon.countdown_hours,
      countdown_minutes: comingSoon.countdown_minutes,
      // Store the target timestamp so frontend can count down to it
      countdown_target: new Date(
        Date.now() +
        comingSoon.countdown_days * 86400000 +
        comingSoon.countdown_hours * 3600000 +
        comingSoon.countdown_minutes * 60000
      ).toISOString(),
    };

    // Upsert: insert if not exists, update if exists
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: "coming_soon_mode", value: valueToSave, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    if (error) {
      toast.error("Failed to save coming soon settings");
    } else {
      toast.success(comingSoon.enabled ? "Coming Soon mode enabled!" : "Coming Soon settings saved!");
    }
    setSavingComingSoon(false);
  };

  const toggleMaintenance = async () => {
    const updated = { ...maintenance, enabled: !maintenance.enabled };
    setMaintenance(updated);
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: "maintenance_mode", value: updated, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    if (error) toast.error("Failed to toggle maintenance mode");
    else toast.success(updated.enabled ? "Maintenance mode ON — site is now restricted" : "Maintenance mode OFF — site is live");
    setSaving(false);
  };

  const toggleComingSoon = async () => {
    const updated = { ...comingSoon, enabled: !comingSoon.enabled };
    setComingSoon(updated);
    setSavingComingSoon(true);
    const target = new Date(
      Date.now() +
      updated.countdown_days * 86400000 +
      updated.countdown_hours * 3600000 +
      updated.countdown_minutes * 60000
    ).toISOString();
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: "coming_soon_mode", value: { ...updated, countdown_target: target }, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    if (error) toast.error("Failed to toggle coming soon mode");
    else toast.success(updated.enabled ? "Coming Soon mode ON — site redirects to launch page" : "Coming Soon mode OFF — site is live");
    setSavingComingSoon(false);
  };

  const toggleCategoryCS = async (key: CategoryKey) => {
    const updated = { ...categoryCS, [key]: !categoryCS[key] };
    setCategoryCS(updated);
    setSavingCS(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "category_coming_soon", value: updated, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) toast.error("Failed to update");
    else toast.success(`${key.replace(/_/g, " ")} ${updated[key] ? "set to Coming Soon" : "is now Live"}`);
    setSavingCS(false);
  };

  const categoryLabels: Record<CategoryKey, string> = {
    credit_cards: "Credit Cards", loans: "Loans", insurance: "Insurance",
    bank_accounts: "Bank Accounts", demat_accounts: "Demat Accounts",
    fixed_deposits: "Fixed Deposits", cashback: "Cashback",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-heading font-bold">Settings</h1>

      {/* Category Coming Soon Toggles */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-heading text-lg">Category Visibility</CardTitle>
              <CardDescription>Toggle "Coming Soon" for individual product categories</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(categoryLabels) as CategoryKey[]).map(key => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{categoryLabels[key]}</p>
                  <p className="text-xs text-muted-foreground">{categoryCS[key] ? "Coming Soon" : "Live"}</p>
                </div>
                <Switch checked={categoryCS[key]} onCheckedChange={() => toggleCategoryCS(key)} disabled={savingCS} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Mode Card */}
      <Card className={comingSoon.enabled ? "border-primary/50" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${comingSoon.enabled ? "bg-primary/20" : "bg-muted"}`}>
                <Rocket className={`w-5 h-5 ${comingSoon.enabled ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <CardTitle className="font-heading text-lg">Coming Soon Mode</CardTitle>
                <CardDescription>Redirect all public pages to the Coming Soon page</CardDescription>
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <Switch
                checked={comingSoon.enabled}
                onCheckedChange={toggleComingSoon}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {comingSoon.enabled && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary text-sm">
              <Rocket className="w-4 h-4 shrink-0" />
              <span className="font-medium">Coming Soon mode is active! All public pages redirect to the launch page.</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="cs-headline">Headline</Label>
            <Input
              id="cs-headline"
              value={comingSoon.headline}
              onChange={(e) => setComingSoon({ ...comingSoon, headline: e.target.value })}
              placeholder="Something Powerful is Coming"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cs-description">Description</Label>
            <Textarea
              id="cs-description"
              value={comingSoon.description}
              onChange={(e) => setComingSoon({ ...comingSoon, description: e.target.value })}
              placeholder="We're building the future..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Custom Countdown Timer</Label>
            <p className="text-xs text-muted-foreground">Set how much time to show on the countdown. Timer starts when you save.</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="cs-days" className="text-xs text-muted-foreground">Days</Label>
                <Input
                  id="cs-days"
                  type="number"
                  min={0}
                  max={999}
                  value={comingSoon.countdown_days}
                  onChange={(e) => setComingSoon({ ...comingSoon, countdown_days: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cs-hours" className="text-xs text-muted-foreground">Hours</Label>
                <Input
                  id="cs-hours"
                  type="number"
                  min={0}
                  max={23}
                  value={comingSoon.countdown_hours}
                  onChange={(e) => setComingSoon({ ...comingSoon, countdown_hours: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cs-minutes" className="text-xs text-muted-foreground">Minutes</Label>
                <Input
                  id="cs-minutes"
                  type="number"
                  min={0}
                  max={59}
                  value={comingSoon.countdown_minutes}
                  onChange={(e) => setComingSoon({ ...comingSoon, countdown_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSaveComingSoon} disabled={savingComingSoon} className="w-full">
            {savingComingSoon ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Coming Soon Settings
          </Button>
        </CardContent>
      </Card>

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