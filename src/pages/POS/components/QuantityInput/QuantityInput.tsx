import { forwardRef, useState, useEffect } from "react";
import type { QuantityInputProps } from "./types";

export const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(
  ({ value, onChange, min = 0, max, step = 1, disabled, className = "" }, ref) => {
    const [localValue, setLocalValue] = useState<string | number>(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      if (rawValue === "" || rawValue === "-") {
        setLocalValue(rawValue);
        return;
      }
      const numValue = parseFloat(rawValue);
      if (!isNaN(numValue)) {
        const clamped = Math.max(min, max !== undefined ? Math.min(numValue, max) : numValue);
        setLocalValue(clamped);
        onChange(clamped);
      }
    };

    const handleBlur = () => {
      if (localValue === "" || localValue === "-") {
        setLocalValue(min);
        onChange(min);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const current = typeof localValue === "number" ? localValue : min;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const newValue = Math.min(current + 1, max ?? Infinity);
        setLocalValue(newValue);
        onChange(newValue);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const newValue = Math.max(current - 1, min);
        setLocalValue(newValue);
        onChange(newValue);
      }
    };

    return (
      <input
        ref={ref}
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`w-16 text-center text-sm font-semibold rounded-lg border border-neutral-200 bg-white focus:border-primary-500 focus:outline-none px-2 py-1.5 ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      />
    );
  }
);

QuantityInput.displayName = "QuantityInput";