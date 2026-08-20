import { PaymentPanel } from "@/pages/POS/components/PaymentPanel/PaymentPanel.tsx";

interface PaymentSectionProps {
  subtotal: number;
  discountValue: number;
  discountType: "$" | "%";
  setDiscountValue: (v: number) => void;
  setDiscountType: (t: "$" | "%") => void;
  paymentMethod: "cash" | "transfer" | "credit";
  setPaymentMethod: (m: "cash" | "transfer" | "credit") => void;
  amountReceived: string;
  setAmountReceived: (v: string) => void;
  change: number;
  discountAmount: number;
  onCheckout: () => void;
  loading: boolean;
  disabled: boolean;
}

export function PaymentSection({
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
}: PaymentSectionProps) {
  return (
    <PaymentPanel
      subtotal={subtotal}
      discountValue={discountValue}
      discountType={discountType}
      setDiscountValue={setDiscountValue}
      setDiscountType={setDiscountType}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      amountReceived={amountReceived}
      setAmountReceived={setAmountReceived}
      change={change}
      discountAmount={discountAmount}
      onCheckout={onCheckout}
      loading={loading}
      disabled={disabled}
    />
  );
}