import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustBadge from "@/components/TrustBadge";
import SEOHead from "@/components/SEOHead";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().optional(),
  service: z.string().optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

interface ContactInfo {
  email: string; phone: string; address: string; working_hours: string;
  whatsapp: string; instagram: string; facebook: string; twitter: string; map_embed: string;
}

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "contact@apninivesh.in", phone: "+91 98765 43210",
    address: "Inspirex Technologies INC, Rajasthan, India", working_hours: "Mon-Fri: 10:00 AM - 6:00 PM",
    whatsapp: "", instagram: "", facebook: "", twitter: "", map_embed: "",
  });

  useEffect(() => {
    const fetchContact = async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "contact_info").maybeSingle();
      if (data?.value && typeof data.value === "object") {
        setContactInfo(prev => ({ ...prev, ...(data.value as Record<string, string>) }));
      }
    };
    fetchContact();
    const ch = supabase.channel("contact-rt").on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => fetchContact()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

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
      name: form.name.trim(), email: form.email.trim(),
      phone: form.phone.trim() || null, service: form.service || null, message: form.message.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    }
  };

  const socialLinks = [
    contactInfo.whatsapp && { label: "WhatsApp", href: `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, "")}` },
    contactInfo.instagram && { label: "Instagram", href: contactInfo.instagram },
    contactInfo.facebook && { label: "Facebook", href: contactInfo.facebook },
    contactInfo.twitter && { label: "Twitter", href: contactInfo.twitter },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Contact Us - ApniNivesh | Financial Services Support" description="Get in touch with ApniNivesh for credit cards, loans, insurance queries. We respond within 24 hours." canonical="https://apninivesh.in/contact" />
      <Navbar />
      <section className="pt-28 pb-24 relative overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Get in <span className="text-gradient">Touch</span></h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-xl mx-auto mb-4">Have a question about our financial products or partnership opportunities? We'd love to hear from you.</motion.p>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
              <TrustBadge variant="secure" />
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl border border-border bg-card shadow-card">
                <h3 className="font-heading font-bold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-primary" /></div>
                    <div><p className="text-xs text-muted-foreground mb-0.5">Email</p><p className="text-sm font-medium text-foreground">{contactInfo.email}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0"><Phone className="w-4 h-4 text-primary" /></div>
                    <div><p className="text-xs text-muted-foreground mb-0.5">Phone</p><p className="text-sm font-medium text-foreground">{contactInfo.phone}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-primary" /></div>
                    <div><p className="text-xs text-muted-foreground mb-0.5">Office</p><p className="text-sm font-medium text-foreground whitespace-pre-line">{contactInfo.address}</p></div>
                  </div>
                  {contactInfo.working_hours && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-primary" /></div>
                      <div><p className="text-xs text-muted-foreground mb-0.5">Working Hours</p><p className="text-sm font-medium text-foreground">{contactInfo.working_hours}</p></div>
                    </div>
                  )}
                </div>
              </div>

              {socialLinks.length > 0 && (
                <div className="p-6 rounded-2xl border border-border bg-card shadow-card">
                  <h3 className="font-heading font-bold text-foreground text-sm mb-3">Follow Us</h3>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map(s => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-foreground hover:bg-primary/10 transition-colors flex items-center gap-1">
                        {s.label} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 rounded-2xl border border-border bg-card shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-bold text-foreground text-sm">Quick Response</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">We typically respond within 24 hours. For urgent matters regarding financial products, please mention "URGENT" in your message subject.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="lg:col-span-3">
              <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-card relative overflow-hidden">
                {/* Subtle shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent pointer-events-none"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 8 }}
                />
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-accent" /></div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }} className="rounded-xl">Send Another</Button>
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
                        <select name="service" value={form.service} onChange={handleChange} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          <option value="">Select topic</option>
                          <option value="credit-cards">Credit Cards</option>
                          <option value="loans">Personal Loans</option>
                          <option value="insurance">Insurance</option>
                          <option value="bank-account">Bank Account</option>
                          <option value="demat">Demat Account</option>
                          <option value="fixed-deposit">Fixed Deposit</option>
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
                      {submitting ? "Sending..." : "Send Message"} <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}
              </div>

              {contactInfo.map_embed && (
                <div className="mt-6 rounded-2xl overflow-hidden border border-border">
                  <iframe src={contactInfo.map_embed} width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Office Location" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
