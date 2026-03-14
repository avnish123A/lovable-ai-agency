import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", role: "Software Engineer", text: "ApniNivesh helped me find a credit card with 5X rewards on online shopping. Saved ₹15,000 in the first year!", rating: 5 },
  { name: "Rahul Verma", role: "Business Owner", text: "The loan comparison tool made it easy to find the lowest interest rate. Got approved within 24 hours.", rating: 5 },
  { name: "Ananya Patel", role: "Marketing Manager", text: "I love the cashback offers section. I check ApniNivesh before every major purchase now.", rating: 4 },
];

const TestimonialsSection = () => (
  <section className="py-24 bg-card">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-14"
      >
        <span className="tag-mono mb-4 inline-block">Testimonials</span>
        <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight text-foreground">
          Loved by <span className="text-primary">50,000+</span> Users
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          See how ApniNivesh is helping people make smarter financial choices.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-7 bg-background border border-border transition-all duration-500 ease-luxury hover:-translate-y-2 hover:shadow-apple"
          >
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className={`w-4 h-4 ${idx < t.rating ? "fill-current text-amber-400" : "text-border"}`} />
              ))}
            </div>
            <p className="text-sm leading-relaxed mb-5 text-foreground">"{t.text}"</p>
            <p className="font-semibold text-sm text-foreground">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
