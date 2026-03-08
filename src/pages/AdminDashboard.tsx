import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Bot, LogOut, Users, BarChart3, MessageSquare, Settings,
  TrendingUp, Globe, Clock, ArrowUpRight, Activity, Zap,
  Mail, Calendar, Plus, Trash2, Edit3, Check, X, Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  client: string;
  description: string | null;
  progress: number;
  status: string;
  deadline: string | null;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  service: string | null;
  is_read: boolean;
  created_at: string;
}

const statusColors: Record<string, string> = {
  "New": "bg-primary/20 text-primary border-primary/30",
  "Contacted": "bg-accent/20 text-accent border-accent/30",
  "In Progress": "bg-secondary/20 text-secondary-foreground border-secondary/30",
  "Qualified": "bg-accent/20 text-accent border-accent/30",
  "Closed": "bg-muted/30 text-muted-foreground border-muted/40",
};

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Lead form state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadForm, setLeadForm] = useState({ name: "", company: "", email: "", phone: "", service: "", status: "New", notes: "" });

  // Project form state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({ name: "", client: "", description: "", progress: 0, status: "Active", deadline: "" });

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin"); return; }
      setUser(session.user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin");
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    const [leadsRes, projectsRes, messagesRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    if (leadsRes.data) setLeads(leadsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (messagesRes.data) setMessages(messagesRes.data);
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  // LEAD CRUD
  const resetLeadForm = () => { setLeadForm({ name: "", company: "", email: "", phone: "", service: "", status: "New", notes: "" }); setEditingLead(null); setShowLeadForm(false); };

  const saveLead = async () => {
    if (!leadForm.name || !leadForm.email) { toast({ title: "Name and email are required", variant: "destructive" }); return; }
    if (editingLead) {
      const { error } = await supabase.from("leads").update({ ...leadForm, updated_at: new Date().toISOString() }).eq("id", editingLead.id);
      if (error) { toast({ title: "Error updating lead", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Lead updated" });
    } else {
      const { error } = await supabase.from("leads").insert({ ...leadForm, user_id: user.id });
      if (error) { toast({ title: "Error creating lead", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Lead created" });
    }
    resetLeadForm();
    fetchAll();
  };

  const deleteLead = async (id: string) => {
    await supabase.from("leads").delete().eq("id", id);
    toast({ title: "Lead deleted" });
    fetchAll();
  };

  const editLead = (lead: Lead) => {
    setLeadForm({ name: lead.name, company: lead.company || "", email: lead.email, phone: lead.phone || "", service: lead.service || "", status: lead.status, notes: lead.notes || "" });
    setEditingLead(lead);
    setShowLeadForm(true);
  };

  // PROJECT CRUD
  const resetProjectForm = () => { setProjectForm({ name: "", client: "", description: "", progress: 0, status: "Active", deadline: "" }); setEditingProject(null); setShowProjectForm(false); };

  const saveProject = async () => {
    if (!projectForm.name || !projectForm.client) { toast({ title: "Name and client are required", variant: "destructive" }); return; }
    const data = { ...projectForm, progress: Number(projectForm.progress), deadline: projectForm.deadline || null, user_id: user.id };
    if (editingProject) {
      const { error } = await supabase.from("projects").update({ ...data, updated_at: new Date().toISOString() }).eq("id", editingProject.id);
      if (error) { toast({ title: "Error updating project", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Project updated" });
    } else {
      const { error } = await supabase.from("projects").insert(data);
      if (error) { toast({ title: "Error creating project", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Project created" });
    }
    resetProjectForm();
    fetchAll();
  };

  const deleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    toast({ title: "Project deleted" });
    fetchAll();
  };

  const editProject = (project: Project) => {
    setProjectForm({ name: project.name, client: project.client, description: project.description || "", progress: project.progress, status: project.status, deadline: project.deadline?.split("T")[0] || "" });
    setEditingProject(project);
    setShowProjectForm(true);
  };

  // MESSAGES
  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    fetchAll();
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    toast({ title: "Message deleted" });
    fetchAll();
  };

  if (!user) return null;

  const unreadCount = messages.filter(m => !m.is_read).length;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "leads", label: "Leads", icon: Users },
    { id: "projects", label: "Projects", icon: Activity },
    { id: "messages", label: `Messages${unreadCount ? ` (${unreadCount})` : ""}`, icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = [
    { label: "Total Leads", value: leads.length.toString(), icon: Users, color: "text-primary" },
    { label: "Active Projects", value: projects.filter(p => p.status === "Active").length.toString(), icon: BarChart3, color: "text-accent" },
    { label: "Messages", value: messages.length.toString(), icon: MessageSquare, color: "text-primary" },
    { label: "Unread", value: unreadCount.toString(), icon: Mail, color: "text-accent" },
  ];

  const inputClass = "w-full h-10 px-3 rounded-lg border border-border/60 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

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
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${activeTab === tab.id ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}>
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
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 border-b border-border/50 bg-card/80 backdrop-blur-xl z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
          <Bot size={18} className="text-primary" /> NEXUS<span className="text-gradient">AI</span>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive"><LogOut size={18} /></button>
      </header>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border/50 bg-card/80 backdrop-blur-xl z-40 flex items-center justify-around px-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[10px] transition-all ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`}>
            <tab.icon size={18} /> {tab.label.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "leads" && "Lead Management"}
              {activeTab === "projects" && "Active Projects"}
              {activeTab === "messages" && "Contact Messages"}
              {activeTab === "settings" && "Settings"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, Admin • {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </motion.div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm p-5 hover:border-primary/30 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <stat.icon size={20} className={`${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm">
                  <div className="p-5 border-b border-border/30 flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-foreground">Recent Leads</h3>
                    <button onClick={() => setActiveTab("leads")} className="text-xs text-primary hover:underline flex items-center gap-1">View All <ArrowUpRight size={12} /></button>
                  </div>
                  <div className="divide-y divide-border/20">
                    {leads.length === 0 && <p className="p-4 text-sm text-muted-foreground">No leads yet</p>}
                    {leads.slice(0, 3).map((lead) => (
                      <div key={lead.id} className="p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {lead.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{lead.company} • {lead.service}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusColors[lead.status] || statusColors["New"]}`}>{lead.status}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Messages */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm">
                  <div className="p-5 border-b border-border/30 flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-foreground">Recent Messages</h3>
                    <button onClick={() => setActiveTab("messages")} className="text-xs text-primary hover:underline flex items-center gap-1">View All <ArrowUpRight size={12} /></button>
                  </div>
                  <div className="divide-y divide-border/20">
                    {messages.length === 0 && <p className="p-4 text-sm text-muted-foreground">No messages yet</p>}
                    {messages.slice(0, 3).map((msg) => (
                      <div key={msg.id} className="p-4 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground">{msg.name}</p>
                          {!msg.is_read && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === "leads" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <button onClick={() => { resetLeadForm(); setShowLeadForm(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:shadow-glow transition-all">
                <Plus size={16} /> Add Lead
              </button>

              {showLeadForm && (
                <div className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm p-6 space-y-4">
                  <h3 className="font-heading font-semibold text-foreground">{editingLead ? "Edit Lead" : "New Lead"}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input className={inputClass} placeholder="Name *" value={leadForm.name} onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))} />
                    <input className={inputClass} placeholder="Email *" value={leadForm.email} onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))} />
                    <input className={inputClass} placeholder="Company" value={leadForm.company} onChange={e => setLeadForm(f => ({ ...f, company: e.target.value }))} />
                    <input className={inputClass} placeholder="Phone" value={leadForm.phone} onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))} />
                    <input className={inputClass} placeholder="Service" value={leadForm.service} onChange={e => setLeadForm(f => ({ ...f, service: e.target.value }))} />
                    <select className={inputClass} value={leadForm.status} onChange={e => setLeadForm(f => ({ ...f, status: e.target.value }))}>
                      {["New", "Contacted", "Qualified", "In Progress", "Closed"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <textarea className={`${inputClass} h-20`} placeholder="Notes" value={leadForm.notes} onChange={e => setLeadForm(f => ({ ...f, notes: e.target.value }))} />
                  <div className="flex gap-2">
                    <button onClick={saveLead} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"><Check size={14} /> Save</button>
                    <button onClick={resetLeadForm} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 text-muted-foreground text-sm"><X size={14} /> Cancel</button>
                  </div>
                </div>
              )}

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
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {leads.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">No leads yet. Click "Add Lead" to get started.</td></tr>}
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
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
                          <td className="p-4"><span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[lead.status] || statusColors["New"]}`}>{lead.status}</span></td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => editLead(lead)} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"><Edit3 size={14} /></button>
                              <button onClick={() => deleteLead(lead.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </td>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <button onClick={() => { resetProjectForm(); setShowProjectForm(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:shadow-glow transition-all">
                <Plus size={16} /> Add Project
              </button>

              {showProjectForm && (
                <div className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm p-6 space-y-4">
                  <h3 className="font-heading font-semibold text-foreground">{editingProject ? "Edit Project" : "New Project"}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input className={inputClass} placeholder="Project Name *" value={projectForm.name} onChange={e => setProjectForm(f => ({ ...f, name: e.target.value }))} />
                    <input className={inputClass} placeholder="Client *" value={projectForm.client} onChange={e => setProjectForm(f => ({ ...f, client: e.target.value }))} />
                    <input className={inputClass} type="number" min={0} max={100} placeholder="Progress %" value={projectForm.progress} onChange={e => setProjectForm(f => ({ ...f, progress: Number(e.target.value) }))} />
                    <input className={inputClass} type="date" placeholder="Deadline" value={projectForm.deadline} onChange={e => setProjectForm(f => ({ ...f, deadline: e.target.value }))} />
                    <select className={inputClass} value={projectForm.status} onChange={e => setProjectForm(f => ({ ...f, status: e.target.value }))}>
                      {["Active", "On Hold", "Completed", "Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <textarea className={`${inputClass} h-20`} placeholder="Description" value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))} />
                  <div className="flex gap-2">
                    <button onClick={saveProject} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"><Check size={14} /> Save</button>
                    <button onClick={resetProjectForm} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 text-muted-foreground text-sm"><X size={14} /> Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                {projects.length === 0 && <p className="text-sm text-muted-foreground p-4">No projects yet. Click "Add Project" to get started.</p>}
                {projects.map((project, i) => (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm p-5 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{project.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{project.client}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-2">
                          <p className="text-lg font-heading font-bold text-foreground">{project.progress}%</p>
                          {project.deadline && <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock size={10} /> Due {new Date(project.deadline).toLocaleDateString()}</p>}
                        </div>
                        <button onClick={() => editProject(project)} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => deleteProject(project.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {messages.length === 0 && <p className="text-sm text-muted-foreground p-4">No contact messages yet.</p>}
              {messages.map((msg, i) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`border rounded-xl bg-card/40 backdrop-blur-sm p-5 transition-all ${msg.is_read ? "border-border/50" : "border-primary/30 bg-primary/5"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{msg.name}</h3>
                        {!msg.is_read && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">New</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{msg.email}{msg.phone ? ` • ${msg.phone}` : ""}{msg.service ? ` • ${msg.service}` : ""}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground mr-2">{new Date(msg.created_at).toLocaleDateString()}</span>
                      {!msg.is_read && <button onClick={() => markRead(msg.id)} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors" title="Mark as read"><Eye size={14} /></button>}
                      <button onClick={() => deleteMessage(msg.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{msg.message}</p>
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
                  <div><label className="text-xs text-muted-foreground">Email</label><p className="text-sm text-foreground">{user.email}</p></div>
                  <div><label className="text-xs text-muted-foreground">Role</label><p className="text-sm text-foreground">Administrator</p></div>
                  <div><label className="text-xs text-muted-foreground">Last Sign In</label><p className="text-sm text-foreground">{new Date(user.last_sign_in_at || Date.now()).toLocaleString()}</p></div>
                </div>
              </div>
              <button onClick={handleLogout} className="w-full py-2.5 rounded-lg border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-all">Sign Out</button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
