import type { Product } from "../types";

export interface ProductSectionProps {
  products: Product[];
  search: string;
  onSearchChange: (_value: string) => void;
  onAddProduct: (_product: Product) => void;
  disabled: boolean;
}