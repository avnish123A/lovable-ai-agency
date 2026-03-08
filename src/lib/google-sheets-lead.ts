import { supabase } from "@/integrations/supabase/client";

let lastSubmitTime = 0;
const MIN_INTERVAL_MS = 5000;

export interface GoogleSheetLead {
  name: string;
  phone: string;
  email: string;
  city: string;
  income: string;
  product: string;
}

export async function submitLeadToGoogleSheet(lead: GoogleSheetLead) {
  const now = Date.now();
  if (now - lastSubmitTime < MIN_INTERVAL_MS) {
    throw new Error("Please wait a few seconds before submitting again.");
  }
  lastSubmitTime = now;

  const { data, error } = await supabase.functions.invoke("send-to-sheet", {
    body: lead,
  });

  if (error) {
    console.error("Sheet submission error:", error);
    throw error;
  }

  return data;
}
