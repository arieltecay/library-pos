import type { PaymentPanelProps } from "./types";
import type { OperationMode } from "../../hooks/types";

const PAYMENT_METHODS = [
  { value: "cash", label: "Efectivo", icon: "payments" },
  { value: "transfer", label: "Transferencia", icon: "account_balance" },
  { value: "credit", label: "Crédito", icon: "credit_card" },
] as const;

const RETURN_METHODS = [
  { value: "cash", label: "Efectivo", icon: "payments" },
  { value: "transfer", label: "Transferencia", icon: "account_balance" },
  { value: "credit", label: "Crédito", icon: "credit_card" },
] as const;

function getButtonLabel(operation: OperationMode): string {
  switch (operation) {
    case "sale":
      return "COBRAR";
    case "quote":
      return "GENERAR PRESUPUESTO";
    case "return":
      return "CONFIRMAR DEVOLUCIÓN";
  }
}

function getShortcutKey(operation: OperationMode): string {
  switch (operation) {
    case "sale":
      return "F9";
    case "quote":
      return "F9";
    case "return":
      return "F9";
  }
}

export function PaymentPanel({
  subtotal,
  discountValue,
  discountType,
  setDiscountValue,
  setDiscountType,
  paymentMethod,
  setPaymentMethod,
  amountReceived,
  setAmountReceived,
  change,
  discountAmount,
  onCheckout,
  loading,
  disabled,
  operation,
}: PaymentPanelProps) {
  const isSale = operation === "sale";
  const isQuote = operation === "quote";
  const isReturn = operation === "return";

  const showAmountReceived = isSale && (paymentMethod === "cash" || paymentMethod === "transfer");
  const received = parseFloat(amountReceived) || 0;

  // For quote and return, we don't show amount received or change
  // For quote, we don't show payment method selector
  // For return, we show "Método de reintegro" instead of payment method

  return (
    <div className="w-[380px] flex flex-col gap-4 shrink-0">
      <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500 uppercase tracking-wide text-xs font-semibold self-center">Subtotal</span>
          <span className="font-semibold text-neutral-900">${subtotal.toLocaleString("es-AR")}</span>
        </div>

        {!isReturn && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-neutral-500 uppercase tracking-wide text-xs font-semibold">Descuento</span>
            <div className="flex items-center gap-1.5">
              <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
                <button
                  onClick={() => setDiscountType("$")}
                  className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${discountType === "$" ? "bg-primary-600 text-white" : "bg-white text-neutral-500 hover:bg-neutral-50"}`}
                >
                  $
                </button>
                <button
                  onClick={() => setDiscountType("%")}
                  className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${discountType === "%" ? "bg-primary-600 text-white" : "bg-white text-neutral-500 hover:bg-neutral-50"}`}
                >
                  %
                </button>
              </div>
              <input
                id="discount-input"
                type="number"
                min={0}
                max={discountType === "%" ? 100 : subtotal}
                value={discountValue || ""}
                onChange={(e) => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-24 px-2 py-1.5 rounded-lg border border-neutral-200 text-sm text-right focus:border-primary-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
        )}

        {discountAmount > 0 && !isReturn && (
          <div className="flex justify-between text-xs text-neutral-500">
            <span>Descuento aplicado</span>
            <span>−${discountAmount.toLocaleString("es-AR")}</span>
          </div>
        )}

        <div className="flex justify-between items-baseline pt-2">
          <span className="text-lg font-bold text-primary-600">TOTAL</span>
          <span className="text-3xl font-extrabold text-primary-600">${subtotal.toLocaleString("es-AR")}</span>
        </div>

        <div className="border-t border-neutral-200 pt-3 space-y-3">
          {showAmountReceived && (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-neutral-500 flex items-center gap-2">
                  Monto recibido
                  <kbd className="text-xs bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-200">F4</kbd>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-neutral-400">$</span>
                  <input
                    id="amount-received"
                    type="number"
                    min={0}
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg border border-neutral-200 text-sm text-right focus:border-primary-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
              {received > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-success-600 font-medium">Vuelto</span>
                  <span className="font-bold text-success-600">${change.toLocaleString("es-AR")}</span>
                </div>
              )}
            </>
          )}

          {isReturn && (
            <div className="space-y-3">
              <span className="text-neutral-500 uppercase tracking-wide text-xs font-semibold block">Método de reintegro</span>
              <div className="grid grid-cols-3 gap-2">
                {RETURN_METHODS.map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`px-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === method.value
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="material-icons text-lg">{method.icon}</span>
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSale && !isReturn && (
            <div className="space-y-3">
              <span className="text-neutral-500 uppercase tracking-wide text-xs font-semibold block">Método de pago</span>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`px-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === method.value
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="material-icons text-lg">{method.icon}</span>
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isQuote && (
            <div className="text-center text-sm text-neutral-500 py-2">
              No requiere método de pago ni monto recibido
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {}}
          className="flex-1 py-3.5 rounded-xl bg-danger-600 text-white font-bold hover:bg-danger-700 transition-colors flex items-center justify-center gap-2"
        >
          ANULAR
          <kbd className="text-xs bg-white/20 px-1.5 py-0.5 rounded">ESC</kbd>
        </button>
        <button
          onClick={onCheckout}
          disabled={loading || disabled}
          className="flex-1 py-3.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {getButtonLabel(operation)}
          <kbd className="text-xs bg-white/20 px-1.5 py-0.5 rounded">{getShortcutKey(operation)}</kbd>
        </button>
      </div>
    </div>
  );
}