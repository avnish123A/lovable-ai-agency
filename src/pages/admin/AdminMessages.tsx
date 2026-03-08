import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";

const AdminMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (msg: any) => {
    const { error } = await supabase.from("contact_messages").update({ is_read: !msg.is_read }).eq("id", msg.id);
    if (error) { toast.error(error.message); return; }
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Message deleted");
    fetchMessages();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Contact Messages</h1>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-3">
          {messages.map((msg) => (
            <Card key={msg.id} className={msg.is_read ? "opacity-60" : ""}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{msg.name}</p>
                      {!msg.is_read && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                    {msg.service && <p className="text-xs text-muted-foreground mt-0.5">Service: {msg.service}</p>}
                    <p className="text-sm text-foreground mt-2 whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => toggleRead(msg)}>
                      {msg.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(msg.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No messages yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
