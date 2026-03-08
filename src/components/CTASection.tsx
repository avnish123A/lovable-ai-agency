import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Diamond, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CTASection = () => {
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

  const inputClass = "w-full h-11 px-4 rounded-sm border border-border/40 bg-background/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all";

  return (
    <section id="contact" className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-3xl mx-auto p-14 sm:p-20 rounded-sm bg-gradient-card border-gradient overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/8 blur-[150px] rounded-full" />
          <div className="relative z-10">
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", delay: 0.2 }}>
              <Diamond size={32} className="text-primary mx-auto mb-8" />
            </motion.div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-5 text-center">
              Ready to elevate with <span className="text-gradient italic">AI</span>?
            </h2>
            <div className="gold-line w-16 mx-auto mb-8" />

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <CheckCircle size={48} className="text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Thank you!</h3>
                <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input className={inputClass} placeholder="Your Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <input className={inputClass} type="email" placeholder="Email *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  <input className={inputClass} placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  <select className={inputClass} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                    <option value="">Select Service</option>
                    <option value="AI Agents">AI Agents</option>
                    <option value="AI Chatbot">AI Chatbot</option>
                    <option value="MLOps Pipeline">MLOps Pipeline</option>
                    <option value="Custom Integration">Custom Integration</option>
                    <option value="Automation">Automation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <textarea className={`${inputClass} h-28 py-3`} placeholder="Tell us about your project *" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <div className="text-center pt-2">
                  <button type="submit" disabled={loading}
                    className="group inline-flex items-center gap-3 px-10 py-4 rounded-sm bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-widest shadow-glow hover:shadow-glow-accent hover:scale-[1.02] transition-all duration-500 disabled:opacity-60">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send Message <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </div>
                <p className="text-center text-xs text-muted-foreground uppercase tracking-wider">Free consultation · No commitment required</p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
