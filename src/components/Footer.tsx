import { Diamond } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-14">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <a href="#" className="flex items-center gap-2 font-heading text-sm font-bold tracking-tight text-foreground">
            <Diamond size={14} className="text-primary" />
            NEXUS<span className="text-gradient">AI</span>
          </a>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            © {new Date().getFullYear()} Nexus AI. All rights reserved.
          </p>
          <div className="flex gap-8">
            {["Twitter", "LinkedIn", "GitHub"].map((link) => (
              <a key={link} href="#" className="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-500">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
