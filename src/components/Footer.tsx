import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { useEffect } from "react";

const footerLinks = {
  Products: [
    { label: "Credit Cards", href: "/credit-cards" },
    { label: "Personal Loans", href: "/loans" },
    { label: "Compare Products", href: "/compare" },
    { label: "Cashback Offers", href: "/cashback" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Finance Tools", href: "/tools" },
    { label: "EMI Calculator", href: "/emi-calculator" },
    { label: "Eligibility Checker", href: "/eligibility" },
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
      s.src =
        document.location.protocol === "https:"
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
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-glow-sm">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold text-foreground">
                Kriya<span className="text-accent">pay</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Compare the best credit cards, loans, and insurance offers from India's top banks.
            </p>
            <p className="text-xs text-muted-foreground">
              A product by <strong className="text-foreground">Inspirex Technologies</strong>
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Kriyapay by Inspirex Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-accent transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-accent transition-colors">Terms</Link>
            <Link to="/disclaimer" className="text-xs text-muted-foreground hover:text-accent transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
