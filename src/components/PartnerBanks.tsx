import { useState } from "react";
import { motion } from "framer-motion";

const banks = [
  { name: "HDFC Bank", logo: "https://logo.clearbit.com/hdfcbank.com" },
  { name: "ICICI Bank", logo: "https://logo.clearbit.com/icicibank.com" },
  { name: "Axis Bank", logo: "https://logo.clearbit.com/axisbank.com" },
  { name: "SBI", logo: "https://logo.clearbit.com/sbi.co.in" },
  { name: "Kotak Bank", logo: "https://logo.clearbit.com/kotak.com" },
  { name: "IndusInd Bank", logo: "https://logo.clearbit.com/indusind.com" },
  { name: "Yes Bank", logo: "https://logo.clearbit.com/yesbank.in" },
  { name: "RBL Bank", logo: "https://logo.clearbit.com/rblbank.com" },
  { name: "IDFC First", logo: "https://logo.clearbit.com/idfcfirstbank.com" },
  { name: "Bajaj Finserv", logo: "https://logo.clearbit.com/bajajfinserv.in" },
  { name: "Paytm", logo: "https://logo.clearbit.com/paytm.com" },
  { name: "PhonePe", logo: "https://logo.clearbit.com/phonepe.com" },
  { name: "CRED", logo: "https://logo.clearbit.com/cred.club" },
  { name: "Flipkart", logo: "https://logo.clearbit.com/flipkart.com" },
  { name: "Amazon India", logo: "https://logo.clearbit.com/amazon.in" },
  { name: "Swiggy", logo: "https://logo.clearbit.com/swiggy.com" },
];

const BankItem = ({ name, logo }: { name: string; logo: string }) => {
  const [error, setError] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2 min-w-[100px] mx-6">
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
  // Double the array for seamless infinite scroll
  const doubled = [...banks, ...banks];

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

        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {doubled.map((bank, i) => (
            <BankItem key={`${bank.name}-${i}`} name={bank.name} logo={bank.logo} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerBanks;
