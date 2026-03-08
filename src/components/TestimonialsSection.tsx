import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Nexus AI transformed our customer support overnight. We went from 24-hour response times to instant, intelligent conversations that our customers actually prefer over human agents.",
    name: "Sarah Chen",
    title: "CTO, Meridian Health",
    metric: "85% faster response",
  },
  {
    quote: "The ROI was immediate. Within the first month, our AI agent was qualifying leads better than our sales team, and the conversion rate jumped by 40%.",
    name: "Marcus Rivera",
    title: "VP Sales, TechFlow",
    metric: "40% more conversions",
  },
  {
    quote: "What impressed us most was the speed — from first call to production deployment in just 12 days. The team at Nexus AI operates at a level we haven't seen elsewhere.",
    name: "Emily Zhang",
    title: "Founder, DataScale",
    metric: "12-day deployment",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-20" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">Testimonials</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            Voices of <span className="text-gradient italic">Trust</span>
          </h2>
          <div className="gold-line w-16 mx-auto mb-6" />
          <p className="text-muted-foreground text-lg leading-relaxed font-light">
            Hear from the leaders who chose to build with Nexus AI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="p-8 rounded-sm bg-gradient-card border-gradient hover:shadow-glow-sm transition-all duration-500 flex flex-col"
            >
              <Quote size={24} className="text-primary/40 mb-5" />
              <p className="text-foreground/90 leading-relaxed mb-8 flex-1 font-light italic">
                "{t.quote}"
              </p>
              <div className="gold-line w-full mb-6" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.title}</p>
                </div>
                <span className="text-xs uppercase tracking-wider text-primary font-medium">{t.metric}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
