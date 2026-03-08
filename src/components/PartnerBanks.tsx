import { motion } from "framer-motion";

const banks = [
  { name: "HDFC Bank", logo: "https://logo.clearbit.com/hdfcbank.com" },
  { name: "ICICI Bank", logo: "https://logo.clearbit.com/icicibank.com" },
  { name: "Axis Bank", logo: "https://logo.clearbit.com/axisbank.com" },
  { name: "SBI Cards", logo: "https://logo.clearbit.com/sbicard.com" },
  { name: "Kotak Bank", logo: "https://logo.clearbit.com/kotak.com" },
  { name: "IndusInd Bank", logo: "https://logo.clearbit.com/indusind.com" },
  { name: "Yes Bank", logo: "https://logo.clearbit.com/yesbank.in" },
  { name: "RBL Bank", logo: "https://logo.clearbit.com/rblbank.com" },
];

const PartnerBanks = () => {
  return (
    <section className="py-16 border-b border-border">
      <div className="container mx-auto px-4 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground font-medium uppercase tracking-wider mb-10"
        >
          Trusted Partners from India's Top Banks
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {banks.map((bank) => (
            <div
              key={bank.name}
              className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <img
                src={bank.logo}
                alt={`${bank.name} logo`}
                className="h-10 w-10 rounded-lg object-contain bg-card p-1"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-xs text-muted-foreground font-medium">{bank.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnerBanks;
