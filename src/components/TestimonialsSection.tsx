import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "Nexus AI transformed our customer support overnight. Response times dropped from 24 hours to instant, and our customers actually prefer the AI experience.",
    name: "Sarah Chen",
    title: "CTO, Meridian Health",
    metric: "85% faster response",
    rating: 5,
  },
  {
    quote: "The ROI was immediate. Within the first month, our AI agent was qualifying leads better than our sales team, and conversions jumped by 40%.",
    name: "Marcus Rivera",
    title: "VP Sales, TechFlow",
    metric: "40% more conversions",
    rating: 5,
  },
  {
    quote: "From first call to production in just 12 days. The professional developers at Nexus AI operate at a level we haven't seen elsewhere.",
    name: "Emily Zhang",
    title: "Founder, DataScale",
    metric: "12-day deployment",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4">Testimonials</p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            Trusted by <span className="text-gradient">Leaders</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="divider-line w-20 mx-auto mb-6"
          />
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            Hear from the companies who chose to build with our expert team.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="card-hover p-8 rounded-2xl bg-gradient-card border border-border/50 flex flex-col relative overflow-hidden"
            >
              {/* Subtle top gradient */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              <Quote size={22} className="text-primary/30 mb-5" />

              {/* Star rating */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <motion.div
                    key={si}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + si * 0.08, type: "spring", stiffness: 300 }}
                  >
                    <Star size={14} className="text-primary fill-primary" />
                  </motion.div>
                ))}
              </div>

              <p className="text-foreground/85 leading-relaxed mb-7 flex-1 font-light text-[15px]">
                "{t.quote}"
              </p>
              <div className="divider-line w-full mb-5" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.title}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-primary tracking-wide">{t.metric}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
