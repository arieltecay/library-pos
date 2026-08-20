import type { Product } from "@/products/types";

export interface QuickProductsProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export type { Product };