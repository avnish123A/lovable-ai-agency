import { useState, useEffect, useRef } from "react";

interface EditableSliderInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  suffix?: string;
  prefix?: string;
}

const EditableSliderInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
  suffix = "",
  prefix = "",
}: EditableSliderInputProps) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = format
    ? format(value)
    : `${prefix}${value.toLocaleString("en-IN")}${suffix}`;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleEdit = () => {
    setInputValue(String(value));
    setEditing(true);
  };

  const commitValue = () => {
    setEditing(false);
    const parsed = parseFloat(inputValue.replace(/,/g, ""));
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      // Round to step
      const rounded = Math.round(clamped / step) * step;
      onChange(parseFloat(rounded.toFixed(10)));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitValue();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-muted-foreground">{label}</span>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={commitValue}
            onKeyDown={handleKeyDown}
            className="w-28 text-right rounded-md border border-primary bg-background px-2 py-0.5 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          />
        ) : (
          <button
            onClick={handleEdit}
            className="font-semibold text-foreground hover:text-primary cursor-text px-2 py-0.5 rounded-md hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
            title="Click to edit"
          >
            {displayValue}
          </button>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
        <span>{format ? format(min) : `${prefix}${min.toLocaleString("en-IN")}${suffix}`}</span>
        <span>{format ? format(max) : `${prefix}${max.toLocaleString("en-IN")}${suffix}`}</span>
      </div>
    </div>
  );
};

export default EditableSliderInput;
