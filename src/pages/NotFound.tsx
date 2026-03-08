import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[15%] w-72 h-72 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 25, 0], scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <h1 className="text-[10rem] md:text-[14rem] font-heading font-extrabold text-primary/15 leading-none select-none">
            404
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="-mt-16 md:-mt-24"
        >
          <p className="text-2xl md:text-3xl text-foreground mb-3 font-heading font-bold">Page Not Found</p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" /> Back to Home
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" className="rounded-xl px-6">
                <Link to="/tools">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Explore Tools
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
