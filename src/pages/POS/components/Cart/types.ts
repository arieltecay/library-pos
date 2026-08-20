export interface SaleItem {
  product: string;
  name: string;
  type: "product" | "service";
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartItem extends SaleItem {
  stock: number;
}

export interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}