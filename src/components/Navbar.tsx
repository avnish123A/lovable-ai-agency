import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, Search, Bot, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const productLinks = [
  { label: "Credit Cards", href: "/credit-cards" },
  { label: "Loans", href: "/loans" },
  { label: "Insurance", href: "/insurance" },
  { label: "Bank Accounts", href: "/bank-accounts" },
  { label: "Demat Accounts", href: "/demat-accounts" },
  { label: "Fixed Deposits", href: "/fixed-deposits" },
  { label: "Cashback", href: "/cashback" },
];

const navLinks = [
  { label: "Products", href: "#", children: productLinks },
  { label: "Finance Tools", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-glow-sm">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-foreground">
              Kriya<span className="text-primary">pay</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                  <button className="px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center gap-1">
                    {link.label} <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute top-full left-0 mt-1 w-48 rounded-xl border border-border bg-card shadow-lg p-2 z-50"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              location.pathname === child.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === link.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl">
              <Bot className="w-4 h-4" />
            </Button>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold shadow-glow-sm">
              <Link to="/credit-cards">Apply Now</Link>
            </Button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-foreground">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {productLinks.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link
                    to={link.href}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-border my-2" />
              {[{ label: "Finance Tools", href: "/tools" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }].map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (productLinks.length + i) * 0.03 }}>
                  <Link
                    to={link.href}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1 rounded-xl">
                  <Link to="/eligibility">Eligibility</Link>
                </Button>
                <Button asChild size="sm" className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/credit-cards">Apply Now</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
