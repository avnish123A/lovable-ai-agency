import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Copy, RefreshCw, FileText, CheckCircle, ShieldCheck, ScrollText } from "lucide-react";

const AdminAITools = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    product_name: "",
    bank_name: "",
    product_type: "credit_card",
    annual_fee: "",
    interest_rate: "",
    cashback: "",
    features: "",
  });

  const [results, setResults] = useState<{
    description?: string;
    benefits?: string;
    eligibility?: string;
    terms?: string;
  }>({});

  const [activeGenTab, setActiveGenTab] = useState("all");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateContent = async (type: string) => {
    if (!form.product_name || !form.bank_name) {
      toast({ title: "Missing fields", description: "Product name and bank name are required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-content-generate", {
        body: { ...form, generate_type: type },
      });

      if (error) throw error;

      if (type === "all" && data.sections) {
        setResults(data.sections);
        toast({ title: "Content generated!", description: "All sections generated successfully." });
      } else if (data.content) {
        setResults((prev) => ({ ...prev, [type]: data.content }));
        toast({ title: "Generated!", description: `${type} content ready.` });
      }
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const ResultSection = ({ title, icon: Icon, content, field }: { title: string; icon: any; content?: string; field: string }) => (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="w-4 h-4 text-accent" />
            {title}
          </CardTitle>
          <div className="flex gap-1">
            {content && (
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(content, title)}>
                <Copy className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => generateContent(field)}
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={content || ""}
          onChange={(e) => setResults((prev) => ({ ...prev, [field]: e.target.value }))}
          placeholder={`AI-generated ${title.toLowerCase()} will appear here...`}
          rows={5}
          className="text-sm"
        />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          AI Content Tools
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Generate AI-powered product descriptions, benefits, eligibility, and terms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Product Details</CardTitle>
            <CardDescription>Enter product info to generate AI content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Product Name *</Label>
              <Input value={form.product_name} onChange={(e) => handleChange("product_name", e.target.value)} placeholder="e.g. HDFC Regalia Gold" />
            </div>
            <div>
              <Label>Bank Name *</Label>
              <Input value={form.bank_name} onChange={(e) => handleChange("bank_name", e.target.value)} placeholder="e.g. HDFC Bank" />
            </div>
            <div>
              <Label>Product Type</Label>
              <Select value={form.product_type} onValueChange={(v) => handleChange("product_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="personal_loan">Personal Loan</SelectItem>
                  <SelectItem value="home_loan">Home Loan</SelectItem>
                  <SelectItem value="business_loan">Business Loan</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Annual Fee</Label>
              <Input value={form.annual_fee} onChange={(e) => handleChange("annual_fee", e.target.value)} placeholder="e.g. ₹2,500" />
            </div>
            <div>
              <Label>Interest Rate</Label>
              <Input value={form.interest_rate} onChange={(e) => handleChange("interest_rate", e.target.value)} placeholder="e.g. 10.5% p.a." />
            </div>
            <div>
              <Label>Cashback / Rewards</Label>
              <Input value={form.cashback} onChange={(e) => handleChange("cashback", e.target.value)} placeholder="e.g. 5% on dining" />
            </div>
            <div>
              <Label>Key Features</Label>
              <Textarea value={form.features} onChange={(e) => handleChange("features", e.target.value)} placeholder="e.g. Airport lounge, fuel surcharge waiver, movie tickets" rows={3} />
            </div>

            <Button className="w-full" onClick={() => generateContent("all")} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate All Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Sections */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered by Kriyapay
            </Badge>
            <span className="text-xs text-muted-foreground">Edit any output before publishing</span>
          </div>

          <ResultSection title="Description" icon={FileText} content={results.description} field="description" />
          <ResultSection title="Benefits" icon={CheckCircle} content={results.benefits} field="benefits" />
          <ResultSection title="Eligibility" icon={ShieldCheck} content={results.eligibility} field="eligibility" />
          <ResultSection title="Terms & Conditions" icon={ScrollText} content={results.terms} field="terms" />
        </div>
      </div>
    </div>
  );
};

export default AdminAITools;
