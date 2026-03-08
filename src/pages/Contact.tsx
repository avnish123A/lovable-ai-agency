import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError("Please fill in all required fields."); return; }
    setLoading(true);
    setError("");

    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      service: form.service || null,
      message: form.message,
    });

    if (dbError) { setError("Something went wrong. Please try again."); setLoading(false); return; }
    setSubmitted(true);
    setLoading(false);
  };

  const inputClass = "w-full h-11 px-4 rounded-lg border border-border/50 bg-card/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Contact Us</p>
            <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight mb-5">
              Let's Start Your <span className="text-gradient">Project</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Tell us about your project and our expert team will get back to you within 24 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-5"
            >
              {[
                { icon: Mail, label: "Email", value: "hello@nexusai.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Location", value: "San Francisco, CA" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-card border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <MessageCircle size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">WhatsApp</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Chat with us →</p>
                </div>
              </a>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 p-8 rounded-2xl bg-gradient-card border border-border/50"
            >
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <CheckCircle size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Thank you!</h3>
                  <p className="text-muted-foreground">Our team will get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name *</label>
                      <input className={inputClass} placeholder="John Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email *</label>
                      <input className={inputClass} type="email" placeholder="john@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone</label>
                      <input className={inputClass} placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Service</label>
                      <select className={inputClass} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                        <option value="">Select a service</option>
                        <option value="AI Automation">AI Automation</option>
                        <option value="AI Chatbot">AI Chatbot</option>
                        <option value="Website Development">Website Development</option>
                        <option value="E-commerce">E-commerce Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Brand Identity">Brand Identity</option>
                        <option value="SEO">SEO Optimization</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Project Details *</label>
                    <textarea className={`${inputClass} h-32 py-3`} placeholder="Tell us about your project, goals, and timeline..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}
                  <button type="submit" disabled={loading}
                    className="group w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-cta text-primary-foreground font-semibold text-sm shadow-glow hover:scale-[1.01] transition-all duration-300 disabled:opacity-60">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send Message <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">Free consultation · No commitment required</p>
                </form>
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
