import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const linkVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.4 },
    }),
  };

  return (
    <footer className="border-t border-border/30 py-20 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-primary/3 blur-[150px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          <div>
            <Link to="/" className="flex items-center gap-2.5 font-heading text-lg font-bold text-foreground mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-cta flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              NEXUS<span className="text-gradient">AI</span>
            </Link>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Expert team of AI specialists and professional developers building the future of digital.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground text-sm mb-5">Services</h4>
            <div className="space-y-3">
              {["AI Services", "Web Development", "UI/UX Design", "Digital Marketing"].map((s, i) => (
                <motion.div key={s} custom={i} variants={linkVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link to="/services" className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">{s}</Link>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground text-sm mb-5">Company</h4>
            <div className="space-y-3">
              {[
                { label: "About", to: "/about" },
                { label: "Portfolio", to: "/portfolio" },
                { label: "Contact", to: "/contact" },
              ].map((link, i) => (
                <motion.div key={link.label} custom={i} variants={linkVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link to={link.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">{link.label}</Link>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground text-sm mb-5">Connect</h4>
            <div className="space-y-3">
              {["Twitter", "LinkedIn", "GitHub"].map((link, i) => (
                <motion.div key={link} custom={i} variants={linkVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-light">{link}</a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="divider-line w-full mb-8" />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground"
        >
          © {new Date().getFullYear()} Nexus AI. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
