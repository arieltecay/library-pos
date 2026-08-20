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