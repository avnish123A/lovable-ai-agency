import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface WhatIfSliderProps {
  label: string;
  baseValue: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onResult: (delta: number) => string;
}

const WhatIfSlider = ({ label, baseValue, min, max, step, format, onResult }: WhatIfSliderProps) => {
  const [val, setVal] = useState(baseValue);
  const delta = val - baseValue;
  const fmtFn = format || ((v: number) => `₹${v.toLocaleString("en-IN")}`);
  const resultText = onResult(delta);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 to-transparent p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-foreground">What If Simulator</span>
      </div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-primary">{fmtFn(val)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full accent-primary"
      />
      {delta !== 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-primary mt-2 font-medium"
        >
          💡 {resultText}
        </motion.p>
      )}
    </motion.div>
  );
};

export default WhatIfSlider;
