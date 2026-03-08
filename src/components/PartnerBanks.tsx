import { useState } from "react";
import { motion } from "framer-motion";

const brands = [
  { name: "HDFC Bank", logo: "/logos/hdfc.png" },
  { name: "ICICI Bank", logo: "/logos/icici.png" },
  { name: "Axis Bank", logo: "/logos/axis.png" },
  { name: "SBI", logo: "/logos/sbi.png" },
  { name: "Kotak Mahindra", logo: "/logos/kotak.png" },
  { name: "IndusInd Bank", logo: "/logos/indusind.png" },
  { name: "Yes Bank", logo: "/logos/yesbank.png" },
  { name: "Bajaj Finserv", logo: "/logos/bajaj.png" },
  { name: "AU Bank", logo: "/logos/au-bank.png" },
  { name: "RBL Bank", logo: "/logos/rbl.png" },
  { name: "Bank of Baroda", logo: "/logos/bob.png" },
  { name: "Zerodha", logo: "/logos/zerodha.png" },
  { name: "Groww", logo: "/logos/groww.png" },
  { name: "Upstox", logo: "/logos/upstox.png" },
  { name: "ICICI Prudential", logo: "/logos/icici-prudential.png" },
  { name: "HDFC ERGO", logo: "/logos/hdfc-ergo.png" },
  { name: "Paytm", logo: "/logos/paytm.png" },
  { name: "PhonePe", logo: "/logos/phonepe.png" },
  { name: "Razorpay", logo: "/logos/razorpay.png" },
];

const BrandItem = ({ name, logo }: { name: string; logo: string }) => {
  const [error, setError] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0 px-8">
      <div className="h-20 w-20 rounded-2xl bg-card border border-border flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 p-3">
        {error ? (
          <span className="text-sm font-heading font-bold text-primary">{initials}</span>
        ) : (
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-full h-full object-contain"
            loading="eager"
            onError={() => setError(true)}
          />
        )}
      </div>
      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">{name}</span>
    </div>
  );
};

const PartnerBanks = () => {
  return (
    <section className="py-14 border-b border-border overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground font-medium uppercase tracking-wider mb-10"
        >
          Trusted by India's Leading Banks & Financial Brands
        </motion.p>
      </div>

      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <div className="marquee-track">
          <div className="marquee-content">
            {brands.map((brand) => (
              <BrandItem key={brand.name} name={brand.name} logo={brand.logo} />
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {brands.map((brand) => (
              <BrandItem key={`dup-${brand.name}`} name={brand.name} logo={brand.logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerBanks;
