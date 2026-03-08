import { Info } from "lucide-react";

interface AffiliateDisclaimerProps {
  variant?: "inline" | "banner";
  className?: string;
}

const AffiliateDisclaimer = ({ variant = "inline", className = "" }: AffiliateDisclaimerProps) => {
  if (variant === "banner") {
    return (
      <div className={`bg-secondary/50 border border-border rounded-xl p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Affiliate Disclosure:</strong> ApniNivesh is a comparison
            platform and may earn commissions from partner financial institutions when users apply for
            products through our affiliate links. This does not affect the ranking or information
            displayed. All product details are sourced from official bank websites and partner networks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <p className={`text-[10px] text-muted-foreground text-center ${className}`}>
      * ApniNivesh may earn a commission when you apply through our links.{" "}
      <a href="/affiliate-disclosure" className="underline hover:text-primary transition-colors">
        Learn more
      </a>
    </p>
  );
};

export default AffiliateDisclaimer;
