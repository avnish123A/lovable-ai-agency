import { Shield, CheckCircle } from "lucide-react";

interface TrustBadgeProps {
  variant?: "verified" | "secure" | "partner";
  className?: string;
}

const badges = {
  verified: { icon: CheckCircle, label: "Verified Partner", color: "text-accent" },
  secure: { icon: Shield, label: "Secure Application", color: "text-primary" },
  partner: { icon: CheckCircle, label: "Trusted Financial Partner", color: "text-accent" },
};

const TrustBadge = ({ variant = "verified", className = "" }: TrustBadgeProps) => {
  const badge = badges[variant];
  const Icon = badge.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/8 ${className}`}>
      <Icon className={`w-3 h-3 ${badge.color}`} />
      <span className={`text-[10px] font-semibold uppercase tracking-wider ${badge.color}`}>
        {badge.label}
      </span>
    </div>
  );
};

export default TrustBadge;
