import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

const footerLinks = {
  Products: [
    { label: "Credit Cards", href: "/credit-cards" },
    { label: "Personal Loans", href: "/loans" },
    { label: "Insurance", href: "/insurance" },
    { label: "Bank Accounts", href: "/bank-accounts" },
    { label: "Demat Accounts", href: "/demat-accounts" },
    { label: "Fixed Deposits", href: "/fixed-deposits" },
    { label: "Cashback Offers", href: "/cashback" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Finance Tools", href: "/tools" },
    { label: "EMI Calculator", href: "/emi-calculator" },
    { label: "Eligibility Checker", href: "/eligibility" },
    { label: "Compare Products", href: "/compare" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
};

const Footer = () => {
  useEffect(() => {
    if (!document.getElementById("cuelinks-script")) {
      const cIdScript = document.createElement("script");
      cIdScript.id = "cuelinks-cid";
      cIdScript.type = "text/javascript";
      cIdScript.textContent = "var cId = '211481';";
      document.body.appendChild(cIdScript);

      const s = document.createElement("script");
      s.id = "cuelinks-script";
      s.type = "text/javascript";
      s.async = true;
      s.src = document.location.protocol === "https:"
        ? "https://cdn0.cuelinks.com/js/cuelinksv2.js"
        : "http://cdn0.cuelinks.com/js/cuelinksv2.js";
      document.body.appendChild(s);
    }

    if (!document.getElementById("earnkaro-script")) {
      const ekScript = document.createElement("script");
      ekScript.id = "earnkaro-script";
      ekScript.type = "text/javascript";
      ekScript.async = true;
      ekScript.src = "https://ekaro.in/smart-link.js";
      ekScript.setAttribute("data-ek-id", "EARNKARO_USER_ID");
      document.body.appendChild(ekScript);
    }
  }, []);

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-border bg-card relative overflow-hidden"
    >
      {/* Subtle bg accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img src="/logos/apninivesh-logo.png" alt="ApniNivesh" className="h-9 w-9 object-contain group-hover:scale-110 transition-transform" />
              <span className="text-xl font-heading font-bold text-foreground">
                Apni<span className="text-accent">Nivesh</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Compare the best credit cards, loans, insurance & investment products from India's top banks.
            </p>
            <p className="text-xs text-muted-foreground">
              A product by <strong className="text-foreground">Inspirex Technologies INC</strong>
            </p>
          </motion.div>
          {Object.entries(footerLinks).map(([title, links], colIdx) => (
            <motion.div 
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + colIdx * 0.08, duration: 0.5 }}
            >
              <h4 className="font-heading font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ApniNivesh by Inspirex Technologies INC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="/disclaimer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
