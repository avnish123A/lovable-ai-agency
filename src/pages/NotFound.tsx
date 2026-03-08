import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-8xl font-heading font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-foreground mb-2 font-heading">Page Not Found</p>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
