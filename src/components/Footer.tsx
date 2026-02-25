const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-heading text-sm font-bold tracking-tight text-foreground">
          NEXUS<span className="text-gradient">AI</span>
        </span>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nexus AI. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Twitter", "LinkedIn", "GitHub"].map((link) => (
            <a key={link} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
