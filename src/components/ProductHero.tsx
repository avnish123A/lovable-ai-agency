import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ProductHeroProps {
  title: string;
  highlight: string;
  description: string;
  count?: number;
  icon?: React.ReactNode;
}

const ProductHero = ({ title, highlight, description, count, icon }: ProductHeroProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border p-8 md:p-12 mb-10">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            {icon || <Sparkles className="w-5 h-5 text-primary" />}
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Compare & Apply
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold"
          >
            {title} <span className="text-gradient">{highlight}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-lg text-sm md:text-base"
          >
            {description}
          </motion.p>
        </div>

        {count !== undefined && count > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center px-6 py-4 rounded-xl bg-primary/10 border border-primary/20"
          >
            <p className="text-3xl font-heading font-bold text-primary">{count}+</p>
            <p className="text-xs text-muted-foreground">Products</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductHero;
