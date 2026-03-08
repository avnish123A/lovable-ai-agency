import { useState } from "react";
import { motion } from "framer-motion";

const brands = [
  { name: "HDFC Bank", logo: "https://companieslogo.com/img/orig/HDB-bb6320d2.png" },
  { name: "ICICI Bank", logo: "https://companieslogo.com/img/orig/IBN-83cf8e93.png" },
  { name: "Axis Bank", logo: "https://companieslogo.com/img/orig/AXISBANK.NS-27e68e77.png" },
  { name: "SBI", logo: "https://companieslogo.com/img/orig/SBIN.NS-7a431f4f.png" },
  { name: "Kotak", logo: "https://companieslogo.com/img/orig/KOTAKBANK.NS-1cba0ccc.png" },
  { name: "IndusInd Bank", logo: "https://companieslogo.com/img/orig/INDUSINDBK.NS-f82eb4b9.png" },
  { name: "Yes Bank", logo: "https://companieslogo.com/img/orig/YESBANK.NS-08b36fa5.png" },
  { name: "Bajaj Finserv", logo: "https://companieslogo.com/img/orig/BAJFINANCE.NS-d8e019c6.png" },
  { name: "Paytm", logo: "https://companieslogo.com/img/orig/PAYTM.NS-1511ad11.png" },
  { name: "PhonePe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" },
  { name: "Razorpay", logo: "https://razorpay.com/assets/razorpay-logo.svg" },
  { name: "CRED", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/CRED_app_logo.png/480px-CRED_app_logo.png" },
];

const BrandItem = ({ name, logo }: { name: string; logo: string }) => {
  const [error, setError] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0 px-6">
      <div className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 p-2">
        {error ? (
          <span className="text-xs font-heading font-bold text-primary">{initials}</span>
        ) : (
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-full h-full object-contain"
            onError={() => setError(true)}
          />
        )}
      </div>
      <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">{name}</span>
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
          Trusted by India's Leading Brands & Banks
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
