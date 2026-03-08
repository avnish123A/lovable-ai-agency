// Bank logo and branding utilities
// Uses Clearbit for logos and maps bank names to brand colors

const BANK_DOMAINS: Record<string, string> = {
  "HDFC Bank": "hdfcbank.com",
  "HDFC": "hdfcbank.com",
  "ICICI Bank": "icicibank.com",
  "ICICI": "icicibank.com",
  "Axis Bank": "axisbank.com",
  "Axis": "axisbank.com",
  "SBI": "sbicard.com",
  "SBI Cards": "sbicard.com",
  "State Bank of India": "sbi.co.in",
  "Kotak Mahindra Bank": "kotak.com",
  "Kotak Bank": "kotak.com",
  "Kotak": "kotak.com",
  "IndusInd Bank": "indusind.com",
  "IndusInd": "indusind.com",
  "Yes Bank": "yesbank.in",
  "RBL Bank": "rblbank.com",
  "RBL": "rblbank.com",
  "IDFC First Bank": "idfcfirstbank.com",
  "IDFC First": "idfcfirstbank.com",
  "Federal Bank": "federalbank.co.in",
  "AU Small Finance Bank": "aubank.in",
  "Bajaj Finserv": "bajajfinserv.in",
  "Bajaj Finance": "bajajfinserv.in",
  "Tata Capital": "tatacapital.com",
  "Standard Chartered": "sc.com",
  "Citi Bank": "citibank.co.in",
  "Citibank": "citibank.co.in",
  "HSBC": "hsbc.co.in",
  "American Express": "americanexpress.com",
  "Amex": "americanexpress.com",
};

const BANK_COLORS: Record<string, { primary: string; gradient: string }> = {
  "HDFC Bank": { primary: "#004B87", gradient: "from-[#004B87] to-[#00325a]" },
  "HDFC": { primary: "#004B87", gradient: "from-[#004B87] to-[#00325a]" },
  "ICICI Bank": { primary: "#F58220", gradient: "from-[#F58220] to-[#B33000]" },
  "ICICI": { primary: "#F58220", gradient: "from-[#F58220] to-[#B33000]" },
  "Axis Bank": { primary: "#97144D", gradient: "from-[#97144D] to-[#5c0c30]" },
  "Axis": { primary: "#97144D", gradient: "from-[#97144D] to-[#5c0c30]" },
  "SBI": { primary: "#22409A", gradient: "from-[#22409A] to-[#0F1F4D]" },
  "SBI Cards": { primary: "#22409A", gradient: "from-[#22409A] to-[#0F1F4D]" },
  "State Bank of India": { primary: "#22409A", gradient: "from-[#22409A] to-[#0F1F4D]" },
  "Kotak Mahindra Bank": { primary: "#ED1C24", gradient: "from-[#ED1C24] to-[#8B0000]" },
  "Kotak Bank": { primary: "#ED1C24", gradient: "from-[#ED1C24] to-[#8B0000]" },
  "Kotak": { primary: "#ED1C24", gradient: "from-[#ED1C24] to-[#8B0000]" },
  "IndusInd Bank": { primary: "#8B1A32", gradient: "from-[#8B1A32] to-[#4A0E1A]" },
  "IndusInd": { primary: "#8B1A32", gradient: "from-[#8B1A32] to-[#4A0E1A]" },
  "Yes Bank": { primary: "#0066B3", gradient: "from-[#0066B3] to-[#003D6B]" },
  "RBL Bank": { primary: "#E31837", gradient: "from-[#E31837] to-[#8B0000]" },
  "RBL": { primary: "#E31837", gradient: "from-[#E31837] to-[#8B0000]" },
  "IDFC First Bank": { primary: "#9C1D26", gradient: "from-[#9C1D26] to-[#5C0F15]" },
  "IDFC First": { primary: "#9C1D26", gradient: "from-[#9C1D26] to-[#5C0F15]" },
  "American Express": { primary: "#006FCF", gradient: "from-[#006FCF] to-[#00478A]" },
  "Amex": { primary: "#006FCF", gradient: "from-[#006FCF] to-[#00478A]" },
  "Standard Chartered": { primary: "#0072AA", gradient: "from-[#0072AA] to-[#003D5C]" },
  "HSBC": { primary: "#DB0011", gradient: "from-[#DB0011] to-[#8B0000]" },
  "Bajaj Finserv": { primary: "#00529B", gradient: "from-[#00529B] to-[#002D54]" },
  "Bajaj Finance": { primary: "#00529B", gradient: "from-[#00529B] to-[#002D54]" },
};

const DEFAULT_COLOR = { primary: "#2563eb", gradient: "from-primary to-primary/80" };

export function getBankLogo(bankName: string, size = 64): string {
  const domain = BANK_DOMAINS[bankName];
  if (domain) {
    return `https://logo.clearbit.com/${domain}?size=${size}`;
  }
  // Fallback: try constructing from bank name
  const slug = bankName.toLowerCase().replace(/\s+/g, "").replace(/bank$/i, "");
  return `https://logo.clearbit.com/${slug}.com?size=${size}`;
}

export function getBankColor(bankName: string) {
  return BANK_COLORS[bankName] || DEFAULT_COLOR;
}

export function getBankDomain(bankName: string): string | undefined {
  return BANK_DOMAINS[bankName];
}
