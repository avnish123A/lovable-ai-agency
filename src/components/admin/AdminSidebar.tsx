import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, CreditCard, Users, Building, Settings, LogOut, Wallet, MessageSquare, Gift, Sparkles, BarChart3, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Credit Cards", href: "/admin/credit-cards", icon: CreditCard },
  { label: "Loan Products", href: "/admin/loans", icon: Building },
  
  { label: "Cashback Offers", href: "/admin/cashback", icon: Gift },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "AI Tools", href: "/admin/ai-tools", icon: Sparkles },
  { label: "API Keys", href: "/admin/api-keys", icon: Key },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card hidden md:flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-heading font-bold text-foreground">Kriya<span className="text-accent">pay</span></span>
            <p className="text-[10px] text-muted-foreground -mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
