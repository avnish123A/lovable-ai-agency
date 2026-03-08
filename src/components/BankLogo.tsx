import { useState } from "react";
import { getBankLogo } from "@/lib/bank-utils";

interface BankLogoProps {
  bankName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-8 h-8", icon: "text-[10px]" },
  md: { container: "w-10 h-10", icon: "text-xs" },
  lg: { container: "w-12 h-12", icon: "text-sm" },
};

const BankLogo = ({ bankName, size = "md", className = "" }: BankLogoProps) => {
  const [imgError, setImgError] = useState(false);
  const s = sizeMap[size];
  const logoUrl = getBankLogo(bankName);

  // Fallback: show initials
  const initials = bankName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (imgError) {
    return (
      <div className={`${s.container} rounded-xl bg-primary/10 flex items-center justify-center font-heading font-bold text-primary ${s.icon} ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`${s.container} rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden ${className}`}>
      <img
        src={logoUrl}
        alt={`${bankName} logo`}
        className="w-full h-full object-contain p-1"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

export default BankLogo;
