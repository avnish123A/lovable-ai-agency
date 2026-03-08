import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Services", path: "/services" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "About", path: "/about" },
  { label: "Pricing", path: "/#pricing" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.startsWith("/#")) {
      if (location.pathname === "/") {
        const el = document.getElementById(path.substring(2));
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/50 backdrop-blur-2xl bg-background/80 shadow-elegant"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-foreground">
          <div className="w-8 h-8 rounded-lg bg-gradient-cta flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">N</span>
          </div>
          NEXUS<span className="text-gradient">AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            item.path.startsWith("/#") ? (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.label}
                to={item.path}
                className={`text-[13px] font-medium transition-colors duration-300 ${
                  location.pathname === item.path ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            to="/contact"
            className="px-5 py-2 text-[13px] font-semibold rounded-lg bg-gradient-cta text-primary-foreground hover:shadow-glow transition-all duration-300"
          >
            Get Started
          </Link>
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
            <div className="flex flex-col gap-3 p-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-gradient-cta text-primary-foreground text-center mt-2"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
