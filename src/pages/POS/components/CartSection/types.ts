import type { CartItem } from "../Cart/types";

export interface CartSectionProps {
  cart: CartItem[];
  onUpdateQuantity: (_productId: string, _quantity: number) => void;
  onRemove: (_productId: string) => void;
  onClear: () => void;
}