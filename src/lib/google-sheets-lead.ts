const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw3rtHLUUdiIooCnYL92GfU3bCb9lUOsCZTCZvNrznBaOLXJeDLB4e580NYHr1tUtc/exec";

let lastSubmitTime = 0;
const MIN_INTERVAL_MS = 5000; // 5 seconds between submissions

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

  const payload = {
    ...lead,
    source: "kriyapay.co.in",
    user_agent: navigator.userAgent,
    ip: "", // optional — Apps Script can capture from request
  };

  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors", // Apps Script doesn't support CORS preflight
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // no-cors means we can't read the response, but the request is sent
  return { success: true };
}
