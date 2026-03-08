import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const highlights = [
  "50+ successful projects delivered worldwide",
  "Team of 15+ industry specialists",
  "SOC 2 & GDPR compliant infrastructure",
  "Average 3× ROI within first quarter",
];

const AboutSection = () => {
  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">About Us</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              A Team of <span className="text-gradient">Experts</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-light">
              We are a team of experienced professionals and industry specialists who deliver 
              high-quality digital solutions. Our expert developers, AI specialists, and experienced 
              designers work together to help businesses grow and innovate.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                  <span className="font-light">{item}</span>
                </motion.div>
              ))}
            </div>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground transition-colors"
            >
              Learn more about us
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "10+", label: "Years Experience" },
              { value: "50+", label: "Clients Served" },
              { value: "200+", label: "Projects Done" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-card border border-border/50 text-center"
              >
                <div className="font-heading text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
