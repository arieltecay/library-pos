export interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  receipt: ReceiptData;
}

export interface ReceiptData {
  number: number;
  type: "sale" | "quote" | "return";
  items: Array<{
    product: string;
    name: string;
    type: "product" | "service";
    quantity: number;
    unitPrice: number;
    unitCost?: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod?: "cash" | "transfer" | "credit";
  amountReceived?: number;
  change?: number;
  client?: { id: string; fullName: string; balance: number } | null;
  seller: { id: string; name: string; role: string };
  createdAt: string;
}