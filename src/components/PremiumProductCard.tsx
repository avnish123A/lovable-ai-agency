import { motion } from "framer-motion";
import { Star, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PremiumProductCardProps {
  title: string;
  subtitle: string;
  badge?: string;
  rating?: number;
  imageUrl?: string;
  stats?: { label: string; value: string }[];
  features?: string[];
  applyLink?: string;
  applyLabel?: string;
  index?: number;
  featureIcon?: React.ReactNode;
}

const PremiumProductCard = ({
  title, subtitle, badge, rating, imageUrl, stats = [], features = [],
  applyLink, applyLabel = "Apply Now", index = 0, featureIcon,
}: PremiumProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {badge && (
              <Badge variant="secondary" className="mb-2 text-xs capitalize font-medium">
                {badge}
              </Badge>
            )}
            <h3 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              {imageUrl && <img src={imageUrl} alt={subtitle} className="w-5 h-5 object-contain rounded" />}
              {subtitle}
            </p>
          </div>
          {rating && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-sm font-bold text-amber-600">{rating}</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-muted/50">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <ul className="space-y-1.5">
            {features.slice(0, 3).map((f, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="w-4 h-4 shrink-0 mt-0.5 text-primary">{featureIcon || <ArrowRight className="w-3 h-3" />}</span>
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        {applyLink && (
          <Button asChild className="w-full rounded-xl group/btn" size="sm">
            <a href={applyLink} target="_blank" rel="noopener noreferrer">
              {applyLabel}
              <ExternalLink className="w-3 h-3 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default PremiumProductCard;
