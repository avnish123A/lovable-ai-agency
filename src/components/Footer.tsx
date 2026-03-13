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
    <footer className="border-t border-border bg-card relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 py-20 relative z-10">
        {/* Data Manifesto Section — Editorial style, not hidden in fine print */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 max-w-3xl"
        >
          <span className="tag-mono mb-4 inline-block">OUR DATA MANIFESTO</span>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-8 leading-tight">
            Your Data. <em className="italic">Your Rules.</em>
          </h3>
          <div className="space-y-5 text-muted-foreground leading-relaxed font-body">
            <p>
              <strong className="text-foreground font-bold">Zero Spam Guarantee.</strong> We will never sell your data to third parties. Your information stays with you — period.
            </p>
            <p>
              <strong className="text-foreground font-bold">Incognito Mode.</strong> Browse and compare financial products without creating an account. No tracking, no profiling, no manipulation.
            </p>
            <p>
              <strong className="text-foreground font-bold">Transparent Affiliations.</strong> We earn through affiliate partnerships, clearly disclosed. Our recommendations are never influenced by commission rates.
            </p>
          </div>
        </motion.div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img src="/logos/apninivesh-logo.png" alt="ApniNivesh" className="h-9 w-9 object-contain group-hover:scale-105 transition-transform duration-500 ease-luxury" />
              <span className="text-lg font-heading font-bold text-foreground">
                Apni<span className="text-gradient">Nivesh</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3 font-body">
              Compare the best credit cards, loans, insurance & investment products from India's top banks.
            </p>
            <p className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">
              By Inspirex Technologies INC
            </p>
          </motion.div>
          {Object.entries(footerLinks).map(([title, links], colIdx) => (
            <motion.div 
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + colIdx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h4 className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 inline-block font-body">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground">© {new Date().getFullYear()} ApniNivesh by Inspirex Technologies INC</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Privacy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Terms</Link>
            <Link to="/disclaimer" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
