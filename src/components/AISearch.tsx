import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Loader2, CreditCard, Wallet, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import BankLogo from "./BankLogo";

interface SearchResults {
  cards: any[];
  loans: any[];
  deals: any[];
}

const AISearch = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [summary, setSummary] = useState("");
  const [intent, setIntent] = useState("");

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || query.trim().length < 2) return;

    setLoading(true);
    setResults(null);
    setSummary("");
    setIntent("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-search", {
        body: { query: query.trim() },
      });

      if (error) {
        toast.error(error.message || "Search failed");
        return;
      }

      if (data?.success) {
        setResults(data.results);
        setSummary(data.summary);
        setIntent(data.intent);
      } else {
        toast.error(data?.error || "No results found");
      }
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalResults = results
    ? results.cards.length + results.loans.length + results.deals.length
    : 0;

  const quickSearches = [
    "Best cashback credit card",
    "Low interest personal loan",
    "Travel rewards card",
    "Zero annual fee card",
    "Business loan for startups",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Try: 'best cashback credit card' or 'low interest home loan'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-32 h-14 text-base rounded-2xl border-border bg-card/80 backdrop-blur-sm shadow-card"
          />
          <Button
            type="submit"
            disabled={loading || query.trim().length < 2}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-xl bg-gradient-cta"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Search
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Quick searches */}
      {!results && !loading && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {quickSearches.map((qs) => (
            <button
              key={qs}
              onClick={() => {
                setQuery(qs);
                setTimeout(() => handleSearch(), 100);
              }}
              className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              {qs}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {results && totalResults > 0 && (
        <div className="mt-8 space-y-6">
          {/* AI Summary */}
          {summary && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">{intent}</p>
                <p className="text-sm text-muted-foreground mt-1">{summary}</p>
              </div>
            </div>
          )}

          {/* Credit Cards */}
          {results.cards.length > 0 && (
            <div>
              <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Credit Cards ({results.cards.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.cards.map((card) => (
                  <Card key={card.id} className="hover:shadow-card transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <BankLogo bankName={card.bank_name} size="sm" />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm truncate">{card.card_name}</h4>
                          <p className="text-xs text-muted-foreground">{card.bank_name}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {card.card_type}
                        </Badge>
                        {card.cashback_rate && (
                          <Badge variant="outline" className="text-[10px]">
                            {card.cashback_rate} cashback
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Fee: ₹{card.annual_fee}/yr
                        </span>
                        <Link
                          to={`/credit-cards`}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Loans */}
          {results.loans.length > 0 && (
            <div>
              <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-accent" />
                Loan Products ({results.loans.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.loans.map((loan) => (
                  <Card key={loan.id} className="hover:shadow-card transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <BankLogo bankName={loan.bank_name} size="sm" />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm truncate">{loan.loan_name}</h4>
                          <p className="text-xs text-muted-foreground">{loan.bank_name}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {loan.interest_rate}% interest
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          ₹{(loan.min_amount / 100000).toFixed(1)}L - ₹{(loan.max_amount / 100000).toFixed(1)}L
                        </span>
                        <Link
                          to={`/loans`}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Deals */}
          {results.deals.length > 0 && (
            <div>
              <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-500" />
                Finance Deals ({results.deals.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.deals.map((deal) => (
                  <Card key={deal.id} className="hover:shadow-card transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">{deal.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{deal.merchant}</p>
                      <div className="flex items-center justify-between">
                        {deal.cashback && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                            {deal.cashback}
                          </Badge>
                        )}
                        <Link
                          to={`/deal/${deal.id}`}
                          className="text-xs text-primary hover:underline flex items-center gap-1 ml-auto"
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No results */}
      {results && totalResults === 0 && (
        <div className="mt-8 text-center py-12">
          <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No products found for "{query}"</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Try different keywords or browse our categories
          </p>
        </div>
      )}
    </div>
  );
};

export default AISearch;
