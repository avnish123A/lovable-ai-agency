import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Nexus AI transformed our customer support overnight. Response times dropped from 24 hours to instant, and our customers actually prefer the AI experience.",
    name: "Sarah Chen",
    title: "CTO, Meridian Health",
    metric: "85% faster response",
  },
  {
    quote: "The ROI was immediate. Within the first month, our AI agent was qualifying leads better than our sales team, and conversions jumped by 40%.",
    name: "Marcus Rivera",
    title: "VP Sales, TechFlow",
    metric: "40% more conversions",
  },
  {
    quote: "From first call to production in just 12 days. The professional developers at Nexus AI operate at a level we haven't seen elsewhere.",
    name: "Emily Zhang",
    title: "Founder, DataScale",
    metric: "12-day deployment",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Testimonials</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Trusted by <span className="text-gradient">Leaders</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            Hear from the companies who chose to build with our expert team.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="p-7 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/20 transition-all duration-500 flex flex-col"
            >
              <Quote size={20} className="text-primary/40 mb-4" />
              <p className="text-foreground/90 leading-relaxed mb-6 flex-1 font-light text-[15px]">
                "{t.quote}"
              </p>
              <div className="divider-line w-full mb-5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.title}</p>
                </div>
                <span className="text-[11px] font-semibold text-primary">{t.metric}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
