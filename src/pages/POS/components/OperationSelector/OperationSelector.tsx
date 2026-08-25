import type { OperationMode } from "../../hooks/types";

interface OperationSelectorProps {
  operation: OperationMode;
  onChange: (op: OperationMode) => void;
  disabled?: boolean;
}

const OPERATIONS: { value: OperationMode; label: string; shortLabel: string }[] = [
  { value: "sale", label: "Venta", shortLabel: "Venta" },
  { value: "quote", label: "Presupuesto", shortLabel: "Presup." },
  { value: "return", label: "Devolución", shortLabel: "Devol." },
];

export function OperationSelector({ operation, onChange, disabled }: OperationSelectorProps) {
  return (
    <div className="flex bg-neutral-100 rounded-lg p-1" role="tablist" aria-label="Modo de operación">
      {OPERATIONS.map(({ value, label, shortLabel }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={operation === value}
          aria-controls={`panel-${value}`}
          onClick={() => !disabled && onChange(value)}
          disabled={disabled}
          className={`
            flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150
            ${operation === value
              ? "bg-white text-primary-600 shadow-sm"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{shortLabel}</span>
        </button>
      ))}
    </div>
  );
}