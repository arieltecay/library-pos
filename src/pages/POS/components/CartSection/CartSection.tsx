import { Cart } from "@/pages/POS/components/Cart/Cart.tsx";
import type { CartSectionProps } from "./types";

export function CartSection({ cart, onUpdateQuantity, onRemove, onClear }: CartSectionProps) {
  return (
    <Cart
      cart={cart}
      onUpdateQuantity={onUpdateQuantity}
      onRemove={onRemove}
      onClear={onClear}
    />
  );
}