import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CategoryKey = "credit_cards" | "loans" | "insurance" | "bank_accounts" | "demat_accounts" | "fixed_deposits" | "cashback";

const defaultState: Record<CategoryKey, boolean> = {
  credit_cards: false,
  loans: false,
  insurance: false,
  bank_accounts: false,
  demat_accounts: false,
  fixed_deposits: false,
  cashback: false,
};

export function useCategoryComingSoon(category?: CategoryKey) {
  const [statuses, setStatuses] = useState(defaultState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "category_coming_soon")
        .maybeSingle();
      if (data?.value) {
        setStatuses({ ...defaultState, ...(data.value as Record<string, boolean>) });
      }
      setLoading(false);
    };
    fetch();

    const ch = supabase
      .channel("category-cs-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings", filter: "key=eq.category_coming_soon" }, () => fetch())
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  const isComingSoon = category ? statuses[category] : false;

  return { statuses, isComingSoon, loading };
}
