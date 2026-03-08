import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { useEffect } from "react";

const footerLinks = {
  Products: [
    { label: "Credit Cards", href: "/credit-cards" },
    { label: "Personal Loans", href: "/loans" },
    { label: "Finance Deals", href: "/finance-deals" },
    { label: "Cashback Offers", href: "/cashback" },
  ],
  Tools: [
    { label: "EMI Calculator", href: "/emi-calculator" },
    { label: "Eligibility Checker", href: "/eligibility" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

const Footer = () => {
  useEffect(() => {
    // Load Cuelinks smart link tracking script
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
  }, []);

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold text-foreground">
                Money<span className="text-primary">Mint</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find the best credit cards, loans, and cashback offers. Compare, choose, and save smarter.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} MoneyMint. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
