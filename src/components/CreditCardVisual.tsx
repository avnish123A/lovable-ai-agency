import { getBankColor } from "@/lib/bank-utils";

interface CreditCardVisualProps {
  bankName: string;
  cardName: string;
  className?: string;
}

const CreditCardVisual = ({ bankName, cardName, className = "" }: CreditCardVisualProps) => {
  const color = getBankColor(bankName);

  return (
    <div className={`relative w-full aspect-[1.586/1] rounded-xl overflow-hidden shadow-elegant ${className}`}>
      {/* Card background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient}`} />
      
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />
      
      {/* Card content */}
      <div className="relative h-full flex flex-col justify-between p-4">
        {/* Bank name */}
        <div className="flex items-center justify-between">
          <span className="text-white/90 text-[10px] font-bold uppercase tracking-wider">
            {bankName}
          </span>
          <div className="flex gap-0.5">
            <div className="w-4 h-4 rounded-full bg-white/30" />
            <div className="w-4 h-4 rounded-full bg-white/20 -ml-1.5" />
          </div>
        </div>

        {/* Chip */}
        <div className="w-8 h-6 rounded bg-gradient-to-br from-yellow-300/80 to-yellow-600/80 border border-yellow-400/30" />

        {/* Card number dots */}
        <div className="flex gap-3">
          {[0, 1, 2, 3].map((group) => (
            <div key={group} className="flex gap-0.5">
              {[0, 1, 2, 3].map((dot) => (
                <div key={dot} className="w-1.5 h-1.5 rounded-full bg-white/50" />
              ))}
            </div>
          ))}
        </div>

        {/* Card name */}
        <div className="flex items-end justify-between">
          <span className="text-white/70 text-[8px] font-medium uppercase tracking-wide truncate max-w-[70%]">
            {cardName}
          </span>
          <span className="text-white/50 text-[7px] font-medium">VALID THRU</span>
        </div>
      </div>
    </div>
  );
};

export default CreditCardVisual;
