import { motion } from "framer-motion";
import { Rocket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CategoryComingSoonProps {
  title: string;
  description?: string;
}

const CategoryComingSoon = ({ title, description }: CategoryComingSoonProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
      >
        <Rocket className="w-10 h-10 text-primary" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-3xl md:text-4xl font-heading font-bold mb-3"
      >
        <span className="text-gradient">{title}</span> — Coming Soon!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-muted-foreground max-w-md mb-8"
      >
        {description || "We're working hard to bring you the best deals. Stay tuned!"}
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default CategoryComingSoon;
