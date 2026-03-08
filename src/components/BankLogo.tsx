import { useState } from "react";
import { getBankLogo, getBankColor } from "@/lib/bank-utils";
import { CreditCard as CreditCardIcon } from "lucide-react";

interface BankLogoProps {
  bankName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-8 h-8", img: 32, icon: "w-4 h-4" },
  md: { container: "w-10 h-10", img: 48, icon: "w-5 h-5" },
  lg: { container: "w-12 h-12", img: 64, icon: "w-6 h-6" },
};

const BankLogo = ({ bankName, size = "md", className = "" }: BankLogoProps) => {
  const [imgError, setImgError] = useState(false);
  const s = sizeMap[size];
  const logoUrl = getBankLogo(bankName, s.img);

  if (imgError) {
    return (
      <div className={`${s.container} rounded-xl bg-primary/10 flex items-center justify-center ${className}`}>
        <CreditCardIcon className={`${s.icon} text-primary`} />
      </div>
    );
  }

  return (
    <div className={`${s.container} rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden ${className}`}>
      <img
        src={logoUrl}
        alt={`${bankName} logo`}
        className="w-full h-full object-contain p-1.5"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

export default BankLogo;
