import type { SaleItem } from "@/cart/types";

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  amountReceived: number;
  change: number;
  paymentMethod: "cash" | "transfer" | "credit";
  type: "sale" | "return";
  client: string;
  seller: string;
  cashShift: string;
  voided: boolean;
  createdAt: string;
}

export interface SalePreview {
  items: Array<{
    product: string;
    name: string;
    type: "product" | "service";
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  amountReceived?: number;
  change?: number;
  paymentMethod: "cash" | "transfer" | "credit";
  creditBalanceAfter?: number;
}