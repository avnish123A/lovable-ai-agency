import { useState } from "react";
import { motion } from "framer-motion";

const brands = [
  { name: "HDFC Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg" },
  { name: "ICICI Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg" },
  { name: "Axis Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Axis_Bank_logo.svg" },
  { name: "SBI", logo: "https://upload.wikimedia.org/wikipedia/en/5/58/State_Bank_of_India_logo.svg" },
  { name: "Kotak", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Kotak_Mahindra_Bank_logo.svg" },
  { name: "IndusInd", logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/IndusInd_Bank_logo.svg" },
  { name: "Yes Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Yes_Bank_SVG_Logo.svg" },
  { name: "RBL Bank", logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/RBL_Bank_SVG_Logo.svg" },
  { name: "IDFC First", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/IDFC_First_Bank_logo.svg" },
  { name: "Bajaj Finserv", logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/Bajaj_Finserv_Logo.svg" },
  { name: "Paytm", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" },
  { name: "PhonePe", logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" },
  { name: "CRED", logo: "https://upload.wikimedia.org/wikipedia/en/3/3d/CRED_%28FinTech_company%29_logo.svg" },
  { name: "Flipkart", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" },
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
