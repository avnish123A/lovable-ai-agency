import { useState, useRef } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { submitLeadToGoogleSheet } from "@/lib/google-sheets-lead";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(15)
    .regex(/^[+]?[\d\s-]{10,15}$/, "Invalid phone format"),
  city: z.string().trim().min(1, "City is required").max(100),
  salary_range: z.string().min(1, "Select salary range"),
});

interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: any;
  onSuccess: () => void;
}

const SALARY_RANGES = [
  "Below ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹2,00,000",
  "Above ₹2,00,000",
];

const LeadCaptureDialog = ({ open, onOpenChange, deal, onSuccess }: LeadCaptureDialogProps) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", salary_range: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    // Honeypot check — if filled, silently reject
    if (honeypotRef.current?.value) {
      toast({ title: "Application submitted!", description: "We'll contact you shortly with the best offers." });
      onOpenChange(false);
      return;
    }

    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const productName = deal?.subcategory
      ? (deal.subcategory as string).replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
      : "Finance";

    // 1. Send to Google Sheets
    try {
      await submitLeadToGoogleSheet({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        income: form.salary_range,
        product: deal?.title || productName,
      });
    } catch (err: any) {
      if (err?.message?.includes("wait")) {
        toast({ title: "Too fast!", description: err.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }
      console.error("Google Sheet error:", err);
    }

    // 2. Also save to Supabase for backup
    const { error } = await supabase.from("leads").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      salary_range: form.salary_range,
      service: deal?.subcategory || "finance",
      notes: `Deal: ${deal?.title || "Unknown"}`,
      deal_id: deal?.id || null,
    });

    setSubmitting(false);

    if (error) {
      console.error("Supabase lead error:", error);
    }

    toast({ title: "Your application has been submitted successfully.", description: "Redirecting you to the partner page..." });
    setForm({ name: "", email: "", phone: "", city: "", salary_range: "" });
    onOpenChange(false);

    // Redirect to partner tracking link after form submission
    if (deal?.tracking_link) {
      setTimeout(() => {
        window.open(deal.tracking_link, "_blank", "noopener");
      }, 500);
    }
    onSuccess();
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-foreground">Apply for {deal?.title || "this offer"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in your details and we'll connect you with the best offer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Honeypot — hidden from users, catches bots */}
          <input
            ref={honeypotRef}
            type="text"
            name="website_url"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute opacity-0 h-0 w-0 pointer-events-none"
          />

          <div>
            <Label className="text-foreground">Full Name</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Doe" className="mt-1" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label className="text-foreground">Phone Number</Label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 9876543210" className="mt-1" />
            {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
          </div>
          <div>
            <Label className="text-foreground">Email</Label>
            <Input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" type="email" className="mt-1" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label className="text-foreground">City</Label>
            <Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Mumbai" className="mt-1" />
            {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
          </div>
          <div>
            <Label className="text-foreground">Monthly Income</Label>
            <Select value={form.salary_range} onValueChange={(v) => update("salary_range", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select salary range" />
              </SelectTrigger>
              <SelectContent>
                {SALARY_RANGES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.salary_range && <p className="text-xs text-destructive mt-1">{errors.salary_range}</p>}
          </div>
          <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {submitting ? "Submitting..." : "Apply Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureDialog;
