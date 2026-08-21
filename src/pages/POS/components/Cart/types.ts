import type { CartItem, SaleItem } from "../types";

export interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export type { CartItem, SaleItem };