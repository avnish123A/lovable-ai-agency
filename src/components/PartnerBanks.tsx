import { useState } from "react";
import { motion } from "framer-motion";

const TOKEN = "pk_a8TNe9MYRhSE6Rgc26MNYQ";
const logoUrl = (domain: string) =>
  `https://img.logo.dev/${domain}?token=${TOKEN}&size=80&format=png`;

const brands = [
  { name: "HDFC Bank", logo: logoUrl("hdfcbank.com") },
  { name: "ICICI Bank", logo: logoUrl("icicibank.com") },
  { name: "Axis Bank", logo: logoUrl("axisbank.com") },
  { name: "SBI", logo: logoUrl("sbi.co.in") },
  { name: "Kotak Bank", logo: logoUrl("kotak.com") },
  { name: "IndusInd Bank", logo: logoUrl("indusind.com") },
  { name: "Yes Bank", logo: logoUrl("yesbank.in") },
  { name: "RBL Bank", logo: logoUrl("rblbank.com") },
  { name: "IDFC First", logo: logoUrl("idfcfirstbank.com") },
  { name: "Bajaj Finserv", logo: logoUrl("bajajfinserv.in") },
  { name: "Paytm", logo: logoUrl("paytm.com") },
  { name: "PhonePe", logo: logoUrl("phonepe.com") },
  { name: "CRED", logo: logoUrl("cred.club") },
  { name: "Flipkart", logo: logoUrl("flipkart.com") },
  { name: "Amazon India", logo: logoUrl("amazon.in") },
  { name: "Swiggy", logo: logoUrl("swiggy.com") },
];

const BrandItem = ({ name, logo }: { name: string; logo: string }) => {
  const [error, setError] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0 px-6">
      <div className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {error ? (
          <span className="text-xs font-heading font-bold text-primary">{initials}</span>
        ) : (
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-10 h-10 object-contain"
            loading="lazy"
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

      {/* Marquee container */}
      <div className="relative w-full">
        {/* Fade edges */}
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
