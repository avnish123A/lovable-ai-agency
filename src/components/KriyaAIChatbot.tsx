import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Sparkles, Bot, User, CreditCard,
  Calculator, TrendingUp, Gift, ArrowRight, Mic, MicOff, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kriya-chat`;

const QUICK_ACTIONS = [
  { icon: CreditCard, label: "Compare Credit Cards", query: "Compare the best credit cards available on kriyapay right now. Show me top options with their fees and benefits.", color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400" },
  { icon: Gift, label: "Best Cashback Card", query: "Which credit card gives the best cashback in India? Show me the top 3 options.", color: "from-emerald-500/10 to-green-500/10 text-emerald-600 dark:text-emerald-400" },
  { icon: TrendingUp, label: "Check Loan Eligibility", query: "Help me check my loan eligibility. What factors do banks consider for personal loan approval in India?", color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400" },
  { icon: Calculator, label: "Calculate EMI", query: "Help me calculate EMI. I want to understand how monthly installments work for different loan amounts and tenures.", color: "from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400" },
];

async function streamChat({
  messages, action, onDelta, onDone, onError,
}: {
  messages: Msg[]; action?: string;
  onDelta: (t: string) => void; onDone: () => void; onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, action }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || "Something went wrong.");
    return;
  }
  if (!resp.body) { onError("No response."); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const c = parsed.choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

const TypingDots = () => (
  <div className="flex gap-1 py-1">
    {[0, 150, 300].map((d) => (
      <motion.span
        key={d}
        className="w-2 h-2 bg-primary/40 rounded-full"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: d / 1000 }}
      />
    ))}
  </div>
);

const KriyaAIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = useCallback(async (text: string, isProductQuery = false) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    // Determine if we need product data
    const keywords = ["card", "loan", "cashback", "compare", "best", "recommend", "deal", "offer", "insurance", "emi", "eligib"];
    const needsProducts = isProductQuery || keywords.some((k) => text.toLowerCase().includes(k));

    try {
      await streamChat({
        messages: [...messages, userMsg],
        action: needsProducts ? "fetch_products" : undefined,
        onDelta: upsert,
        onDone: () => setLoading(false),
        onError: (msg) => { toast.error(msg); setLoading(false); },
      });
    } catch {
      toast.error("Connection failed.");
      setLoading(false);
    }
  }, [messages, loading]);

  const toggleVoice = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast.error("Voice input not supported in this browser.");
      return;
    }
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening]);

  const handleQuickNav = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-glow flex items-center justify-center group"
            aria-label="Open KriyaAI"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 px-5 py-4 border-b border-border">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="relative flex-1 min-w-0">
                <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5">
                  KriyaAI
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                </h3>
                <p className="text-[11px] text-muted-foreground">Financial Assistant • Always Online</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="relative rounded-xl h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="pt-2">
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center"
                    >
                      <Bot className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h4 className="font-heading font-bold text-foreground text-base mb-1">Namaste! 🙏</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                      I'm KriyaAI — your personal finance assistant. Ask me about credit cards, loans, insurance, or cashback offers.
                    </p>
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-1">Quick Actions</p>
                    {QUICK_ACTIONS.map((qa, i) => (
                      <motion.button
                        key={qa.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        onClick={() => send(qa.query, true)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-r ${qa.color} hover:shadow-md transition-all group text-left`}
                      >
                        <qa.icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-medium flex-1">{qa.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>

                  {/* Navigation shortcuts */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { label: "💳 Credit Cards", path: "/credit-cards" },
                      { label: "📊 EMI Calculator", path: "/emi-calculator" },
                      { label: "🎯 Compare", path: "/compare" },
                      { label: "⚖️ Compare", path: "/compare" },
                    ].map((nav) => (
                      <button
                        key={nav.path}
                        onClick={() => handleQuickNav(nav.path)}
                        className="text-[11px] px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        {nav.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md shadow-md"
                        : "bg-secondary/80 text-foreground rounded-bl-md border border-border/50"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1.5 [&>ol]:my-1.5 [&>ul>li]:my-0.5 [&>h1]:text-sm [&>h2]:text-sm [&>h3]:text-xs">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/90 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && messages[messages.length - 1]?.role === "user" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-secondary/80 rounded-2xl rounded-bl-md px-4 py-3 border border-border/50">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              {/* Follow-up suggestions after assistant response */}
              {messages.length > 0 && !loading && messages[messages.length - 1]?.role === "assistant" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-1.5 pl-9">
                  {["Tell me more", "Compare options", "How to apply?"].map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-[10px] px-2.5 py-1 rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Scroll indicator */}
            <div className="relative">
              <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-card/95 to-transparent pointer-events-none" />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-border bg-card/50 backdrop-blur-sm"
            >
              <div className="flex gap-2 items-center">
                <div className="flex-1 flex items-center bg-secondary/80 rounded-xl border border-border/50 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about cards, loans, offers..."
                    className="flex-1 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className={`px-2 py-1.5 mr-1 rounded-lg transition-colors ${
                      listening
                        ? "text-destructive bg-destructive/10 animate-pulse"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    title={listening ? "Stop listening" : "Voice input"}
                  >
                    {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || loading}
                  className="rounded-xl h-10 w-10 shrink-0 bg-gradient-to-br from-primary to-primary/80 shadow-md hover:shadow-lg transition-shadow"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[9px] text-muted-foreground/60 text-center mt-2">
                KriyaAI provides general info only. Verify details with banks.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KriyaAIChatbot;
