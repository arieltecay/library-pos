import type { Product } from "@/products/types";

export interface ProductSearchProps {
  products: Product[];
  search: string;
  onSearchChange: (value: string) => void;
  onAddProduct: (product: Product) => void;
  disabled?: boolean;
}

export type { Product };