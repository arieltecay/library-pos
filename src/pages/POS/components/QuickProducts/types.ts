import type { Product } from "../../../../types";

export interface QuickProductsProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export type { Product };