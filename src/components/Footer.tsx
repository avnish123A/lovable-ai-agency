import { Bot } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2 font-heading text-sm font-bold tracking-tight text-foreground">
          <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Bot size={12} className="text-primary" />
          </div>
          NEXUS<span className="text-gradient">AI</span>
        </a>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nexus AI. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Twitter", "LinkedIn", "GitHub"].map((link) => (
            <a key={link} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
