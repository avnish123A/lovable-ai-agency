import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Diamond } from "lucide-react";

const navItems = ["Services", "Portfolio", "About", "Pricing", "Contact"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "border-b border-border/50 backdrop-blur-2xl bg-background/80 shadow-elegant"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-5 px-6">
        <a href="#" className="flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight text-foreground">
          <Diamond size={20} className="text-primary" />
          NEXUS<span className="text-gradient">AI</span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-body font-medium text-muted-foreground hover:text-primary transition-colors duration-500 tracking-wide uppercase"
              style={{ fontSize: "11px", letterSpacing: "0.15em" }}
            >
              {item}
            </a>
          ))}
          <a
            href="#contact"
            className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-sm bg-primary text-primary-foreground hover:shadow-glow transition-all duration-500"
          >
            Get Started
          </a>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
              <a
                href="#contact"
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-sm bg-primary text-primary-foreground text-center"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
