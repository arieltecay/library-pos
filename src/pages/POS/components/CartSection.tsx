import { Cart } from "@/pages/POS/components/Cart/Cart.tsx";
import type { CartItem } from "@/pages/POS/components/Cart/types.ts";

interface CartSectionProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

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