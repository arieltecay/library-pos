import type { CartItemProps } from "./types";
import { QuantityInput } from "../QuantityInput/QuantityInput";

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="grid grid-cols-[130px_1fr_90px_110px_36px] gap-2 px-3 py-2.5 items-center border-b border-neutral-50 last:border-0">
      <div className="flex items-center gap-1">
        <QuantityInput
          value={item.quantity}
          onChange={(qty: number) => onUpdateQuantity(item.product, qty)}
          min={1}
          max={item.stock > 0 ? item.stock : undefined}
        />
      </div>
      <span className="text-sm font-medium text-neutral-900 truncate">{item.name}</span>
      <span className="text-right text-sm text-neutral-600">${item.unitPrice.toLocaleString("es-AR")}</span>
      <span className="text-right text-sm font-bold text-neutral-900">${item.subtotal.toLocaleString("es-AR")}</span>
      <button
        onClick={() => onRemove(item.product)}
        className="w-7 h-7 flex items-center justify-center text-danger-500 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors"
        aria-label={`Quitar ${item.name}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}