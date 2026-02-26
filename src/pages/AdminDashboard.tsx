import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Bot, LogOut, Users, BarChart3, MessageSquare, Settings,
  TrendingUp, Globe, Clock, ArrowUpRight, Activity, Zap,
  Mail, Phone, Calendar
} from "lucide-react";

const stats = [
  { label: "Total Leads", value: "47", change: "+12%", icon: Users, color: "text-primary" },
  { label: "Active Projects", value: "8", change: "+3", icon: BarChart3, color: "text-accent" },
  { label: "Messages", value: "156", change: "+24%", icon: MessageSquare, color: "text-primary" },
  { label: "Revenue", value: "$12.4K", change: "+18%", icon: TrendingUp, color: "text-accent" },
];

const recentLeads = [
  { name: "Sarah Chen", company: "TechFlow Inc", email: "sarah@techflow.io", service: "AI Chatbot", status: "New", date: "2 hours ago" },
  { name: "Marcus Rivera", company: "DataPrime", email: "marcus@dataprime.com", service: "MLOps Pipeline", status: "Contacted", date: "5 hours ago" },
  { name: "Emily Watson", company: "ScaleUp AI", email: "emily@scaleupai.com", service: "Custom AI Agent", status: "In Progress", date: "1 day ago" },
  { name: "James Park", company: "NovaTech", email: "james@novatech.dev", service: "Automation", status: "New", date: "1 day ago" },
  { name: "Priya Sharma", company: "CloudNine Labs", email: "priya@cloudnine.io", service: "AI Integration", status: "Qualified", date: "2 days ago" },
];

const activeProjects = [
  { name: "E-Commerce AI Assistant", client: "TechFlow Inc", progress: 75, deadline: "Mar 15, 2026" },
  { name: "Customer Support Bot", client: "DataPrime", progress: 40, deadline: "Apr 2, 2026" },
  { name: "Data Pipeline Automation", client: "ScaleUp AI", progress: 90, deadline: "Mar 5, 2026" },
  { name: "Lead Qualification Agent", client: "NovaTech", progress: 20, deadline: "May 1, 2026" },
];

const statusColors: Record<string, string> = {
  "New": "bg-primary/20 text-primary border-primary/30",
  "Contacted": "bg-accent/20 text-accent border-accent/30",
  "In Progress": "bg-secondary/20 text-secondary-foreground border-secondary/30",
  "Qualified": "bg-accent/20 text-accent border-accent/30",
};

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin");
        return;
      }
      setUser(session.user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin");
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "leads", label: "Leads", icon: Users },
    { id: "projects", label: "Projects", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl z-40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-border/50">
          <a href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Bot size={16} className="text-primary" />
            </div>
            NEXUS<span className="text-gradient">AI</span>
          </a>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
              {user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">Admin</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 border-b border-border/50 bg-card/80 backdrop-blur-xl z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
          <Bot size={18} className="text-primary" />
          NEXUS<span className="text-gradient">AI</span>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
          <LogOut size={18} />
        </button>
      </header>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border/50 bg-card/80 backdrop-blur-xl z-40 flex items-center justify-around px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[10px] transition-all ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "leads" && "Lead Management"}
              {activeTab === "projects" && "Active Projects"}
              {activeTab === "settings" && "Settings"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, Admin • {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </motion.div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm p-5 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <stat.icon size={20} className={`${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{stat.change}</span>
                    </div>
                    <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Leads + Projects */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm"
                >
                  <div className="p-5 border-b border-border/30 flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-foreground">Recent Leads</h3>
                    <button onClick={() => setActiveTab("leads")} className="text-xs text-primary hover:underline flex items-center gap-1">
                      View All <ArrowUpRight size={12} />
                    </button>
                  </div>
                  <div className="divide-y divide-border/20">
                    {recentLeads.slice(0, 3).map((lead) => (
                      <div key={lead.email} className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {lead.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{lead.company} • {lead.service}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusColors[lead.status]}`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Active Projects */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm"
                >
                  <div className="p-5 border-b border-border/30 flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-foreground">Active Projects</h3>
                    <button onClick={() => setActiveTab("projects")} className="text-xs text-primary hover:underline flex items-center gap-1">
                      View All <ArrowUpRight size={12} />
                    </button>
                  </div>
                  <div className="divide-y divide-border/20">
                    {activeProjects.slice(0, 3).map((project) => (
                      <div key={project.name} className="p-4 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-foreground">{project.name}</p>
                          <span className="text-xs text-muted-foreground">{project.progress}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{project.client} • Due {project.deadline}</p>
                        <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  { label: "Website", icon: Globe, desc: "View live site", href: "/" },
                  { label: "Schedule", icon: Calendar, desc: "Upcoming calls" },
                  { label: "Emails", icon: Mail, desc: "Inbox (3 new)" },
                  { label: "Performance", icon: Zap, desc: "Site analytics" },
                ].map((action, i) => (
                  <a
                    key={action.label}
                    href={action.href || "#"}
                    className="border border-border/40 rounded-xl bg-card/30 p-4 hover:border-primary/30 hover:bg-primary/5 transition-all group flex items-center gap-3"
                  >
                    <action.icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{action.label}</p>
                      <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                    </div>
                  </a>
                ))}
              </motion.div>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === "leads" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground hidden md:table-cell">Company</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground hidden lg:table-cell">Email</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Service</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground hidden md:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {recentLeads.map((lead) => (
                        <tr key={lead.email} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-xs font-bold text-primary">
                                {lead.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className="text-sm font-medium text-foreground">{lead.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{lead.company}</td>
                          <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">{lead.email}</td>
                          <td className="p-4 text-sm text-muted-foreground">{lead.service}</td>
                          <td className="p-4">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[lead.status]}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground hidden md:table-cell">{lead.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
              {activeProjects.map((project, i) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm p-5 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-foreground">{project.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{project.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-heading font-bold text-foreground">{project.progress}%</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock size={10} /> Due {project.deadline}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg space-y-6">
              <div className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4">Account</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Email</label>
                    <p className="text-sm text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Role</label>
                    <p className="text-sm text-foreground">Administrator</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Last Sign In</label>
                    <p className="text-sm text-foreground">
                      {new Date(user.last_sign_in_at || Date.now()).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-lg border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-all"
              >
                Sign Out
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
