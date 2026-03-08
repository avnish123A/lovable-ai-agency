import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    text: "ApniNivesh helped me find a credit card with 5X rewards on online shopping. Saved ₹15,000 in the first year!",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Business Owner",
    text: "The loan comparison tool made it easy to find the lowest interest rate. Got approved within 24 hours.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Marketing Manager",
    text: "I love the cashback offers section. I check ApniNivesh before every major purchase now.",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
            Loved by <span className="text-gradient">50,000+</span> Users
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            See how ApniNivesh is helping people save money and make smarter financial choices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card shadow-card p-6"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3.5 h-3.5 ${idx < t.rating ? "text-accent fill-accent" : "text-muted"}`}
                  />
                ))}
              </div>
              <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
