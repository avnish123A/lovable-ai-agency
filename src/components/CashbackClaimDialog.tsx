import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Gift, ArrowRight, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const claimSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number"),
  upi_id: z.string().trim().regex(/^[\w.\-]+@[\w]+$/, "Enter valid UPI ID (e.g. name@upi)"),
});

interface Deal {
  id: string;
  merchant_name: string;
  offer_title: string;
  cashback_amount: string;
  tracking_link: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
}

const CashbackClaimDialog = ({ open, onOpenChange, deal }: Props) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", upi_id: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const generateTrackingId = () => {
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).substring(2, 8);
    return `AN-${ts}-${rand}`.toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deal) return;

    // Honeypot check
    if (honeypot) return;

    const result = claimSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const trackingId = generateTrackingId();
      const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";

      const { error } = await supabase
        .from("cashback_requests" as any)
        .insert({
          deal_id: deal.id,
          tracking_id: trackingId,
          user_name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          upi_id: result.data.upi_id,
          cashback_amount: deal.cashback_amount,
          device: deviceType,
        } as any);

      if (error) throw error;

      toast.success("Cashback request submitted! Redirecting...");
      setForm({ name: "", email: "", phone: "", upi_id: "" });
      onOpenChange(false);

      // Redirect to tracking link after short delay
      setTimeout(() => {
        const link = deal.tracking_link.includes("?")
          ? `${deal.tracking_link}&subid=${trackingId}`
          : `${deal.tracking_link}?subid=${trackingId}`;
        window.open(link, "_blank");
      }, 500);
    } catch (err: any) {
      console.error("Cashback claim error:", err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Claim Your Cashback
          </DialogTitle>
          <DialogDescription>
            {deal && (
              <span className="text-sm">
                <strong>{deal.merchant_name}</strong> — {deal.offer_title} · <span className="text-green-600 font-semibold">{deal.cashback_amount}</span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={e => setHoneypot(e.target.value)}
            className="absolute -top-[9999px] -left-[9999px]"
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <Label>Full Name</Label>
            <Input placeholder="Your full name" value={form.name} onChange={e => updateField("name", e.target.value)} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="your@email.com" value={form.email} onChange={e => updateField("email", e.target.value)} />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input placeholder="10-digit mobile number" value={form.phone} onChange={e => updateField("phone", e.target.value)} maxLength={10} />
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label>UPI ID</Label>
            <Input placeholder="yourname@upi" value={form.upi_id} onChange={e => updateField("upi_id", e.target.value)} />
            {errors.upi_id && <p className="text-xs text-destructive mt-1">{errors.upi_id}</p>}
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Shield className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
            <span>Your data is secure. We only use your UPI ID to send cashback. You'll be redirected to complete the purchase.</span>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl font-semibold">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
            {loading ? "Submitting..." : "Get Cashback Now"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CashbackClaimDialog;
