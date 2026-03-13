import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", role: "Software Engineer", text: "ApniNivesh helped me find a credit card with 5X rewards on online shopping. Saved ₹15,000 in the first year!", rating: 5 },
  { name: "Rahul Verma", role: "Business Owner", text: "The loan comparison tool made it easy to find the lowest interest rate. Got approved within 24 hours.", rating: 5 },
  { name: "Ananya Patel", role: "Marketing Manager", text: "I love the cashback offers section. I check ApniNivesh before every major purchase now.", rating: 4 },
];

const TestimonialsSection = () => (
  <section className="py-28 relative overflow-hidden section-dark">
    {/* Grid */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: 'linear-gradient(hsl(48 30% 95% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(48 30% 95% / 0.3) 1px, transparent 1px)',
      backgroundSize: '80px 80px'
    }} />

    <div className="container mx-auto px-4 md:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-md border inline-block mb-6" style={{
          color: 'hsl(72 100% 50%)',
          borderColor: 'hsl(72 100% 50% / 0.3)',
          background: 'hsl(72 100% 50% / 0.06)'
        }}>
          TESTIMONIALS
        </span>
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight" style={{ color: 'hsl(48 30% 95%)' }}>
          Loved by <span className="font-mono" style={{ color: 'hsl(72 100% 50%)' }}>50,000+</span> Users
        </h2>
        <p className="max-w-md mx-auto font-body" style={{ color: 'hsl(160 8% 55%)' }}>
          See how ApniNivesh is helping people make smarter financial choices.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-7 border cursor-default transition-all duration-500 ease-luxury hover:-translate-y-2"
            style={{ 
              borderColor: 'hsl(150 30% 16% / 0.5)',
              background: 'hsl(150 45% 9% / 0.5)'
            }}
          >
            <Quote className="w-8 h-8 mb-4" style={{ color: 'hsl(72 100% 50% / 0.3)' }} />
            <p className="text-sm leading-relaxed mb-5 font-body" style={{ color: 'hsl(160 8% 65%)' }}>"{t.text}"</p>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className={`w-3.5 h-3.5 ${idx < t.rating ? "fill-current" : ""}`} style={{ color: idx < t.rating ? 'hsl(72 100% 50%)' : 'hsl(150 30% 20%)' }} />
              ))}
            </div>
            <p className="font-heading font-semibold text-sm" style={{ color: 'hsl(48 30% 95%)' }}>{t.name}</p>
            <p className="text-xs font-mono" style={{ color: 'hsl(160 8% 55%)' }}>{t.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
