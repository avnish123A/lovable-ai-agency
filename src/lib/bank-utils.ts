// Bank logo and branding utilities
// Uses img.logo.dev for logos and maps bank names to brand colors

const BANK_LOGOS: Record<string, string> = {
  "HDFC Bank": "https://img.logo.dev/hdfcbank.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "HDFC": "https://img.logo.dev/hdfcbank.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "ICICI Bank": "https://img.logo.dev/icicibank.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "ICICI": "https://img.logo.dev/icicibank.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Axis Bank": "https://img.logo.dev/axisbank.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Axis": "https://img.logo.dev/axisbank.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "SBI": "https://img.logo.dev/sbicard.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "SBI Cards": "https://img.logo.dev/sbicard.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "State Bank of India": "https://img.logo.dev/sbi.co.in?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Kotak Mahindra Bank": "https://img.logo.dev/kotak.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Kotak Bank": "https://img.logo.dev/kotak.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Kotak": "https://img.logo.dev/kotak.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "IndusInd Bank": "https://img.logo.dev/indusind.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "IndusInd": "https://img.logo.dev/indusind.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Yes Bank": "https://img.logo.dev/yesbank.in?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "RBL Bank": "https://img.logo.dev/rblbank.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "RBL": "https://img.logo.dev/rblbank.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "IDFC First Bank": "https://img.logo.dev/idfcfirstbank.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "IDFC First": "https://img.logo.dev/idfcfirstbank.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Federal Bank": "https://img.logo.dev/federalbank.co.in?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "AU Small Finance Bank": "https://img.logo.dev/aubank.in?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Bajaj Finserv": "https://img.logo.dev/bajajfinserv.in?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Bajaj Finance": "https://img.logo.dev/bajajfinserv.in?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Tata Capital": "https://img.logo.dev/tatacapital.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Standard Chartered": "https://img.logo.dev/sc.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Citi Bank": "https://img.logo.dev/citibank.co.in?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Citibank": "https://img.logo.dev/citibank.co.in?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "HSBC": "https://img.logo.dev/hsbc.co.in?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "American Express": "https://img.logo.dev/americanexpress.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
  "Amex": "https://img.logo.dev/americanexpress.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png",
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

export function getBankLogo(bankName: string): string {
  if (BANK_LOGOS[bankName]) {
    return BANK_LOGOS[bankName];
  }
  // Fallback: construct from bank name
  const slug = bankName.toLowerCase().replace(/\s+/g, "").replace(/bank$/i, "");
  return `https://img.logo.dev/${slug}.com?token=pk_a8TNe9MYRhSE6Rgc26MNYQ&size=80&format=png`;
}

export function getBankColor(bankName: string) {
  return BANK_COLORS[bankName] || DEFAULT_COLOR;
}
