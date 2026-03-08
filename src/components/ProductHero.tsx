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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border p-8 md:p-12 mb-10">
      {/* Animated background decorative elements */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" 
      />
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" 
      />
      <div className="absolute inset-0 grid-pattern opacity-20 rounded-3xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            >
              {icon || <Sparkles className="w-5 h-5 text-primary" />}
            </motion.div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Compare & Apply
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold"
          >
            {title} <span className="text-gradient">{highlight}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-muted-foreground max-w-lg text-sm md:text-base"
          >
            {description}
          </motion.p>
        </div>

        {count !== undefined && count > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.08, rotate: 2, transition: { duration: 0.2 } }}
            className="text-center px-8 py-5 rounded-2xl bg-primary/10 border border-primary/20 cursor-default relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
            />
            <p className="text-4xl font-heading font-bold text-primary relative z-10">{count}+</p>
            <p className="text-xs text-muted-foreground relative z-10">Products</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductHero;
