// Bank logo and branding utilities
// Uses local logos from /public/logos/ for reliable, fast loading

const BANK_LOGOS: Record<string, string> = {
  // Major Banks
  "HDFC Bank": "/logos/hdfc.png",
  "HDFC": "/logos/hdfc.png",
  "ICICI Bank": "/logos/icici.png",
  "ICICI": "/logos/icici.png",
  "Axis Bank": "/logos/axis.png",
  "Axis": "/logos/axis.png",
  "SBI": "/logos/sbi.png",
  "SBI Cards": "/logos/sbi.png",
  "State Bank of India": "/logos/sbi.png",
  "Kotak Mahindra Bank": "/logos/kotak.png",
  "Kotak Bank": "/logos/kotak.png",
  "Kotak": "/logos/kotak.png",
  "IndusInd Bank": "/logos/indusind.png",
  "IndusInd": "/logos/indusind.png",
  "Yes Bank": "/logos/yesbank.png",
  "Bajaj Finserv": "/logos/bajaj.png",
  "Bajaj Finance": "/logos/bajaj.png",
  "Paytm": "/logos/paytm.png",
  "PhonePe": "/logos/phonepe.png",
  "Razorpay": "/logos/razorpay.png",

  // Fintech & Investment
  "Upstox": "/logos/upstox.png",
  "Groww": "/logos/groww.png",
  "Zerodha": "/logos/zerodha.png",

  // Insurance
  "ICICI Prudential": "/logos/icici-prudential.png",
  "HDFC ERGO": "/logos/hdfc-ergo.png",

  // Other Banks
  "AU Small Finance Bank": "/logos/au-bank.png",
  "RBL Bank": "/logos/rbl.png",
  "RBL": "/logos/rbl.png",
  "Bank of Baroda": "/logos/bob.png",
  "Bank of Baroda Credit Card": "/logos/bob.png",
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
  "Bajaj Finserv": { primary: "#00529B", gradient: "from-[#00529B] to-[#002D54]" },
  "Bajaj Finance": { primary: "#00529B", gradient: "from-[#00529B] to-[#002D54]" },
  "Upstox": { primary: "#6B3FA0", gradient: "from-[#6B3FA0] to-[#3D2366]" },
  "Groww": { primary: "#00D09C", gradient: "from-[#00D09C] to-[#008B68]" },
  "Zerodha": { primary: "#387ED1", gradient: "from-[#387ED1] to-[#1E4D8C]" },
  "ICICI Prudential": { primary: "#003B70", gradient: "from-[#003B70] to-[#F58220]" },
  "HDFC ERGO": { primary: "#004B87", gradient: "from-[#004B87] to-[#D22630]" },
  "AU Small Finance Bank": { primary: "#4B0082", gradient: "from-[#4B0082] to-[#FFD700]" },
  "Bank of Baroda": { primary: "#F15A22", gradient: "from-[#F15A22] to-[#A03010]" },
  "Bank of Baroda Credit Card": { primary: "#F15A22", gradient: "from-[#F15A22] to-[#A03010]" },
  "American Express": { primary: "#006FCF", gradient: "from-[#006FCF] to-[#00478A]" },
  "Amex": { primary: "#006FCF", gradient: "from-[#006FCF] to-[#00478A]" },
  "Standard Chartered": { primary: "#0072AA", gradient: "from-[#0072AA] to-[#003D5C]" },
  "HSBC": { primary: "#DB0011", gradient: "from-[#DB0011] to-[#8B0000]" },
};

const DEFAULT_COLOR = { primary: "#2563eb", gradient: "from-primary to-primary/80" };

export function getBankLogo(bankName: string): string {
  if (BANK_LOGOS[bankName]) {
    return BANK_LOGOS[bankName];
  }
  
  // Try partial match
  const lower = bankName.toLowerCase();
  for (const [key, url] of Object.entries(BANK_LOGOS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return url;
    }
  }
  
  // No match - return empty to trigger fallback initials
  return "";
}

export function getBankColor(bankName: string) {
  if (BANK_COLORS[bankName]) return BANK_COLORS[bankName];
  
  // Try partial match
  const lower = bankName.toLowerCase();
  for (const [key, color] of Object.entries(BANK_COLORS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return color;
    }
  }
  
  return DEFAULT_COLOR;
}
