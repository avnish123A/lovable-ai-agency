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

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -10 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Floating background accent */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[15%] w-72 h-72 bg-primary/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
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
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
              className="rounded-2xl border border-border bg-card shadow-card p-6 relative overflow-hidden group cursor-default"
            >
              {/* Hover shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 200 }}
                >
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                </motion.div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.15 + idx * 0.05, type: "spring", stiffness: 300 }}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${idx < t.rating ? "text-accent fill-accent" : "text-muted"}`}
                      />
                    </motion.div>
                  ))}
                </div>
                <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
