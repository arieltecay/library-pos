export interface CartItem {
  product: string;
  name: string;
  type: "product" | "service";
  quantity: number;
  unitPrice: number;
  subtotal: number;
  stock: number;
}

export interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}