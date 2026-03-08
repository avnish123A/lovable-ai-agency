import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustBadge from "@/components/TrustBadge";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().optional(),
  service: z.string().optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      service: form.service || null,
      message: form.message.trim(),
    });

    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">
              Have a question about our financial products or partnership opportunities? We'd love to hear from you.
            </p>
            <TrustBadge variant="secure" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="p-6 rounded-2xl border border-border bg-card shadow-card">
                <h3 className="font-heading font-bold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                      <p className="text-sm font-medium text-foreground">contact@kriyapay.co.in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                      <p className="text-sm font-medium text-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Office</p>
                      <p className="text-sm font-medium text-foreground">Inspirex Technologies<br />India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-bold text-foreground text-sm">Quick Response</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We typically respond within 24 hours. For urgent matters regarding financial products,
                  please mention "URGENT" in your message subject.
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-card">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }} className="rounded-xl">
                      Send Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block">Full Name *</label>
                        <Input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="rounded-xl" />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block">Email *</label>
                        <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="rounded-xl" />
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block">Phone</label>
                        <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="rounded-xl" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block">Subject</label>
                        <select
                          name="service"
                          value={form.service}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select topic</option>
                          <option value="credit-cards">Credit Cards</option>
                          <option value="loans">Personal Loans</option>
                          <option value="insurance">Insurance</option>
                          <option value="partnership">Partnership</option>
                          <option value="support">Support</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1.5 block">Message *</label>
                      <Textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help you?" rows={5} className="rounded-xl resize-none" />
                      {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                      {submitting ? "Sending..." : "Send Message"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
