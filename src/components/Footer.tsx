import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-16">
      <div className="container mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold text-foreground mb-4">
              <div className="w-7 h-7 rounded-md bg-gradient-cta flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">N</span>
              </div>
              NEXUS<span className="text-gradient">AI</span>
            </Link>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Expert team of AI specialists and professional developers building the future of digital.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground text-sm mb-4">Services</h4>
            <div className="space-y-2.5">
              {["AI Services", "Web Development", "UI/UX Design", "Digital Marketing"].map((s) => (
                <Link key={s} to="/services" className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-light">{s}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground text-sm mb-4">Company</h4>
            <div className="space-y-2.5">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-light">About</Link>
              <Link to="/portfolio" className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-light">Portfolio</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-light">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-foreground text-sm mb-4">Connect</h4>
            <div className="space-y-2.5">
              {["Twitter", "LinkedIn", "GitHub"].map((link) => (
                <a key={link} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-light">{link}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="divider-line w-full mb-8" />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nexus AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
