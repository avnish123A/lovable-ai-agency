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
  { name: "HDFC ERGO", logo: "/logos/hdfc-ergo.png" },
  { name: "Paytm", logo: "/logos/paytm.png" },
  { name: "PhonePe", logo: "/logos/phonepe.png" },
  { name: "Razorpay", logo: "/logos/razorpay.png" },
];

const BrandItem = ({ name, logo }: { name: string; logo: string }) => {
  const [error, setError] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0 px-8 group">
      <div className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center overflow-hidden p-3 group-hover:shadow-apple transition-all duration-500 ease-luxury">
        {error ? (
          <span className="text-sm font-semibold text-foreground">{initials}</span>
        ) : (
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-all duration-500 ease-luxury"
            loading="eager"
            onError={() => setError(true)}
          />
        )}
      </div>
      <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap group-hover:text-foreground transition-colors duration-300">{name}</span>
    </div>
  );
};

const PartnerBanks = () => (
  <section className="py-14 border-b border-border overflow-hidden">
    <div className="container mx-auto px-4 md:px-8">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center text-xs font-medium tracking-wide uppercase text-muted-foreground mb-8"
      >
        Trusted by India's Leading Banks & Financial Brands
      </motion.p>
    </div>

    <div className="relative w-full">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <div className="marquee-track">
        <div className="marquee-content">
          {brands.map(brand => <BrandItem key={brand.name} name={brand.name} logo={brand.logo} />)}
        </div>
        <div className="marquee-content" aria-hidden="true">
          {brands.map(brand => <BrandItem key={`dup-${brand.name}`} name={brand.name} logo={brand.logo} />)}
        </div>
      </div>
    </div>
  </section>
);

export default PartnerBanks;
