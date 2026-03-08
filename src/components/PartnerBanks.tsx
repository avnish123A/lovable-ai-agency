import { motion } from "framer-motion";
import { getBankLogo } from "@/lib/bank-utils";
import { useState } from "react";

const banks = [
  { name: "HDFC Bank" },
  { name: "ICICI Bank" },
  { name: "Axis Bank" },
  { name: "SBI Cards" },
  { name: "Kotak Mahindra Bank" },
  { name: "IndusInd Bank" },
  { name: "Yes Bank" },
  { name: "RBL Bank" },
];

const BankItem = ({ name }: { name: string }) => {
  const [error, setError] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-105">
      <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden">
        {error ? (
          <span className="text-[10px] font-heading font-bold text-primary">{initials}</span>
        ) : (
          <img
            src={getBankLogo(name)}
            alt={`${name} logo`}
            className="w-full h-full object-contain p-1"
            loading="lazy"
            onError={() => setError(true)}
          />
        )}
      </div>
      <span className="text-xs text-muted-foreground font-medium">{name}</span>
    </div>
  );
};

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
          className="flex flex-wrap justify-center items-center gap-8 md:gap-14"
        >
          {banks.map((bank, i) => (
            <motion.div
              key={bank.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <BankItem name={bank.name} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnerBanks;
